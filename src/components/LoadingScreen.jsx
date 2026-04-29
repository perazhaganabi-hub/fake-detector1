import React, { useEffect, useState } from 'react';

function Swan({ size = 80, color = 'white', opacity = 1, wingSpeed = '0.45s' }) {
  const s = size / 80;
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 80 48" style={{ display: 'block' }}>
      <ellipse cx="40" cy="32" rx="22" ry="10" fill={color} opacity={opacity} />
      <path d="M52 28 C56 20, 60 14, 58 10 C56 6, 52 8, 50 12 C48 18, 46 24, 44 28 Z"
        fill={color} opacity={opacity} />
      <ellipse cx="57" cy="9" rx="5" ry="4" fill={color} opacity={opacity} />
      <path d="M61 8 L68 9 L61 11 Z" fill="#f4a261" />
      <circle cx="59" cy="7.5" r="1" fill="#1a0a2e" />
      <g style={{ animation: `swanWingUp ${wingSpeed} ease-in-out infinite` }}>
        <path d="M36 28 C28 18, 14 14, 10 20 C16 18, 28 22, 36 32 Z" fill={color} opacity={opacity * 0.9} />
      </g>
      <g style={{ animation: `swanWingDown ${wingSpeed} ease-in-out infinite` }}>
        <path d="M36 34 C28 38, 16 40, 12 36 C18 36, 28 34, 36 30 Z" fill={color} opacity={opacity * 0.7} />
      </g>
      <path d="M18 32 C12 28, 6 30, 4 34 C8 32, 14 33, 18 36 Z" fill={color} opacity={opacity * 0.8} />
    </svg>
  );
}

// Circular progress ring that swan flies around
function ProgressRing({ progress }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  // Swan position on the ring
  const angle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
  const swanX = 90 + r * Math.cos(angle);
  const swanY = 90 + r * Math.sin(angle);
  const swanRotate = (progress / 100) * 360 - 90;

  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ animation: 'ringPulse 2s ease-in-out infinite' }}>
        {/* Track */}
        <circle cx="90" cy="90" r={r} fill="none" stroke="#2a1a4a" strokeWidth="6" />
        {/* Progress */}
        <circle cx="90" cy="90" r={r} fill="none"
          stroke="url(#progressGrad)" strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        {/* Glow */}
        <circle cx="90" cy="90" r={r} fill="none"
          stroke="#b06aff" strokeWidth="1" opacity="0.3"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#b06aff" />
          </linearGradient>
        </defs>
        {/* Score text */}
        <text x="90" y="85" textAnchor="middle" fill="#e8e0f0"
          fontSize="28" fontWeight="900" fontFamily="Cinzel, serif">
          {Math.round(progress)}
        </text>
        <text x="90" y="105" textAnchor="middle" fill="#6a4a8a"
          fontSize="10" fontFamily="Rajdhani, sans-serif" letterSpacing="2">
          SCANNING
        </text>
      </svg>

      {/* Swan on ring */}
      <div style={{
        position: 'absolute',
        left: swanX - 20,
        top:  swanY - 14,
        transform: `rotate(${swanRotate + 90}deg)`,
        filter: 'drop-shadow(0 0 8px rgba(176,106,255,0.8))',
        transition: 'left 0.4s ease, top 0.4s ease',
      }}>
        <Swan size={38} color="white" wingSpeed="0.3s" />
      </div>
    </div>
  );
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots]         = useState('');

  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400);
    const p = setInterval(() => setProgress(v => v >= 95 ? v : v + Math.random() * 6), 280);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  const steps = [
    { label: 'Scanning username patterns', threshold: 20 },
    { label: 'Analyzing follower ratio',   threshold: 45 },
    { label: 'Checking account signals',   threshold: 70 },
    { label: 'Running ML inference',       threshold: 90 },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden',
      background: 'linear-gradient(135deg, #0d0a1a 0%, #12083a 40%, #0a1628 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>

      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:'15%', left:'10%', width:200, height:200, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        animation:'orb 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'8%', width:160, height:160, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        animation:'orb 10s ease-in-out infinite reverse' }} />

      {/* Stars */}
      {[...Array(25)].map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${(i * 37 + 7) % 100}%`,
          top:`${(i * 53 + 11) % 70}%`,
          width: i % 3 === 0 ? 2 : 1.2,
          height: i % 3 === 0 ? 2 : 1.2,
          borderRadius:'50%',
          background:'rgba(200,180,255,0.5)',
          animation:`pulse ${1.5 + (i % 4) * 0.5}s ease-in-out infinite`,
          animationDelay:`${(i * 0.3) % 2}s`,
        }} />
      ))}

      {/* Background swans flock */}
      {[
        { anim:'swanBg1', dur:'7s', delay:'0s',   top:'20%', size:40 },
        { anim:'swanBg2', dur:'9s', delay:'2.5s', top:'35%', size:30 },
        { anim:'swanBg3', dur:'6s', delay:'4s',   top:'15%', size:35 },
        { anim:'swanBg1', dur:'8s', delay:'1.5s', top:'28%', size:25 },
        { anim:'swanBg2', dur:'11s',delay:'3s',   top:'42%', size:28 },
      ].map((s, i) => (
        <div key={i} style={{
          position:'absolute', top: s.top, left: 0,
          animation:`${s.anim} ${s.dur} linear ${s.delay} infinite`,
          pointerEvents:'none',
        }}>
          <Swan size={s.size} color="rgba(200,180,255,1)" wingSpeed="0.5s" />
        </div>
      ))}

      {/* Title */}
      <div style={{ textAlign:'center', marginBottom:28, animation:'fadeInUp 0.7s ease both', zIndex:10 }}>
        <div style={{ fontSize:10, letterSpacing:6, color:'#6a4a8a', marginBottom:8, fontFamily:'Rajdhani, sans-serif' }}>
          SOCIAL INTELLIGENCE
        </div>
        <h1 style={{
          fontFamily:'Cinzel, serif', fontSize:28, fontWeight:900, letterSpacing:4, margin:0,
          background:'linear-gradient(135deg, #e0d0ff, #06b6d4, #b06aff)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>
          ANALYZING
        </h1>
        <div style={{ fontSize:12, color:'#6a4a8a', marginTop:6, letterSpacing:3, fontFamily:'Rajdhani, sans-serif' }}>
          PROFILE SCAN IN PROGRESS{dots}
        </div>
      </div>

      {/* Circular ring with swan */}
      <div style={{ animation:'fadeInScale 0.8s ease 0.2s both', zIndex:10, marginBottom:28 }}>
        <ProgressRing progress={Math.min(progress, 95)} />
      </div>

      {/* Steps */}
      <div style={{
        width:'100%', maxWidth:300, padding:'0 24px',
        animation:'fadeInUp 0.8s ease 0.4s both', zIndex:10,
      }}>
        {steps.map((step, i) => {
          const active = progress >= step.threshold;
          return (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:10, marginBottom:7,
              opacity: active ? 1 : 0.2, transition:'opacity 0.5s ease',
            }}>
              <div style={{
                width:6, height:6, borderRadius:'50%', flexShrink:0,
                background: active ? '#b06aff' : '#2a1a4a',
                boxShadow: active ? '0 0 8px #b06aff' : 'none',
                transition:'all 0.4s ease',
              }} />
              <div style={{
                fontSize:11, letterSpacing:2, fontFamily:'Rajdhani, sans-serif',
                color: active ? '#c4a8ff' : '#3a2a5a',
              }}>
                {step.label.toUpperCase()}
              </div>
              {active && <div style={{ marginLeft:'auto', fontSize:11, color:'#06b6d4' }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}