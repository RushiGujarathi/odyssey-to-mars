import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MarsLanding() {
  const sectionRef = useRef(null)
  const marsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mars zoom in on scroll
      gsap.fromTo(marsRef.current,
        { scale: 0.4, opacity: 0 },
        {
          scale: 1, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          }
        }
      )

      // Text reveal
      gsap.fromTo(sectionRef.current.querySelectorAll('.land-reveal'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="landing" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      <div className="absolute top-8 left-6 md:left-12 z-10">
        <span className="font-mono text-xs text-white/20 tracking-[0.4em]">03 — LANDING</span>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark via-red-950/10 to-space-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mars-red/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Mars planet */}
        <div className="flex items-center justify-center">
          <div ref={marsRef} className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Atmosphere glow */}
            <div className="absolute -inset-8 rounded-full bg-mars-orange/10 blur-2xl" />
            <div className="absolute -inset-4 rounded-full bg-mars-red/10 blur-xl" />

            {/* Mars sphere */}
            <div className="absolute inset-0 rounded-full" style={{
              background: 'radial-gradient(circle at 38% 33%, #e8692a 0%, #c1440e 40%, #7a2800 70%, #3a0e00 100%)',
              boxShadow: '0 0 60px rgba(193,68,14,0.5), 0 0 120px rgba(193,68,14,0.2), inset -20px -20px 60px rgba(5,2,0,0.6)',
            }}>
              {/* Surface features */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40 rounded-full">
                {/* Valles Marineris */}
                <path d="M40 95 Q100 88 160 98" stroke="#5a1400" strokeWidth="4" fill="none" opacity="0.6"/>
                {/* Polar cap */}
                <ellipse cx="100" cy="22" rx="28" ry="10" fill="rgba(255,255,255,0.18)" />
                {/* Craters */}
                <circle cx="65" cy="75" r="8" fill="none" stroke="#5a1400" strokeWidth="2" opacity="0.5"/>
                <circle cx="130" cy="110" r="12" fill="none" stroke="#5a1400" strokeWidth="2" opacity="0.4"/>
                <circle cx="80" cy="130" r="6" fill="none" stroke="#5a1400" strokeWidth="1.5" opacity="0.4"/>
                {/* Olympus Mons highlight */}
                <ellipse cx="58" cy="78" rx="14" ry="10" fill="rgba(255,140,60,0.2)" />
              </svg>

              {/* Atmosphere rim */}
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle at 30% 30%, transparent 55%, rgba(232,105,42,0.35) 100%)',
              }} />
            </div>

            {/* Orbit ring */}
            <div className="absolute -inset-10 rounded-full border border-mars-orange/10 border-dashed" />

            {/* EDL capsule */}
            <div className="absolute -inset-10 rounded-full" style={{ animation: 'spin 18s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-sm bg-white/70 rotate-45 shadow-lg shadow-neon-blue/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="font-mono text-xs text-mars-orange tracking-[0.3em] mb-3 block land-reveal">PHASE III</span>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-6 leading-none land-reveal">
            ENTRY
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-mars-orange to-red-500">
              DESCENT &amp; LANDING
            </span>
          </h2>
          <p className="font-body text-white/50 mb-8 leading-relaxed land-reveal">
            The <span className="text-mars-orange">seven minutes of terror</span> — atmospheric entry at
            21,000 km/h, heatshield temperatures of 2,100°C, supersonic parachutes,
            and retro-rockets firing in the final seconds before touchdown.
          </p>

          {/* EDL phases */}
          <div className="space-y-3 land-reveal">
            {[
              { phase: 'Atmospheric Entry',   detail: '21,000 km/h → heat shield ignites',  color: '#ff4444' },
              { phase: 'Peak Deceleration',   detail: '15G force — 2,100°C plasma sheath',  color: '#ff6b35' },
              { phase: 'Parachute Deploy',    detail: 'Supersonic chute at Mach 2.0',        color: '#e8692a' },
              { phase: 'Powered Descent',     detail: 'Retro-rockets firing at 80m altitude', color: '#ffcc00' },
              { phase: 'Touchdown',           detail: 'Contact confirmed — we are on Mars',  color: '#4ade80' },
            ].map((item, i) => (
              <div key={item.phase} className="flex items-start gap-4 p-3 rounded-lg border border-white/5"
                style={{ background: 'rgba(13,27,42,0.6)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold"
                  style={{ background: item.color + '22', border: `1px solid ${item.color}60`, color: item.color }}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-display text-xs font-bold text-white">{item.phase}</p>
                  <p className="font-mono text-xs text-white/40 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}