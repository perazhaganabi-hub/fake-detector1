import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle

# ✅ Dataset load பண்ணுவோம்
print("📂 Dataset loading...")
train_df = pd.read_csv('dataset/train.csv')
test_df  = pd.read_csv('dataset/test.csv')

print(f"✅ Train data: {len(train_df)} rows")
print(f"✅ Test data:  {len(test_df)} rows")
print(f"\n📊 Columns: {list(train_df.columns)}")

# ✅ Features & Label split
LABEL_COL = 'fake'  # target column

FEATURES = [col for col in train_df.columns if col != LABEL_COL]

X_train = train_df[FEATURES]
y_train = train_df[LABEL_COL]

X_test  = test_df[FEATURES]
y_test  = test_df[LABEL_COL]

print(f"\n🔍 Features used: {FEATURES}")

# ✅ Model train பண்ணுவோம்
print("\n🤖 Training Random Forest model...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# ✅ Accuracy check
y_pred   = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n🎯 Model Accuracy: {accuracy * 100:.2f}%")
print("\n📈 Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Real', 'Fake']))

# ✅ Feature importance
importances = pd.Series(model.feature_importances_, index=FEATURES)
print("\n🏆 Top Features:")
print(importances.sort_values(ascending=False).head(8))

# ✅ Model save பண்ணுவோம்
with open('model.pkl', 'wb') as f:
    pickle.dump({'model': model, 'features': FEATURES}, f)

print("\n✅ Model saved as model.pkl — Ready to use!")