import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Space travel — parallax stars, floating planets, mission telemetry
export default function SpaceTravel() {
  const sectionRef = useRef(null)
  const planet1Ref = useRef(null)
  const planet2Ref = useRef(null)
  const shipRef = useRef(null)
  const streakRef = useRef(null)
  const [missionDay, setMissionDay] = useState(0)

  useEffect(() => {
    const section = sectionRef.current

    // Parallax planets on scroll
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(planet1Ref.current, { y: p * -200, x: p * 50 })
        gsap.set(planet2Ref.current, { y: p * -120, x: p * -80 })
        gsap.set(shipRef.current, { x: p * 120 })
        // Animate mission day counter
        setMissionDay(Math.floor(p * 180))
      }
    })

    // Star streak animation
    gsap.to(streakRef.current?.children || [], {
      x: '200vw',
      duration: 0.8,
      stagger: 0.05,
      repeat: -1,
      ease: 'none',
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (window.innerWidth + 200)),
      }
    })

    // Cinematic zoom-in on section content
    gsap.fromTo(section, 
      { scale: 0.98 },
      {
        scale: 1,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: 1 },
      }
    )

    // Section entrance
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        gsap.fromTo(
          section.querySelectorAll('.space-reveal'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
        )
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section
      id="space"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden py-24 flex flex-col items-center justify-center"
    >
      {/* Section label */}
      <div className="absolute top-20 left-6 md:left-12 z-10">
        <span className="font-mono text-xs text-white/20 tracking-[0.4em]">02 — TRANSIT</span>
      </div>

      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark via-space-navy/50 to-space-dark" />

      {/* Nebula clouds */}
      <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-neon-purple/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-neon-blue/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-mars-red/3 blur-3xl" />

      {/* Star streaks (warp speed) */}
      <div ref={streakRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `-${200 + Math.random() * 200}px`,
              width: `${60 + Math.random() * 120}px`,
              opacity: Math.random() * 0.5 + 0.2,
              transform: `translateX(-200vw)`,
            }}
          />
        ))}
      </div>

      {/* Planet 1 — Jupiter-like */}
      <div
        ref={planet1Ref}
        className="absolute top-16 right-8 md:right-24 w-32 h-32 md:w-48 md:h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 35%, #e8c96e 0%, #c4972a 30%, #8b6914 60%, #5c4400 100%)',
          boxShadow: '0 0 40px rgba(232,201,110,0.2), 0 0 80px rgba(232,201,110,0.1)',
        }}
      >
        {/* Jupiter bands */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
          <div className="absolute left-0 right-0 h-3 bg-amber-800/60" style={{ top: '25%' }} />
          <div className="absolute left-0 right-0 h-2 bg-amber-700/40" style={{ top: '40%' }} />
          <div className="absolute left-0 right-0 h-4 bg-amber-900/50" style={{ top: '55%' }} />
          <div className="absolute left-0 right-0 h-2 bg-amber-600/30" style={{ top: '70%' }} />
        </div>
        {/* Great Red Spot */}
        <div className="absolute w-6 h-4 rounded-full bg-red-600/60 blur-sm" style={{ top: '50%', left: '60%' }} />
        {/* Ring */}
        <div className="absolute -inset-6 rounded-full border border-amber-400/15" style={{ transform: 'rotateX(70deg)' }} />
        {/* Atmosphere */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }} />
      </div>

      {/* Planet 2 — Ice planet */}
      <div
        ref={planet2Ref}
        className="absolute bottom-24 left-6 md:left-20 w-20 h-20 md:w-32 md:h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle at 38% 33%, #a8d8ea 0%, #6baed6 30%, #3182bd 60%, #08519c 100%)',
          boxShadow: '0 0 30px rgba(107,174,214,0.3)',
        }}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute left-0 right-0 h-2 bg-white/20" style={{ top: '20%' }} />
          <div className="absolute left-0 right-0 h-1 bg-white/15" style={{ top: '60%' }} />
        </div>
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
        }} />
      </div>

      {/* Spacecraft */}
      <div ref={shipRef} className="absolute top-1/2 left-1/4 -translate-y-1/2">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
          <path d="M70 20 L50 8 L10 12 L5 20 L10 28 L50 32 Z" fill="url(#shipGrad)" />
          <path d="M5 20 L0 16 L5 20 L0 24 Z" fill="#636e72" />
          {/* Solar panels */}
          <rect x="30" y="2" width="20" height="8" rx="1" fill="#1a3a5c" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
          <rect x="30" y="30" width="20" height="8" rx="1" fill="#1a3a5c" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
          {/* Panel details */}
          <line x1="33" y1="2" x2="33" y2="10" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="37" y1="2" x2="37" y2="10" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="41" y1="2" x2="41" y2="10" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="45" y1="2" x2="45" y2="10" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="33" y1="30" x2="33" y2="38" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="37" y1="30" x2="37" y2="38" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="41" y1="30" x2="41" y2="38" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <line x1="45" y1="30" x2="45" y2="38" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          {/* Window */}
          <circle cx="55" cy="20" r="5" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
          <circle cx="55" cy="20" r="3" fill="rgba(0,212,255,0.2)" />
          {/* Engine glow */}
          <circle cx="4" cy="20" r="3" fill="rgba(0,212,255,0.8)" />
          <defs>
            <linearGradient id="shipGrad" x1="0" y1="20" x2="80" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7f8c8d" />
              <stop offset="0.5" stopColor="#ecf0f1" />
              <stop offset="1" stopColor="#b2bec3" />
            </linearGradient>
          </defs>
        </svg>
        {/* Engine trail */}
        <div className="absolute top-1/2 right-full -translate-y-1/2 w-16 h-px bg-gradient-to-l from-neon-blue/60 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left — telemetry */}
        <div className="space-reveal order-2 md:order-1">
          <div className="bg-space-navy/60 backdrop-blur-sm border border-white/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              <span className="font-mono text-xs text-neon-blue tracking-widest">LIVE TELEMETRY</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Mission Day', value: missionDay.toString(), unit: 'DAYS' },
                { label: 'Velocity', value: '28.4K', unit: 'KM/H' },
                { label: 'Distance from Earth', value: `${(missionDay * 304).toLocaleString()}`, unit: 'KM' },
                { label: 'Distance to Mars', value: `${(54600000 - missionDay * 304000).toLocaleString()}`, unit: 'KM' },
                { label: 'Fuel Remaining', value: `${Math.max(40, 100 - missionDay * 0.33).toFixed(1)}`, unit: '%' },
                { label: 'Crew Health', value: 'NOMINAL', unit: '' },
              ].map(item => (
                <div key={item.label} className="border-l-2 border-neon-blue/20 pl-3">
                  <p className="font-mono text-xs text-white/30 mb-1">{item.label}</p>
                  <p className="font-display text-sm font-bold text-neon-blue">{item.value}</p>
                  {item.unit && <p className="font-mono text-xs text-white/20">{item.unit}</p>}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-mono text-xs text-white/30">EARTH</span>
                <span className="font-mono text-xs text-neon-blue">{((missionDay / 180) * 100).toFixed(0)}% TO MARS</span>
                <span className="font-mono text-xs text-mars-orange">MARS</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-blue to-mars-orange rounded-full transition-all duration-300"
                  style={{ width: `${(missionDay / 180) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-xs text-white/20">🌍</span>
                <div className="w-2 h-2 rounded-full bg-white/40 mt-0.5" style={{ marginLeft: `${(missionDay / 180) * 100}%`, transform: 'translateX(-50%)' }} />
                <span className="font-mono text-xs text-white/20">🔴</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — narrative */}
        <div className="order-1 md:order-2">
          <span className="font-mono text-xs text-neon-purple tracking-[0.3em] mb-3 block space-reveal">PHASE II</span>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-6 leading-none space-reveal">
            CROSSING
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              THE VOID
            </span>
          </h2>
          <p className="font-body text-white/50 mb-6 leading-relaxed space-reveal">
            For 6–9 months, the crew hurtles through the interplanetary medium — a vast,
            silent ocean of solar wind and cosmic radiation. The Hohmann transfer orbit
            is <span className="text-neon-purple">humanity's most efficient path</span> to the red planet.
          </p>

          {/* Journey milestones */}
          <div className="space-y-3 space-reveal">
            {[
              { day: 'Day 7', event: 'Earth orbit departure burn', complete: missionDay > 7 },
              { day: 'Day 45', event: 'Lunar orbit crossing', complete: missionDay > 45 },
              { day: 'Day 90', event: 'Solar conjunction window', complete: missionDay > 90 },
              { day: 'Day 150', event: 'Mars approach corridor entry', complete: missionDay > 150 },
              { day: 'Day 180', event: 'Mars orbit insertion', complete: missionDay >= 180 },
            ].map(milestone => (
              <div key={milestone.day} className={`flex items-center gap-4 transition-opacity ${missionDay > parseInt(milestone.day.split(' ')[1]) ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${milestone.complete ? 'bg-neon-blue shadow-sm shadow-neon-blue' : 'bg-white/20'}`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-body text-sm text-white/70">{milestone.event}</span>
                  <span className="font-mono text-xs text-white/30">{milestone.day}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-white/20 mt-4 space-reveal">Scroll to advance mission timeline ↓</p>
        </div>
      </div>
    </section>
  )
}
