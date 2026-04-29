import React, { useEffect, useState } from 'react';

function Swan({ size = 60, opacity = 1, wingSpeed = '0.5s' }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 80 48" style={{ display: 'block' }}>
      <ellipse cx="40" cy="32" rx="22" ry="10" fill="white" opacity={opacity} />
      <path d="M52 28 C56 20, 60 14, 58 10 C56 6, 52 8, 50 12 C48 18, 46 24, 44 28 Z" fill="white" opacity={opacity} />
      <ellipse cx="57" cy="9" rx="5" ry="4" fill="white" opacity={opacity} />
      <path d="M61 8 L68 9 L61 11 Z" fill="#f4a261" />
      <circle cx="59" cy="7.5" r="1" fill="#1a0a2e" />
      <g style={{ animation: `swanWingUp ${wingSpeed} ease-in-out infinite` }}>
        <path d="M36 28 C28 18, 14 14, 10 20 C16 18, 28 22, 36 32 Z" fill="white" opacity={opacity * 0.9} />
      </g>
      <g style={{ animation: `swanWingDown ${wingSpeed} ease-in-out infinite` }}>
        <path d="M36 34 C28 38, 16 40, 12 36 C18 36, 28 34, 36 30 Z" fill="white" opacity={opacity * 0.7} />
      </g>
      <path d="M18 32 C12 28, 6 30, 4 34 C8 32, 14 33, 18 36 Z" fill="white" opacity={opacity * 0.8} />
    </svg>
  );
}

const SWANS = [
  { anim:'welcomeSwan1', dur:'10s', delay:'0s',   top:'12%', size:55, speed:'0.4s' },
  { anim:'welcomeSwan2', dur:'14s', delay:'3s',   top:'28%', size:38, speed:'0.5s' },
  { anim:'welcomeSwan3', dur:'9s',  delay:'1.5s', top:'18%', size:45, speed:'0.35s' },
  { anim:'welcomeSwan4', dur:'16s', delay:'5s',   top:'38%', size:30, speed:'0.6s' },
  { anim:'welcomeSwan2', dur:'11s', delay:'7s',   top:'8%',  size:35, speed:'0.45s' },
  { anim:'welcomeSwan1', dur:'13s', delay:'2s',   top:'45%', size:28, speed:'0.55s' },
  { anim:'welcomeSwan3', dur:'8s',  delay:'9s',   top:'22%', size:50, speed:'0.4s' },
];

export default function WelcomePage({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #0d0a1a 0%, #12083a 45%, #0a1628 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>

      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:'10%', left:'5%', width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        animation:'orb 10s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'15%', right:'5%', width:250, height:250, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        animation:'orb 12s ease-in-out infinite reverse' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', width:400, height:400, borderRadius:'50%',
        transform:'translate(-50%,-50%)',
        background:'radial-gradient(circle, rgba(176,106,255,0.06) 0%, transparent 70%)' }} />

      {/* Stars */}
      {[...Array(40)].map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${(i * 41 + 13) % 100}%`,
          top:`${(i * 59 + 7) % 90}%`,
          width: i % 4 === 0 ? 2.5 : 1.5,
          height: i % 4 === 0 ? 2.5 : 1.5,
          borderRadius:'50%',
          background:`rgba(${180 + i % 40}, ${160 + i % 60}, 255, 0.5)`,
          animation:`pulse ${2 + (i % 5) * 0.4}s ease-in-out infinite`,
          animationDelay:`${(i * 0.2) % 3}s`,
        }} />
      ))}

      {/* Background swans flock */}
      {SWANS.map((s, i) => (
        <div key={i} style={{
          position:'absolute', top: s.top, left:0,
          animation:`${s.anim} ${s.dur} linear ${s.delay} infinite`,
          pointerEvents:'none',
        }}>
          <Swan size={s.size} opacity={0.9} wingSpeed={s.speed} />
        </div>
      ))}

      {/* Content */}
      <div style={{
        textAlign:'center', zIndex:10, padding:'0 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition:'all 1s ease',
      }}>
        {/* Swan icon */}
        <div style={{ marginBottom:20, filter:'drop-shadow(0 0 20px rgba(176,106,255,0.6))', animation:'float 3s ease-in-out infinite' }}>
          <Swan size={90} opacity={1} wingSpeed="0.4s" />
        </div>

        <div style={{ fontSize:10, letterSpacing:8, color:'#6a3a9a', marginBottom:12, fontFamily:'Rajdhani, sans-serif' }}>
          SOCIAL MEDIA INTELLIGENCE
        </div>

        <h1 style={{
          fontFamily:'Cinzel, serif', fontSize: 38, fontWeight:900, letterSpacing:4, lineHeight:1.15,
          margin:'0 0 8px',
          background:'linear-gradient(135deg, #e0d0ff 0%, #06b6d4 50%, #b06aff 100%)',
          backgroundSize:'200% auto',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          animation:'shimmer 4s linear infinite',
        }}>
          FAKE DETECTOR
        </h1>

        <p style={{
          fontSize:14, color:'#7a5a9a', letterSpacing:2, marginBottom:36,
          fontFamily:'Rajdhani, sans-serif',
        }}>
          ML-POWERED · INSTAGRAM PROFILE ANALYSIS
        </p>

        {/* Feature pills */}
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:40 }}>
          {['🤖 ML Model', '📊 Real Dataset', '🦢 90%+ Accuracy'].map((f, i) => (
            <div key={i} style={{
              padding:'6px 14px', borderRadius:20, fontSize:11, fontFamily:'Rajdhani, sans-serif',
              letterSpacing:1, border:'1px solid rgba(176,106,255,0.3)',
              background:'rgba(124,58,237,0.1)', color:'#c4a8ff',
            }}>{f}</div>
          ))}
        </div>

        {/* CTA button */}
        <button onClick={onStart} style={{
          padding:'14px 48px',
          background:'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border:'none', borderRadius:12,
          color:'white', fontSize:14, fontWeight:700, letterSpacing:4,
          cursor:'pointer', fontFamily:'Cinzel, serif',
          boxShadow:'0 8px 32px rgba(124,58,237,0.4)',
          transition:'all 0.3s ease',
        }}
          onMouseEnter={e => { e.target.style.transform='scale(1.05)'; e.target.style.boxShadow='0 12px 40px rgba(124,58,237,0.6)'; }}
          onMouseLeave={e => { e.target.style.transform='scale(1)'; e.target.style.boxShadow='0 8px 32px rgba(124,58,237,0.4)'; }}
        >
          START ANALYSIS
        </button>
      </div>
    </div>
  );
}