import React from 'react';
import RiskMeter from './RiskMeter';

function Flag({ text, type }) {
  const color = type === 'red' ? '#ff6b6b' : '#6bcb77';
  const bg    = type === 'red' ? '#ff3b3b11' : '#00e67611';
  const border= type === 'red' ? '#ff3b3b33' : '#00e67633';
  return (
    <div style={{
      fontSize: 13, color, padding: '7px 12px', marginBottom: 6,
      borderRadius: 8, background: bg, border: `1px solid ${border}`,
      borderLeft: `3px solid ${color}`,
      fontFamily: 'Rajdhani, sans-serif', letterSpacing: 0.5,
      animation: 'fadeInUp 0.4s ease both',
    }}>
      {text}
    </div>
  );
}

function SignalRow({ label, value, suspicious }) {
  const color = suspicious ? '#ff6b6b' : '#6bcb77';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px', marginBottom: 5, borderRadius: 8,
      background: suspicious ? '#ff3b3b08' : '#00e67608',
      border: `1px solid ${suspicious ? '#ff3b3b22' : '#00e67622'}`,
    }}>
      <span style={{ fontSize: 12, color: '#666', fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>
        {label.replace(/([A-Z])/g, ' $1').toUpperCase()}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 10,
        background: color + '22', color, fontFamily: 'Rajdhani, sans-serif',
      }}>
        {value}
      </span>
    </div>
  );
}

export default function ResultCard({ result, onReset }) {
  const isFake  = result.verdict === 'FAKE';
  const accent  = isFake ? '#ff3b3b' : '#00e676';

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '0 16px 40px' }}>

      {/* Verdict banner */}
      <div style={{
        borderRadius: 16, padding: '20px 20px',
        background: accent + '0c',
        border: `1.5px solid ${accent}44`,
        textAlign: 'center', marginBottom: 14,
        animation: 'fadeInUp 0.5s ease both',
        boxShadow: `0 0 40px ${accent}10`,
      }}>
        <div style={{ fontSize: 42, marginBottom: 6 }}>
          {isFake ? '🚨' : '✅'}
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 26, fontWeight: 900, letterSpacing: 4, color: accent,
        }}>
          {isFake ? 'FAKE PROFILE' : 'REAL PROFILE'}
        </div>
        <div style={{
          fontSize: 11, color: '#555', marginTop: 5,
          letterSpacing: 3, fontFamily: 'Rajdhani, sans-serif',
        }}>
          CONFIDENCE · {result.confidence?.toUpperCase()}
        </div>
      </div>

      {/* Risk meter */}
      <div style={{
        background: '#0c0c1e', border: '1px solid #1a1a30',
        borderRadius: 16, padding: '20px 16px', marginBottom: 14,
        animation: 'fadeInUp 0.5s ease 0.1s both',
      }}>
        <RiskMeter score={result.riskScore} />
      </div>

      {/* Summary */}
      <div style={{
        background: '#0c0c1e', border: '1px solid #1a1a30',
        borderRadius: 16, padding: '16px', marginBottom: 14,
        animation: 'fadeInUp 0.5s ease 0.2s both',
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 4, color: '#333',
          marginBottom: 10, fontFamily: 'Rajdhani, sans-serif',
        }}>
          AI SUMMARY
        </div>
        <p style={{
          fontSize: 14, color: '#bbb', lineHeight: 1.7, margin: 0,
          fontFamily: 'Rajdhani, sans-serif',
        }}>
          {result.summary}
        </p>
      </div>

      {/* Signals */}
      {result.signals && (
        <div style={{
          background: '#0c0c1e', border: '1px solid #1a1a30',
          borderRadius: 16, padding: '16px', marginBottom: 14,
          animation: 'fadeInUp 0.5s ease 0.3s both',
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 4, color: '#333',
            marginBottom: 10, fontFamily: 'Rajdhani, sans-serif',
          }}>
            SIGNAL BREAKDOWN
          </div>
          {Object.entries(result.signals).map(([key, val]) => (
            <SignalRow key={key} label={key} value={val.value} suspicious={val.suspicious} />
          ))}
        </div>
      )}

      {/* Red flags */}
      {result.redFlags?.length > 0 && (
        <div style={{
          background: '#0c0c1e', border: '1px solid #ff3b3b22',
          borderRadius: 16, padding: '16px', marginBottom: 14,
          animation: 'fadeInUp 0.5s ease 0.4s both',
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 4, color: '#ff6b6b',
            marginBottom: 10, fontFamily: 'Rajdhani, sans-serif',
          }}>
            🚩 RED FLAGS
          </div>
          {result.redFlags.map((f, i) => <Flag key={i} text={f} type="red" />)}
        </div>
      )}

      {/* Green flags */}
      {result.greenFlags?.length > 0 && (
        <div style={{
          background: '#0c0c1e', border: '1px solid #00e67622',
          borderRadius: 16, padding: '16px', marginBottom: 20,
          animation: 'fadeInUp 0.5s ease 0.5s both',
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 4, color: '#6bcb77',
            marginBottom: 10, fontFamily: 'Rajdhani, sans-serif',
          }}>
            ✅ GREEN FLAGS
          </div>
          {result.greenFlags.map((f, i) => <Flag key={i} text={f} type="green" />)}
        </div>
      )}

      {/* Reset button */}
      <button onClick={onReset} style={{
        width: '100%', padding: '13px',
        background: 'transparent', border: '1px solid #1e1e3a',
        borderRadius: 10, color: '#555',
        fontSize: 12, fontWeight: 700, letterSpacing: 3,
        cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.target.style.borderColor = '#3a3a6a'; e.target.style.color = '#888'; }}
        onMouseLeave={e => { e.target.style.borderColor = '#1e1e3a'; e.target.style.color = '#555'; }}
      >
        ← ANALYZE ANOTHER PROFILE
      </button>
    </div>
  );
}