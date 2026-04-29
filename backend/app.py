from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

print("Loading model...")
with open('model.pkl', 'rb') as f:
    saved = pickle.load(f)

model    = saved['model']
features = saved['features']
print(f"Model loaded! Features: {features}")

def safe_int(val, default=0):
    try:
        return int(val) if val != '' and val is not None else default
    except:
        return default

def build_input(data):
    username   = data.get('username', '') or ''
    followers  = safe_int(data.get('followers'), 0)
    following  = safe_int(data.get('following'), 0)
    posts      = safe_int(data.get('posts'), 0)
    has_pic    = safe_int(data.get('profilePic'), 1)
    fullname   = data.get('fullname', '') or ''
    bio        = data.get('bio', '') or ''
    has_url    = safe_int(data.get('hasUrl'), 0)
    is_private = safe_int(data.get('isPrivate'), 0)

    account_year = data.get('accountYear', '')
    if account_year and str(account_year).strip():
        days_old = (2026 - int(account_year)) * 365
    else:
        days_old = 365

    nums_in_username = sum(c.isdigit() for c in username)
    username_length  = len(username) if len(username) > 0 else 1
    nums_ratio       = nums_in_username / username_length
    fullname_len     = len(fullname) if fullname else 1

    row = {
        'profile pic':          has_pic,
        'nums/length username': round(nums_ratio, 4),
        'fullname words':       len(fullname.split()) if fullname else 0,
        'nums/length fullname': sum(c.isdigit() for c in fullname) / fullname_len,
        'name==username':       int(fullname.lower().replace(' ', '') == username.lower()),
        'description length':   len(bio),
        'external URL':         has_url,
        'private':              is_private,
        '#posts':               posts,
        '#followers':           followers,
        '#follows':             following,
    }
    return [row.get(f, 0) for f in features]


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(f"Received: {data}")

        input_vals  = build_input(data)
        input_array = np.array([input_vals])

        prediction  = model.predict(input_array)[0]
        probability = model.predict_proba(input_array)[0]

        fake_prob = float(probability[1]) * 100
        real_prob = float(probability[0]) * 100

        username     = data.get('username', '') or ''
        followers    = safe_int(data.get('followers'), 0)
        following    = safe_int(data.get('following'), 0)
        posts        = safe_int(data.get('posts'), 0)
        has_pic      = safe_int(data.get('profilePic'), 1)
        nums_in_name = sum(c.isdigit() for c in username)

        account_year = data.get('accountYear', '')
        account_age_years = (2026 - int(account_year)) if account_year and str(account_year).strip() else None

        # ✅ Red flags collect பண்ணுவோம்
        red_flags = []
        green_flags = []

        if nums_in_name > 3:
            red_flags.append(f"Username-ல் {nums_in_name} numbers இருக்கு — bot pattern")
        
        ratio_suspicious = followers > 0 and following >= followers * 2
        if ratio_suspicious:
            ratio_val = round(following / max(followers, 1), 1)
            red_flags.append(f"Following {ratio_val}x அதிகமா இருக்கு ({following} vs {followers} followers)")
        
        if posts == 0:
            red_flags.append("எந்த post-உம் இல்ல — inactive account")
        
        if not has_pic:
            red_flags.append("Profile picture இல்ல")
        
        if followers > 1000 and posts < 5:
            red_flags.append("Followers அதிகம், posts குறைவு")
        
        if account_age_years is not None and account_age_years <= 1 and following > 500:
            red_flags.append(f"புது account ({account_age_years} yr), {following} பேரை follow பண்றாங்க")

        # Green flags
        if has_pic:
            green_flags.append("Profile picture இருக்கு")
        if posts > 10:
            green_flags.append(f"{posts} posts — active account")
        if followers > following and followers > 0:
            green_flags.append("Followers > Following — organic growth")
        if nums_in_name == 0:
            green_flags.append("Username-ல் numbers இல்ல — natural name")
        if account_age_years is not None and account_age_years >= 3:
            green_flags.append(f"{account_age_years} years பழைய account — established")

        # ✅ 2+ red flags இருந்தா மட்டும் FAKE override
        red_flag_count = len(red_flags)

        # 2x ratio boost
        if ratio_suspicious:
            boost     = min((following / max(followers, 1)) * 5, 20)
            fake_prob = min(fake_prob + boost, 99)
            real_prob = max(real_prob - boost, 1)

        # ✅ Key rule: 1 red flag மட்டும் இருந்தா REAL-க்கு lean பண்ணு
        if red_flag_count <= 1 and fake_prob < 80:
            fake_prob = min(fake_prob, 45)
            real_prob = max(real_prob, 55)

        # ✅ 0 red flags இருந்தா definitely REAL
        if red_flag_count == 0:
            fake_prob = min(fake_prob, 25)
            real_prob = max(real_prob, 75)

        risk_score = round(fake_prob)

        # ✅ Verdict — 2+ red flags இருந்தா மட்டும் FAKE
        if red_flag_count >= 2:
            verdict = 'FAKE'
        elif red_flag_count == 1 and fake_prob >= 70:
            verdict = 'FAKE'
        else:
            verdict = 'REAL'

        confidence = (
            'High'   if fake_prob > 75 or real_prob > 75 else
            'Medium' if fake_prob > 50 or real_prob > 50 else
            'Low'
        )

        ratio_display = f"{round(following / max(followers,1), 1)}x" if followers > 0 else "N/A"

        return jsonify({
            'verdict':    verdict,
            'riskScore':  risk_score,
            'confidence': confidence,
            'fakePct':    round(fake_prob, 1),
            'realPct':    round(real_prob, 1),
            'summary': (
                f"இந்த account fake ஆக இருக்க {fake_prob:.1f}% probability இருக்கு. {red_flag_count} red flag(s) detect ஆச்சு."
                if verdict == 'FAKE' else
                f"இந்த account real ஆக இருக்க {real_prob:.1f}% probability இருக்கு. Profile signals genuine-ஆ தெரியுது."
            ),
            'redFlags':   red_flags,
            'greenFlags': green_flags,
            'signals': {
                'followerRatio':   { 'value': f"{followers} followers / {following} following ({ratio_display})", 'suspicious': ratio_suspicious },
                'usernamePattern': { 'value': f"{nums_in_name} numbers in username", 'suspicious': nums_in_name > 3 },
                'postActivity':    { 'value': f"{posts} total posts", 'suspicious': posts < 3 },
                'accountAge':      { 'value': f"{account_age_years} years old" if account_age_years else "Unknown", 'suspicious': account_age_years is not None and account_age_years <= 1 },
            }
        })

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'features': features})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Flask server starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)