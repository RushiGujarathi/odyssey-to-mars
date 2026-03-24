import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useSounds } from './SoundEngine'

export default function MissionPathSelector({ onSelect }) {
  const [chosen, setChosen] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const [hovered, setHovered] = useState(null)
  const { sounds } = useSounds() || { sounds: {} }
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('missionPath')
    if (saved) { onSelect?.(saved); setDismissed(true) }
  }, [])

  // Animated starfield background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      twSpeed: Math.random() * 0.018 + 0.004,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.tw += s.twSpeed
        const alpha = 0.2 + Math.sin(s.tw) * 0.35
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,210,255,${Math.max(0, alpha).toFixed(2)})`
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  const pick = (path) => {
    if (chosen) return
    sounds?.achievement?.()
    setChosen(path)
    sessionStorage.setItem('missionPath', path)

    const el = document.getElementById('path-selector')
    const otherCard = document.getElementById(`card-${path === 'fast' ? 'exploration' : 'fast'}`)
    const chosenCard = document.getElementById(`card-${path}`)

    // Fade out the other card first
    gsap.to(otherCard, { opacity: 0, scale: 0.92, x: path === 'fast' ? 60 : -60, duration: 0.35, ease: 'power2.in' })

    if (path === 'fast') {
      // FAST MISSION — warp speed: everything streaks horizontally and blasts off
      gsap.to(chosenCard, { scale: 1.05, duration: 0.25, ease: 'power2.out' })
      gsap.to(chosenCard, { scale: 0.98, duration: 0.15, delay: 0.25 })

      // Warp lines appear via canvas overlay
      const warpCanvas = document.getElementById('warp-overlay')
      if (warpCanvas) {
        const wctx = warpCanvas.getContext('2d')
        warpCanvas.style.opacity = '1'
        let frame = 0
        const warpAnim = () => {
          wctx.clearRect(0, 0, warpCanvas.width, warpCanvas.height)
          frame++
          const progress = Math.min(frame / 20, 1)
          for (let i = 0; i < 60; i++) {
            const y = (i / 60) * warpCanvas.height
            const len = progress * (200 + Math.random() * 300)
            const x = Math.random() * warpCanvas.width
            const alpha = 0.06 + progress * 0.25
            wctx.beginPath()
            wctx.moveTo(x, y)
            wctx.lineTo(x + len, y + (Math.random() - 0.5) * 2)
            wctx.strokeStyle = `rgba(0,212,255,${alpha})`
            wctx.lineWidth = Math.random() * 1.5 + 0.3
            wctx.stroke()
          }
          if (frame < 25) requestAnimationFrame(warpAnim)
        }
        requestAnimationFrame(warpAnim)
      }

      // Whole screen collapses to a point horizontally (warp jump)
      gsap.to(el, {
        scaleX: 0.01, opacity: 0,
        duration: 0.45, delay: 0.55, ease: 'power4.in',
        onComplete: () => { setDismissed(true); onSelect?.(path) }
      })

    } else {
      // EXPLORATION MISSION — slow, majestic, the universe expands
      gsap.to(chosenCard, { scale: 1.04, duration: 0.5, ease: 'power1.out' })

      // Stars speed up gently
      gsap.to(canvasRef.current, { opacity: 1.0, duration: 0.3 })

      // Slow grand fade outward like drifting into deep space
      gsap.to(el, {
        scale: 1.12, opacity: 0,
        duration: 0.9, delay: 0.65, ease: 'power1.in',
        onComplete: () => { setDismissed(true); onSelect?.(path) }
      })
    }
  }

  if (dismissed) return null

  return (
    <div
      id="path-selector"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: 'rgba(5,7,14,0.97)' }}
    >
      {/* Starfield background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.65 }} />

      {/* Warp overlay canvas for fast mission effect */}
      <canvas
        id="warp-overlay"
        width={typeof window !== 'undefined' ? window.innerWidth : 1440}
        height={typeof window !== 'undefined' ? window.innerHeight : 900}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0, transition: 'opacity 0.2s' }}
      />

      <div className="relative z-10 max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs text-white/35 tracking-[0.35em]">MISSION CONTROL · PRE-LAUNCH</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
            CHOOSE YOUR PATH
          </h2>
          <p className="font-body text-white/40 max-w-sm mx-auto text-sm leading-relaxed">
            Your mission route shapes your journey. Choose wisely —<br />
            you can't turn back once we leave orbit.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">

          {/* ── FAST MISSION ── */}
          <button
            id="card-fast"
            onClick={() => pick('fast')}
            onMouseEnter={() => { setHovered('fast'); sounds?.hover?.() }}
            onMouseLeave={() => setHovered(null)}
            disabled={!!chosen}
            className="text-left rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
            style={{
              border: `2px solid ${chosen === 'fast' ? '#00d4ff' : hovered === 'fast' ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
              background: chosen === 'fast' ? 'rgba(0,212,255,0.08)' : hovered === 'fast' ? 'rgba(0,212,255,0.04)' : 'rgba(13,27,42,0.85)',
              boxShadow: chosen === 'fast' ? '0 0 50px rgba(0,212,255,0.2), inset 0 0 40px rgba(0,212,255,0.04)' : hovered === 'fast' ? '0 0 25px rgba(0,212,255,0.12)' : 'none',
              transform: chosen === 'fast' ? 'translateY(-5px) scale(1.02)' : hovered === 'fast' ? 'translateY(-2px)' : 'none',
            }}
          >
            {/* Cyan glow corner */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-300"
              style={{ background: 'radial-gradient(circle at top right, rgba(0,212,255,0.14), transparent)', opacity: hovered === 'fast' || chosen === 'fast' ? 1 : 0 }} />

            {/* Speed lines visual — unique to fast mission */}
            <div className="relative h-14 rounded-lg overflow-hidden mb-5"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="absolute h-px"
                  style={{
                    top: `${10 + i * 9}%`,
                    right: 0,
                    width: `${25 + (i % 3) * 20}%`,
                    background: `linear-gradient(90deg, transparent, rgba(0,212,255,${0.15 + i * 0.06}), rgba(0,212,255,0.7))`,
                    animation: `warpLine ${0.55 + i * 0.09}s linear infinite`,
                    animationDelay: `${i * 0.07}s`,
                  }} />
              ))}
              {/* Rocket icon flying right */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                style={{ animation: 'rocketBoost 1.8s ease-in-out infinite', filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' }}>
                🚀
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-400/50 tracking-widest">MARS →</div>
            </div>

            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-400 bg-cyan-400/08"
                style={{ fontSize: 9, letterSpacing: '0.14em' }}>FASTEST ROUTE</span>
              <span className="font-mono text-xs text-white/25">6 MONTHS</span>
            </div>

            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-display text-xl font-black text-white mb-1">Fast Mission</h3>
            <p className="font-mono text-xs mb-3 text-cyan-400">Direct Mars Transfer</p>
            <p className="font-body text-sm text-white/50 leading-relaxed mb-5">
              Hohmann orbit. 6 months. Maximum efficiency. No detours — just you, the void, and Mars.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[['6 months', 'Duration'], ['Moderate', 'Risk'], ['Basic', 'Science']].map(([v, l]) => (
                <div key={l} className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
                  <p className="font-mono text-xs font-bold text-cyan-400">{v}</p>
                  <p className="font-mono text-white/25 mt-0.5" style={{ fontSize: 9 }}>{l}</p>
                </div>
              ))}
            </div>

            {/* Route */}
            <div className="mt-4 flex items-center gap-2 font-mono text-xs text-white/30">
              <span>🌍</span><span className="text-cyan-400/50">━━━━━━━━━━</span><span>🔴</span>
            </div>

            {chosen === 'fast' && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-xs text-cyan-400 tracking-widest">WARP DRIVE ENGAGED…</span>
              </div>
            )}
          </button>

          {/* ── EXPLORATION MISSION ── */}
          <button
            id="card-exploration"
            onClick={() => pick('exploration')}
            onMouseEnter={() => { setHovered('exploration'); sounds?.hover?.() }}
            onMouseLeave={() => setHovered(null)}
            disabled={!!chosen}
            className="text-left rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
            style={{
              border: `2px solid ${chosen === 'exploration' ? '#8b5cf6' : hovered === 'exploration' ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.08)'}`,
              background: chosen === 'exploration' ? 'rgba(139,92,246,0.08)' : hovered === 'exploration' ? 'rgba(139,92,246,0.04)' : 'rgba(13,27,42,0.85)',
              boxShadow: chosen === 'exploration' ? '0 0 50px rgba(139,92,246,0.2), inset 0 0 40px rgba(139,92,246,0.04)' : hovered === 'exploration' ? '0 0 25px rgba(139,92,246,0.12)' : 'none',
              transform: chosen === 'exploration' ? 'translateY(-5px) scale(1.02)' : hovered === 'exploration' ? 'translateY(-2px)' : 'none',
            }}
          >
            {/* Purple glow corner */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-300"
              style={{ background: 'radial-gradient(circle at top right, rgba(139,92,246,0.16), transparent)', opacity: hovered === 'exploration' || chosen === 'exploration' ? 1 : 0 }} />

            {/* Grand tour orbit visual — unique to exploration */}
            <div className="relative h-14 rounded-lg overflow-hidden mb-5"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 56" preserveAspectRatio="none">
                {/* Curved grand tour path */}
                <path d="M12 44 Q70 8 130 28 Q180 46 248 14"
                  fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.2" strokeDasharray="4 3" />
                {/* Planets */}
                <circle cx="12" cy="44" r="4" fill="#1a6b9e" />
                <circle cx="100" cy="18" r="7" fill="#c49a3a" opacity="0.9" />
                {/* Saturn rings */}
                <ellipse cx="100" cy="18" rx="11" ry="3" fill="none" stroke="rgba(196,154,58,0.4)" strokeWidth="1" />
                {/* Asteroid belt dots */}
                {[140, 150, 158, 166, 175].map((x, i) => (
                  <circle key={i} cx={x} cy={32 + (i % 2) * 5} r="1.5" fill="rgba(180,140,80,0.6)" />
                ))}
                <circle cx="248" cy="14" r="5" fill="#c1440e" />
                {/* Animated spacecraft dot */}
                <circle r="2.5" fill="rgba(139,92,246,0.9)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M12 44 Q70 8 130 28 Q180 46 248 14" />
                </circle>
              </svg>
            </div>

            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono px-2.5 py-1 rounded-full border border-purple-400/30 text-purple-400 bg-purple-400/08"
                style={{ fontSize: 9, letterSpacing: '0.14em' }}>MAX SCIENCE</span>
              <span className="font-mono text-xs text-white/25">18 MONTHS</span>
            </div>

            <div className="text-3xl mb-3">🌌</div>
            <h3 className="font-display text-xl font-black text-white mb-1">Exploration Mission</h3>
            <p className="font-mono text-xs mb-3 text-purple-400">Grand Tour Route</p>
            <p className="font-body text-sm text-white/50 leading-relaxed mb-5">
              Swing past Jupiter, study the asteroid belt, arrive at Mars with full scientific data.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[['18 months', 'Duration'], ['High', 'Risk'], ['Maximum', 'Science']].map(([v, l]) => (
                <div key={l} className="rounded-lg p-2 text-center" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
                  <p className="font-mono text-xs font-bold text-purple-400">{v}</p>
                  <p className="font-mono text-white/25 mt-0.5" style={{ fontSize: 9 }}>{l}</p>
                </div>
              ))}
            </div>

            {/* Route */}
            <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-white/30">
              <span>🌍</span><span className="text-purple-400/40">──</span>
              <span>🪐</span><span className="text-purple-400/40">──</span>
              <span>☄️</span><span className="text-purple-400/40">──</span>
              <span>🔴</span>
            </div>

            {chosen === 'exploration' && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-mono text-xs text-purple-400 tracking-widest">CHARTING GRAND TOUR…</span>
              </div>
            )}
          </button>
        </div>

        <p className="text-center font-mono text-xs text-white/20">
          This choice affects your scroll experience and story narration
        </p>
      </div>

      <style>{`
        @keyframes warpLine {
          0% { transform: translateX(100%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(-400%); opacity: 0; }
        }
        @keyframes rocketBoost {
          0%, 100% { transform: translateY(-50%) translateX(0px); }
          50% { transform: translateY(-50%) translateX(6px); }
        }
      `}</style>
    </div>
  )
}