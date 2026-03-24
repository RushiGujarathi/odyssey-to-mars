import React, { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSounds } from './SoundEngine'

gsap.registerPlugin(ScrollTrigger)

export default function Launch() {
  const sectionRef = useRef(null)
  const rocketRef = useRef(null)
  const flameRef = useRef(null)
  const smokeRef = useRef(null)
  const rocketWrapRef = useRef(null)
  const [countdown, setCountdown] = useState(10)
  const [launched, setLaunched] = useState(false)
  const [ignited, setIgnited] = useState(false)
  const [rocketY, setRocketY] = useState(0)
  const { sounds } = useSounds() || { sounds: {} }
  const timerRef = useRef(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const rafRef = useRef(null)

  // Mouse parallax on rocket
  useEffect(() => {
    const onMove = (e) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 30
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 15
    }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      if (rocketWrapRef.current && !launched) {
        gsap.to(rocketWrapRef.current, {
          x: mouseX.current,
          y: mouseY.current,
          duration: 1.2,
          ease: 'power2.out',
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [launched])

  // Scroll = rocket vertical movement in idle state
  useEffect(() => {
    if (launched) return
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        if (!launched) {
          gsap.set(rocketRef.current, { y: self.progress * -40 })
        }
      },
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [launched])

  const resetRocket = useCallback(() => {
    // Kill all ongoing tweens on rocket elements
    gsap.killTweensOf([rocketRef.current, flameRef.current, smokeRef.current])
    gsap.set(rocketRef.current, { y: 0, clearProps: 'transform' })
    gsap.set(flameRef.current, { scaleY: 1, scaleX: 1, opacity: 0 })
    gsap.set(smokeRef.current, { scale: 1, opacity: 0 })
    setCountdown(10)
    setLaunched(false)
    setIgnited(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const launchSequence = () => {
    if (ignited) return
    setIgnited(true)
    sounds?.launch?.()

    // Flame appear
    gsap.to(flameRef.current, { opacity: 1, duration: 0.3 })

    let count = 10
    timerRef.current = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(timerRef.current)
        setLaunched(true)
        // Shake before launch
        gsap.to(rocketRef.current, {
          x: '+=4', duration: 0.05, repeat: 8, yoyo: true, ease: 'none',
          onComplete: () => {
            gsap.to(rocketRef.current, {
              y: -(window.innerHeight * 1.6),
              duration: 2.4,
              ease: 'power3.in',
            })
            gsap.to(flameRef.current, { scaleY: 5, scaleX: 1.8, opacity: 0, duration: 2, ease: 'power2.in' })
            gsap.to(smokeRef.current, { scale: 10, opacity: 0, duration: 3, ease: 'power1.out' })
          }
        })
      }
    }, 300)
  }

  return (
    <section id="launch" ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-900/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-4 bg-orange-500/20 blur-2xl rounded-full" />
      <div className="absolute top-20 left-6 md:left-12 z-10">
        <span className="font-mono text-xs text-white/20 tracking-[0.4em]">01 — LAUNCH</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Rocket */}
        <div className="flex flex-col items-center relative select-none">
          <div ref={rocketWrapRef} className="relative flex flex-col items-center">
            <div ref={rocketRef} className="relative flex flex-col items-center cursor-grab active:cursor-grabbing">
              <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 10 C45 10 30 50 30 90 L90 90 C90 50 75 10 60 10Z" fill="url(#bodyGrad)" />
                <path d="M60 8 C60 8 42 40 42 70 L78 70 C78 40 60 8 60 8Z" fill="url(#noseGrad2)" />
                <rect x="30" y="90" width="60" height="100" rx="3" fill="url(#bodyGrad)" />
                <rect x="28" y="140" width="64" height="6" rx="3" fill="#1a2744" />
                <rect x="30" y="141" width="60" height="4" rx="2" fill="url(#ringGrad)" />
                <circle cx="60" cy="108" r="10" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
                <circle cx="60" cy="108" r="7" fill="rgba(0,212,255,0.15)" />
                <circle cx="42" cy="118" r="5" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
                <circle cx="78" cy="118" r="5" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
                <rect x="30" y="155" width="60" height="3" fill="rgba(0,212,255,0.3)" />
                <rect x="30" y="162" width="20" height="3" fill="rgba(255,107,53,0.5)" />
                <path d="M30 190 L20 220 L100 220 L90 190 Z" fill="url(#engineGrad)" />
                <rect x="30" y="185" width="60" height="8" rx="2" fill="#0d1b2a" />
                <ellipse cx="40" cy="218" rx="8" ry="6" fill="#0a1525" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />
                <ellipse cx="60" cy="218" rx="8" ry="6" fill="#0a1525" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />
                <ellipse cx="80" cy="218" rx="8" ry="6" fill="#0a1525" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />
                <path d="M30 190 L5 230 L30 215 Z" fill="url(#finGrad)" />
                <path d="M90 190 L115 230 L90 215 Z" fill="url(#finGrad)" />
                <rect x="10" y="150" width="16" height="60" rx="4" fill="url(#boosterGrad)" />
                <rect x="94" y="150" width="16" height="60" rx="4" fill="url(#boosterGrad)" />
                <ellipse cx="18" cy="212" rx="6" ry="4" fill="#0a1525" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />
                <ellipse cx="102" cy="212" rx="6" ry="4" fill="#0a1525" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />
                <defs>
                  <linearGradient id="bodyGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7f8c8d" /><stop offset="40%" stopColor="#ecf0f1" /><stop offset="100%" stopColor="#95a5a6" />
                  </linearGradient>
                  <linearGradient id="noseGrad2" x1="42" y1="8" x2="78" y2="8" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#bdc3c7" /><stop offset="50%" stopColor="#ffffff" /><stop offset="100%" stopColor="#bdc3c7" />
                  </linearGradient>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="0" y2="6" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00d4ff" opacity="0.6" /><stop offset="1" stopColor="#00d4ff" opacity="0.2" />
                  </linearGradient>
                  <linearGradient id="engineGrad" x1="60" y1="190" x2="60" y2="220" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#636e72" /><stop offset="1" stopColor="#2d3436" />
                  </linearGradient>
                  <linearGradient id="finGrad" x1="0" y1="190" x2="0" y2="230" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7f8c8d" /><stop offset="1" stopColor="#2d3436" />
                  </linearGradient>
                  <linearGradient id="boosterGrad" x1="0" y1="150" x2="0" y2="210" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#95a5a6" /><stop offset="1" stopColor="#636e72" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Flames */}
              <div ref={flameRef} className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 opacity-0" style={{ transformOrigin: 'top center' }}>
                <svg width="80" height="100" viewBox="0 0 80 100">
                  <path d="M20 0 C15 30 5 60 40 90 C75 60 65 30 60 0 Z" fill="url(#mainFlame)" />
                  <path d="M28 0 C25 25 18 50 40 75 C62 50 55 25 52 0 Z" fill="url(#innerFlame2)" />
                  <path d="M32 0 C30 20 26 40 40 60 C54 40 50 20 48 0 Z" fill="url(#coreFlame)" className="flame-flicker" />
                  <defs>
                    <linearGradient id="mainFlame" x1="40" y1="0" x2="40" y2="90" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ff6b35" /><stop offset="0.5" stopColor="#ff4444" stopOpacity="0.8" /><stop offset="1" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="innerFlame2" x1="40" y1="0" x2="40" y2="75" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffcc00" /><stop offset="0.6" stopColor="#ff6b35" stopOpacity="0.9" /><stop offset="1" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="coreFlame" x1="40" y1="0" x2="40" y2="60" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffffff" /><stop offset="0.4" stopColor="#00d4ff" stopOpacity="0.9" /><stop offset="1" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Smoke */}
            <div ref={smokeRef} className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full bg-white/5 blur-xl opacity-0" style={{ transformOrigin: 'center bottom' }} />

            {/* Pad */}
            <div className="mt-4 w-48 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-sm relative">
              <div className="absolute inset-x-4 top-0 h-1 bg-orange-400/30" />
              <div className="absolute -left-6 top-0 w-2 h-12 bg-gray-700 rounded" style={{ transform: 'rotate(-15deg)', transformOrigin: 'bottom' }} />
              <div className="absolute -right-6 top-0 w-2 h-12 bg-gray-700 rounded" style={{ transform: 'rotate(15deg)', transformOrigin: 'bottom' }} />
            </div>
          </div>

          {/* Mouse hint */}
          {!launched && (
            <p className="mt-6 font-mono text-xs text-white/20 tracking-widest animate-pulse">
              ↔ MOVE MOUSE TO STEER
            </p>
          )}
        </div>

        {/* Info panel */}
        <div>
          <span className="font-mono text-xs text-orange-400 tracking-[0.3em] mb-3 block launch-reveal">PHASE I</span>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-4 launch-reveal">
            LAUNCH<span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">SEQUENCE</span>
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed launch-reveal">
            Three Raptor engines ignite with <span className="text-orange-400">1.7 million lbs</span> of thrust,
            punching through Earth's atmosphere at 28,000 km/h.
          </p>

          {/* Countdown */}
          <div className="bg-[#0d1b2a]/80 border border-white/5 rounded-lg p-6 mb-6 launch-reveal">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-white/30 tracking-widest">LAUNCH COUNTDOWN</span>
              <span className={`font-mono text-xs tracking-widest ${ignited ? 'text-orange-400' : 'text-white/20'}`}>
                {ignited ? '● ENGINES IGNITED' : '○ STANDBY'}
              </span>
            </div>
            <div className="text-center">
              <div className="font-display text-7xl font-black text-orange-400 tabular-nums">
                {launched ? 'GO!' : `T-${countdown.toString().padStart(2,'0')}`}
              </div>
              <p className="font-mono text-xs text-white/30 mt-1 tracking-widest">
                {ignited && !launched ? 'SECONDS TO LAUNCH' : launched ? 'GODSPEED, CREW' : 'AWAITING INITIATION'}
              </p>
            </div>
          </div>

          {/* Systems */}
          <div className="space-y-2 mb-8 launch-reveal">
            {[
              { system: 'Propulsion Systems', ok: true },
              { system: 'Navigation Computer', ok: true },
              { system: 'Life Support', ok: true },
              { system: 'Communications', ok: true },
              { system: 'Mars Trajectory', ok: ignited },
            ].map(item => (
              <div key={item.system} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="font-mono text-xs text-white/40">{item.system}</span>
                <span className={`font-mono text-xs tracking-widest ${item.ok ? 'text-cyan-400' : 'text-orange-400'}`}>
                  ● {item.ok ? 'GO' : 'CALC'}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 launch-reveal">
            <button onClick={launchSequence} disabled={ignited}
              className={`flex-1 py-4 font-display font-bold text-sm tracking-widest rounded transition-all duration-300 ${
                launched ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                : ignited ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 cursor-not-allowed'
                : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/20'
              }`}>
              {launched ? '🚀 MISSION UNDERWAY' : ignited ? `LAUNCHING T-${countdown}...` : '⚡ INITIATE LAUNCH'}
            </button>

            {/* REPEAT button — appears after launch */}
            {launched && (
              <button onClick={resetRocket}
                className="px-5 py-4 font-display font-bold text-xs tracking-widest rounded border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 7A6 6 0 1 0 7 1" strokeLinecap="round" />
                  <path d="M1 1v6h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                RESET
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
