import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen({ progress }) {
  const containerRef = useRef(null)
  const rocketRef = useRef(null)

  useEffect(() => {
    if (progress === 100) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.in',
      })
    }
  }, [progress])

  useEffect(() => {
    // Animate rocket floating
    gsap.to(rocketRef.current, {
      y: -12,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-space-dark"
      style={{ pointerEvents: progress === 100 ? 'none' : 'all' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-neon-blue opacity-5 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-neon-purple opacity-5 blur-3xl" />
      </div>

      {/* Rocket SVG */}
      <div ref={rocketRef} className="mb-8">
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rocket body */}
          <path d="M30 5 C20 5 10 30 10 55 L50 55 C50 30 40 5 30 5Z" fill="url(#rocketGrad)" />
          {/* Nose cone */}
          <path d="M30 2 C30 2 20 18 20 30 L40 30 C40 18 30 2 30 2Z" fill="url(#noseGrad)" />
          {/* Wings */}
          <path d="M10 55 L0 75 L15 65 Z" fill="#1a2744" />
          <path d="M50 55 L60 75 L45 65 Z" fill="#1a2744" />
          {/* Window */}
          <circle cx="30" cy="38" r="7" fill="none" stroke="#00d4ff" strokeWidth="2" />
          <circle cx="30" cy="38" r="4" fill="rgba(0,212,255,0.3)" />
          {/* Exhaust port */}
          <rect x="22" y="55" width="16" height="4" rx="2" fill="#0d1b2a" />
          {/* Flame */}
          <path d="M22 59 C22 59 18 75 30 85 C42 75 38 59 38 59 Z" fill="url(#flameGrad)" className="flame-flicker" />
          <path d="M25 59 C25 59 22 70 30 78 C38 70 35 59 35 59 Z" fill="url(#innerFlame)" className="flame-flicker" />
          
          <defs>
            <linearGradient id="rocketGrad" x1="30" y1="5" x2="30" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c8d6e5" />
              <stop offset="100%" stopColor="#8395a7" />
            </linearGradient>
            <linearGradient id="noseGrad" x1="30" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c8d6e5" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="30" y1="59" x2="30" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="50%" stopColor="#ff4444" />
              <stop offset="100%" stopColor="rgba(255,68,68,0)" />
            </linearGradient>
            <linearGradient id="innerFlame" x1="30" y1="59" x2="30" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="rgba(0,212,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Title */}
      <h1 className="font-display text-xl md:text-2xl font-bold tracking-[0.3em] text-white mb-1 uppercase">
        Odyssey to Mars
      </h1>
      <p className="font-mono text-xs text-neon-blue/60 tracking-widest mb-8">
        INITIALIZING SYSTEMS
      </p>

      {/* Progress bar container */}
      <div className="w-64 md:w-80 relative">
        <div className="h-px bg-white/10 w-full rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-xs text-white/30">SYS LOAD</span>
          <span className="font-mono text-xs text-neon-blue">{progress}%</span>
        </div>
      </div>

      {/* Status messages */}
      <div className="mt-6 font-mono text-xs text-white/20 text-center space-y-1">
        {progress >= 20 && <p className="text-neon-blue/50">▸ Navigation systems online</p>}
        {progress >= 45 && <p className="text-neon-blue/50">▸ Fuel cells pressurized</p>}
        {progress >= 70 && <p className="text-neon-blue/50">▸ Trajectory calculated</p>}
        {progress >= 90 && <p className="text-neon-blue/50">▸ Launch sequence ready</p>}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 font-mono text-xs text-white/10">MRX-001</div>
      <div className="absolute top-6 right-6 font-mono text-xs text-white/10">MISSION: ODYSSEY</div>
      <div className="absolute bottom-6 left-6 font-mono text-xs text-white/10">54.6M KM</div>
      <div className="absolute bottom-6 right-6 font-mono text-xs text-white/10">T-MINUS: ∞</div>
    </div>
  )
}
