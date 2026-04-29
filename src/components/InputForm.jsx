import React from 'react';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

function InputField({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        display: 'block', fontSize: 10, letterSpacing: 3,
        color: '#6a4a8a', marginBottom: 5, fontFamily: 'Rajdhani, sans-serif',
      }}>{label}</label>
      <input
        name={name} value={value} onChange={onChange}
        type={type} placeholder={placeholder}
        style={{
          width: '100%', padding: '11px 14px',
          background: '#13102a', border: '1px solid #2a1a4a',
          borderRadius: 8, color: '#d0c8f0', fontSize: 14,
          outline: 'none', transition: 'border-color 0.2s',
          fontFamily: 'Rajdhani, sans-serif', letterSpacing: 0.5,
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = '#7c3aed'}
        onBlur={e  => e.target.style.borderColor = '#2a1a4a'}
      />
    </div>
  );
}

export default function InputForm({ form, onChange, onSubmit, loading, error }) {
  const canSubmit = form.username.trim().length > 0 && !loading;

  const followers = parseInt(form.followers) || 0;
  const following = parseInt(form.following) || 0;
  const ratio     = followers > 0 ? (following / followers).toFixed(1) : null;
  const isSuspicious = followers > 0 && following >= followers * 2;

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeInUp 0.6s ease both' }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: '#3a1f5a', marginBottom: 10, fontFamily: 'Rajdhani, sans-serif' }}>
          SOCIAL MEDIA INTELLIGENCE
        </div>
        <h1 style={{
          fontFamily: 'Cinzel, serif', fontSize: 30, fontWeight: 900,
          letterSpacing: 3, margin: 0,
          background: 'linear-gradient(135deg, #e0d0ff 0%, #06b6d4 50%, #b06aff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2,
        }}>FAKE DETECTOR</h1>
        <div style={{ fontSize: 11, color: '#3a1f5a', marginTop: 8, letterSpacing: 3, fontFamily: 'Rajdhani, sans-serif' }}>
          ML-POWERED PROFILE ANALYSIS
        </div>
      </div>

      {/* Form card */}
      <div style={{
        background: '#0f0c22', border: '1px solid #2a1a4a',
        borderRadius: 16, padding: '22px 20px', marginBottom: 14,
        animation: 'fadeInUp 0.6s ease 0.15s both',
      }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: '#3a1f5a', marginBottom: 18, fontFamily: 'Rajdhani, sans-serif' }}>
          ENTER PROFILE DETAILS
        </div>

        {/* Username */}
        <InputField label="USERNAME *" name="username" value={form.username}
          onChange={onChange} placeholder="@username or handle" />

        {/* Followers / Following */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InputField label="FOLLOWERS" name="followers" value={form.followers}
            onChange={onChange} type="number" placeholder="e.g. 228" />
          <InputField label="FOLLOWING" name="following" value={form.following}
            onChange={onChange} type="number" placeholder="e.g. 236" />
        </div>

        {/* Posts */}
        <InputField label="TOTAL POSTS" name="posts" value={form.posts}
          onChange={onChange} type="number" placeholder="e.g. 45" />

        {/* Live ratio indicator */}
        {ratio && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8, marginBottom: 12,
            background: isSuspicious ? '#ff3b3b11' : '#00e67611',
            border: `1px solid ${isSuspicious ? '#ff3b3b44' : '#00e67644'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: isSuspicious ? '#ff3b3b' : '#00e676',
              boxShadow: `0 0 6px ${isSuspicious ? '#ff3b3b' : '#00e676'}`,
            }} />
            <span style={{ fontSize: 12, fontFamily: 'Rajdhani, sans-serif', color: isSuspicious ? '#ff6b6b' : '#6bcb77' }}>
              Ratio: <strong>{ratio}x</strong>
              {isSuspicious ? ' — ⚠ Suspicious! (2x+ = fake signal)' : ' — Looks normal'}
            </span>
          </div>
        )}

        {/* Account Created Year */}
        <div style={{ marginBottom: 12 }}>
          <label style={{
            display: 'block', fontSize: 10, letterSpacing: 3,
            color: '#6a4a8a', marginBottom: 5, fontFamily: 'Rajdhani, sans-serif',
          }}>ACCOUNT CREATED YEAR</label>
          <select
            name="accountYear" value={form.accountYear || ''} onChange={onChange}
            style={{
              width: '100%', padding: '11px 14px',
              background: '#13102a', border: '1px solid #2a1a4a',
              borderRadius: 8, color: form.accountYear ? '#d0c8f0' : '#4a3a6a',
              fontSize: 14, outline: 'none', fontFamily: 'Rajdhani, sans-serif',
              cursor: 'pointer', boxSizing: 'border-box',
            }}
          >
            <option value="">Select year...</option>
            {years.map(y => (
              <option key={y} value={y} style={{ background: '#13102a' }}>{y}</option>
            ))}
          </select>
          {form.accountYear && (
            <div style={{ fontSize: 11, color: '#4a3a6a', marginTop: 4, fontFamily: 'Rajdhani, sans-serif' }}>
              Account age: ~{currentYear - parseInt(form.accountYear)} year{currentYear - parseInt(form.accountYear) !== 1 ? 's' : ''} old
            </div>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#3a2a5a', marginTop: 4, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>
          * Username மட்டும் required. மத்தவை போட்டால் accuracy அதிகமாகும்.
        </div>
      </div>

      {error && (
        <div style={{
          color: '#ff6b6b', fontSize: 12, textAlign: 'center',
          marginBottom: 12, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1,
          padding: '8px', background: '#ff3b3b11', borderRadius: 8,
          border: '1px solid #ff3b3b33',
        }}>⚠ {error}</div>
      )}

      <button
        onClick={onSubmit} disabled={!canSubmit}
        style={{
          width: '100%', padding: '14px',
          background: canSubmit
            ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
            : '#0f0c22',
          border: canSubmit ? 'none' : '1px solid #2a1a4a',
          borderRadius: 10,
          color: canSubmit ? 'white' : '#3a2a5a',
          fontSize: 13, fontWeight: 700, letterSpacing: 4,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          fontFamily: 'Cinzel, serif', transition: 'all 0.3s',
          boxShadow: canSubmit ? '0 4px 24px rgba(124,58,237,0.3)' : 'none',
        }}
        onMouseEnter={e => { if (canSubmit) e.target.style.boxShadow = '0 8px 32px rgba(124,58,237,0.5)'; }}
        onMouseLeave={e => { if (canSubmit) e.target.style.boxShadow = '0 4px 24px rgba(124,58,237,0.3)'; }}
      >
        ANALYZE PROFILE
      </button>

      {!form.username && (
        <div style={{
          textAlign: 'center', fontSize: 11, color: '#2a1a4a',
          marginTop: 8, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 2,
        }}>
          ENTER USERNAME TO BEGIN
        </div>
      )}
    </div>
  );
}