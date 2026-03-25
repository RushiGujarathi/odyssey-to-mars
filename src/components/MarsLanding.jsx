import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EDL_PHASES = [
  { phase: 'Atmospheric Entry',  detail: '21,000 km/h → heat shield ignites',   color: '#ff4444' },
  { phase: 'Peak Deceleration',  detail: '15G force — 2,100°C plasma sheath',   color: '#ff6b35' },
  { phase: 'Parachute Deploy',   detail: 'Supersonic chute at Mach 2.0',         color: '#e8692a' },
  { phase: 'Powered Descent',    detail: 'Retro-rockets firing at 80m altitude', color: '#ffcc00' },
  { phase: 'Touchdown',          detail: 'Contact confirmed — we are on Mars',   color: '#4ade80' },
]

export default function MarsLanding() {
  const sectionRef = useRef(null)
  const marsRef    = useRef(null)
  const capsuleRef = useRef(null)

  useEffect(() => {
    // --- Mars zoom on scroll (opacity starts at 1, only scale animates) ---
    if (marsRef.current) {
      gsap.fromTo(
        marsRef.current,
        { scale: 0.5 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        }
      )
    }

    // --- Capsule orbit rotation ---
    if (capsuleRef.current) {
      gsap.to(capsuleRef.current, {
        rotation: 360,
        duration: 18,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      id="landing"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24"
    >
      {/* Label */}
      <div className="absolute top-8 left-6 md:left-12 z-10">
        <span className="font-mono text-xs text-white/20 tracking-[0.4em]">03 — LANDING</span>
      </div>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark via-red-950/10 to-space-dark" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(193,68,14,0.05)' }}
      />

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center w-full">

        {/* ── Left: Mars planet ── */}
        <div className="flex items-center justify-center">
          <div
            ref={marsRef}
            className="relative w-64 h-64 md:w-80 md:h-80"
            style={{ opacity: 1 }}
          >
            {/* Glow layers */}
            <div
              className="absolute -inset-8 rounded-full blur-2xl pointer-events-none"
              style={{ background: 'rgba(232,105,42,0.10)' }}
            />
            <div
              className="absolute -inset-4 rounded-full blur-xl pointer-events-none"
              style={{ background: 'rgba(193,68,14,0.10)' }}
            />

            {/* Mars sphere */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 38% 33%, #e8692a 0%, #c1440e 40%, #7a2800 70%, #3a0e00 100%)',
                boxShadow:
                  '0 0 60px rgba(193,68,14,0.5), 0 0 120px rgba(193,68,14,0.2), inset -20px -20px 60px rgba(5,2,0,0.6)',
              }}
            >
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full opacity-40 rounded-full"
              >
                {/* Valles Marineris */}
                <path d="M40 95 Q100 88 160 98" stroke="#5a1400" strokeWidth="4" fill="none" opacity="0.6" />
                {/* Polar cap */}
                <ellipse cx="100" cy="22" rx="28" ry="10" fill="rgba(255,255,255,0.18)" />
                {/* Craters */}
                <circle cx="65"  cy="75"  r="8"  fill="none" stroke="#5a1400" strokeWidth="2"   opacity="0.5" />
                <circle cx="130" cy="110" r="12" fill="none" stroke="#5a1400" strokeWidth="2"   opacity="0.4" />
                <circle cx="80"  cy="130" r="6"  fill="none" stroke="#5a1400" strokeWidth="1.5" opacity="0.4" />
                {/* Olympus Mons */}
                <ellipse cx="58" cy="78" rx="14" ry="10" fill="rgba(255,140,60,0.2)" />
              </svg>

              {/* Atmosphere rim */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, transparent 55%, rgba(232,105,42,0.35) 100%)',
                }}
              />
            </div>

            {/* Dashed orbit ring */}
            <div
              className="absolute rounded-full border border-dashed pointer-events-none"
              style={{ inset: '-2.5rem', borderColor: 'rgba(232,105,42,0.18)' }}
            />

            {/* Orbiting EDL capsule — rotated by GSAP */}
            <div
              ref={capsuleRef}
              className="absolute rounded-full pointer-events-none"
              style={{ inset: '-2.5rem' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-4 h-4 rounded-sm rotate-45"
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    boxShadow: '0 0 10px rgba(0,212,255,0.6)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Text content — always visible, no opacity trap ── */}
        <div>
          <span
            className="font-mono text-xs tracking-[0.3em] mb-3 block"
            style={{ color: '#e8692a' }}
          >
            PHASE III
          </span>

          <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-6 leading-none">
            ENTRY
            <span
              className="block text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #e8692a, #ef4444)',
              }}
            >
              DESCENT &amp; LANDING
            </span>
          </h2>

          <p className="font-body text-white/50 mb-8 leading-relaxed">
            The{' '}
            <span style={{ color: '#e8692a' }}>seven minutes of terror</span> —
            atmospheric entry at 21,000 km/h, heatshield temperatures of
            2,100°C, supersonic parachutes, and retro-rockets firing in the
            final seconds before touchdown.
          </p>

          {/* EDL phases */}
          <div className="space-y-3">
            {EDL_PHASES.map((item, i) => (
              <div
                key={item.phase}
                className="flex items-start gap-4 p-3 rounded-lg"
                style={{
                  background: 'rgba(13,27,42,0.6)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold"
                  style={{
                    background: item.color + '22',
                    border: `1px solid ${item.color}60`,
                    color: item.color,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-display text-xs font-bold text-white">
                    {item.phase}
                  </p>
                  <p className="font-mono text-xs text-white/40 mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}