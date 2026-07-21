'use client'

import { useEffect, useRef } from 'react'

export default function AnimWidget() {
  const bubblesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = bubblesRef.current
    if (!container) return
    for (let i = 0; i < 9; i++) {
      const b = document.createElement('div')
      const dx = (Math.random() * 40 - 20).toFixed(0) + 'px'
      const size = (4 + Math.random() * 4).toFixed(0) + 'px'
      b.style.cssText = `
        position:absolute;bottom:0;border-radius:50%;
        background:rgba(230,240,200,0.65);
        animation:awBubbleRise 2.4s ease-in infinite;
        width:${size};height:${size};
        left:${(Math.random() * 30 - 15).toFixed(0)}px;
        animation-delay:${(Math.random() * 2.4).toFixed(2)}s;
        --dx:${dx};
      `
      container.appendChild(b)
    }
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16/10',
      overflow: 'hidden',
      borderRadius: '20px',
      background: 'linear-gradient(155deg, #10190B 0%, #38541F 55%, #7FA34A 100%)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
      marginBottom: '1.5rem',
    }}>
      {/* Floating blocks */}
      {[
        { style: { width:'22%', height:'20%', top:'6%', left:'4%', animationDelay:'0s' } },
        { style: { width:'9%', height:'9%', top:'28%', left:'9%', background:'#EFF5B8', opacity:0.22, animationDelay:'0.8s' } },
        { style: { width:'14%', height:'12%', top:'64%', left:'2%', animationDelay:'1.6s' } },
        { style: { width:'10%', height:'16%', top:'8%', right:'6%', opacity:0.12, animationDelay:'0.4s' } },
        { style: { width:'7%', height:'7%', bottom:'10%', right:'12%', background:'#EFF5B8', opacity:0.2, animationDelay:'1.2s' } },
      ].map((b, i) => (
        <div key={i} style={{
          position:'absolute', background:'#D6E85C', opacity:0.16, borderRadius:'6px',
          animation:'awFloat 6s ease-in-out infinite',
          ...b.style,
        }} />
      ))}

      {/* Water area */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, height:'52%', overflow:'hidden' }}>
        <div style={{
          position:'absolute', inset:0, top:'10px',
          background:'linear-gradient(180deg, rgba(140,165,80,0.4) 0%, rgba(70,90,40,0.85) 100%)',
        }} />
        {/* Wave */}
        <div style={{
          position:'absolute', top:0, left:0, width:'200%', height:'16px',
          display:'flex', animation:'awWaveScroll 5s linear infinite',
        }}>
          {[0,1].map(i => (
            <svg key={i} viewBox="0 0 400 16" preserveAspectRatio="none" style={{ display:'block', width:'50%', height:'16px' }}>
              <path d="M0 8 C 50 0, 100 16, 150 8 S 250 0, 300 8 S 400 16, 400 8 V16 H0 Z" fill="rgba(150,175,90,0.55)" />
            </svg>
          ))}
        </div>
        {/* Ripples */}
        <div style={{ position:'absolute', left:'50%', top:'10px', width:'1px', height:'1px' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              position:'absolute', left:0, top:0, width:'120px', height:'24px',
              marginLeft:'-60px', marginTop:'-12px',
              border:'2px solid #EFF5B8', borderRadius:'50%',
              opacity:0,
              animation:'awRippleTimeline 10s ease-out infinite',
              animationDelay:`${i * 0.15}s`,
            }} />
          ))}
        </div>
        {/* Bubbles container */}
        <div ref={bubblesRef} style={{
          position:'absolute', left:'50%', bottom:'30%',
          width:'1px', height:'1px', opacity:0,
          animation:'awBubblesVisible 10s ease-in-out infinite',
        }} />
      </div>

      {/* Device drop */}
      <div style={{
        position:'absolute', left:'50%', top:'38%',
        width:'78px', height:'78px', marginLeft:'-39px', marginTop:'-39px',
        animation:'awDeviceTimeline 10s cubic-bezier(.4,0,.2,1) infinite',
      }}>
        <div style={{
          width:'100%', height:'100%', borderRadius:'26px',
          background:'linear-gradient(155deg, #2a2a27 0%, #3E2723 60%, #0e0e0d 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 14px 26px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
          <svg viewBox="0 0 40 40" fill="none" stroke="#c7d95a" strokeWidth="1.4" style={{ width:'34px', height:'34px', opacity:0.75 }}>
            <path d="M20 6 C 12 10, 10 20, 20 34 C 30 20, 28 10, 20 6 Z" />
            <path d="M20 34 C 20 24, 20 16, 20 8" />
            <path d="M20 20 C 14 18, 9 20, 6 24" />
            <path d="M20 20 C 26 18, 31 20, 34 24" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes awFloat {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-10px)}
        }
        @keyframes awWaveScroll {
          from{transform:translateX(0)}
          to{transform:translateX(-50%)}
        }
        @keyframes awRippleTimeline {
          0%,39%{opacity:0;transform:scale(0.3)}
          41%{opacity:0.7;transform:scale(0.5)}
          56%{opacity:0;transform:scale(2.4)}
          100%{opacity:0;transform:scale(2.4)}
        }
        @keyframes awBubblesVisible {
          0%,38%{opacity:0}
          42%,92%{opacity:1}
          97%,100%{opacity:0}
        }
        @keyframes awBubbleRise {
          0%{transform:translate(0,0) scale(0.6);opacity:0}
          15%{opacity:0.8}
          100%{transform:translate(var(--dx),-90px) scale(1);opacity:0}
        }
        @keyframes awDeviceTimeline {
          0%{opacity:0;transform:translateY(-220px) scale(1,1)}
          3%{opacity:1}
          20%{transform:translateY(-220px) scale(1,1)}
          40%{transform:translateY(0) scale(1,1)}
          42%{transform:translateY(4px) scale(1.16,0.82)}
          46%{transform:translateY(-6px) scale(0.94,1.06)}
          50%{transform:translateY(0) scale(1,1)}
          58%{transform:translateY(-5px) scale(1,1)}
          66%{transform:translateY(0) scale(1,1)}
          74%{transform:translateY(-5px) scale(1,1)}
          82%{transform:translateY(0) scale(1,1)}
          90%{opacity:1;transform:translateY(0) scale(1,1)}
          96%{opacity:0;transform:translateY(-220px) scale(1,1)}
          100%{opacity:0;transform:translateY(-220px) scale(1,1)}
        }
      `}</style>
    </div>
  )
}
