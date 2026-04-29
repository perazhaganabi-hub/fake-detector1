import React from 'react';

export default function RiskMeter({ score }) {
  const color  = score >= 75 ? '#ff3b3b' : score >= 45 ? '#ffaa00' : '#00e676';
  const label  = score >= 75 ? 'HIGH RISK'   : score >= 45 ? 'MEDIUM RISK' : 'LOW RISK';
  const circumference = 2 * Math.PI * 65;

  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Track */}
          <circle cx="80" cy="80" r="65" fill="none"
            stroke="#0f0f2a" strokeWidth="14" />
          {/* Progress */}
          <circle cx="80" cy="80" r="65" fill="none"
            stroke={color} strokeWidth="14"
            strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
          />
          {/* Glow ring */}
          <circle cx="80" cy="80" r="65" fill="none"
            stroke={color} strokeWidth="2" opacity="0.2"
            strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 40, fontWeight: 900, color,
            fontFamily: 'Cinzel, serif', lineHeight: 1,
          }}>
            {score}
          </div>
          <div style={{ fontSize: 10, color: '#333', letterSpacing: 2, fontFamily: 'Rajdhani, sans-serif' }}>
            / 100
          </div>
        </div>
      </div>
      <div style={{
        display: 'inline-block', marginTop: 10,
        padding: '4px 20px', borderRadius: 20,
        background: color + '18', border: `1px solid ${color}55`,
        color, fontSize: 11, fontWeight: 700,
        letterSpacing: 3, fontFamily: 'Rajdhani, sans-serif',
        boxShadow: `0 0 16px ${color}22`,
      }}>
        {label}
      </div>
    </div>
  );
}