import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CrewSelection from './CrewSelection'
import MissionDashboard from './MissionDashboard'
import ColonyBuilder from './ColonyBuilder'
import SignalDelay from './SignalDelay'
import MarsIdentityCard from './MarsIdentityCard'
import MarsEnvironmentSim from './MarsEnvironmentSim'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { year: '2026', event: 'Uncrewed cargo missions land',   status: 'imminent' },
  { year: '2028', event: 'Pre-positioned fuel & supplies', status: 'planned'  },
  { year: '2030', event: 'First crewed Mars landing',      status: 'target'   },
  { year: '2035', event: 'Permanent Mars base Alpha',      status: 'future'   },
  { year: '2050', event: 'Mars population: 1,000 people',  status: 'dream'    },
  { year: '2100', event: 'Self-sustaining Mars colony',    status: 'vision'   },
]

function Section({ tag, tagColor, title, subtitle, children }) {
  return (
    <div className="conclude-reveal mb-14">
      <div className="rounded-2xl border border-white/5 p-6 md:p-8" style={{ background: 'rgba(13,27,42,0.55)' }}>
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-xs tracking-widest" style={{ color: tagColor }}>{tag}</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <h3 className="font-display text-2xl font-black text-white mb-1">{title}</h3>
        {subtitle && <p className="font-body text-sm text-white/35 mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </div>
  )
}

export default function Conclusion() {
  const sectionRef = useRef(null)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      onEnter: () => {
        gsap.fromTo(sectionRef.current.querySelectorAll('.conclude-reveal'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
        )
      }
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section id="conclusion" ref={sectionRef} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-red-900/10 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-600/4 blur-3xl" />
      </div>
      <div className="absolute top-8 left-6 md:left-12 z-10">
        <span className="font-mono text-xs text-white/20 tracking-[0.4em]">05 — THE FUTURE</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-purple-400 tracking-[0.3em] mb-3 block conclude-reveal">PHASE V</span>
          <h2 className="font-display font-black text-white leading-none mb-6 conclude-reveal">
            <span className="block text-5xl md:text-7xl">THE FUTURE OF</span>
            <span className="block text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400">HUMANITY</span>
          </h2>
          <p className="font-body text-xl text-white/50 max-w-2xl mx-auto leading-relaxed conclude-reveal">
            Mars is not just a destination. It is our <span className="text-purple-400 font-semibold">backup drive</span> — the insurance policy for civilisation.
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-20 conclude-reveal">
          <h3 className="font-display text-center text-xs font-bold text-white/25 tracking-[0.3em] mb-10">COLONIZATION TIMELINE</h3>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/40 via-cyan-400/25 to-orange-400/40 hidden md:block" />
            <div className="space-y-5">
              {timeline.map((item, i) => (
                <div key={item.year} className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block rounded-xl p-4 border border-white/5" style={{ background: 'rgba(13,27,42,0.7)' }}>
                      <p className={`font-display text-2xl font-black mb-1 ${
                        item.status === 'imminent' || item.status === 'planned' ? 'text-cyan-400' :
                        item.status === 'target' ? 'text-purple-400' :
                        item.status === 'future' ? 'text-orange-400' : 'text-white/25'}`}>{item.year}</p>
                      <p className="font-body text-sm text-white/65">{item.event}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-4 h-4 rounded-full flex-shrink-0 z-10"
                    style={{ background: item.status === 'target' ? '#8b5cf6' : item.status === 'imminent' || item.status === 'planned' ? '#00d4ff' : 'rgba(255,255,255,0.1)' }} />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JOIN CREW */}
        <Section tag="APPLY NOW" tagColor="#00d4ff" title="JOIN THE CREW" subtitle="Choose your role aboard the first crewed Mars mission.">
          <CrewSelection />
        </Section>

        {/* MISSION DASHBOARD */}
        <Section tag="STAY INFORMED" tagColor="#e8692a" title="ACTIVE MISSIONS" subtitle="Live status of current and upcoming Mars programs.">
          <MissionDashboard />
        </Section>

        {/* SIGNAL DELAY */}
        <Section tag="COMMS SIM" tagColor="#00d4ff" title="SIGNAL DELAY SIMULATOR" subtitle="Experience the real 3–22 minute communication delay between Earth and Mars.">
          <SignalDelay />
        </Section>

        {/* IDENTITY CARD */}
        <Section tag="YOUR PROFILE" tagColor="#8b5cf6" title="MARS IDENTITY CARD" subtitle="Enter your name and get your official Mars mission ID — flip it and download it.">
          <MarsIdentityCard />
        </Section>

        {/* ENVIRONMENT SIM */}
        <Section tag="SCIENCE" tagColor="#4ade80" title="MARS ENVIRONMENT SIMULATOR" subtitle="Adjust temperature, gravity, pressure and oxygen. Can you survive?">
          <MarsEnvironmentSim />
        </Section>

        {/* COLONY BUILDER */}
        <Section tag="SIMULATION" tagColor="#4ade80" title="BUILD YOUR COLONY" subtitle="Pick habitat, rover, and energy source. See your colony rendered on the Martian surface.">
          <ColonyBuilder />
        </Section>

        {/* Final — Earth to Mars */}
        <div className="conclude-reveal">
          <div className="relative rounded-2xl border border-white/5 overflow-hidden p-10 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(13,27,42,0.9), rgba(26,10,5,0.9))' }}>
            {Array.from({length:40}).map((_,i) => (
              <div key={i} className="absolute rounded-full bg-white pointer-events-none"
                style={{ width: Math.random()*2+0.5, height: Math.random()*2+0.5, top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, opacity: Math.random()*0.4+0.1 }} />
            ))}

            <p className="font-mono text-xs text-white/25 tracking-[0.4em] mb-8 relative z-10">THE JOURNEY SO FAR</p>

            <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full" style={{ background: 'radial-gradient(circle at 38% 35%, #1a6b9e 0%, #063559 70%, #02203a 100%)', boxShadow: '0 0 24px rgba(0,100,200,0.45)' }}>
                  <svg viewBox="0 0 56 56" className="w-full h-full opacity-50 rounded-full">
                    <ellipse cx="22" cy="20" rx="9" ry="6" fill="#2d9e5a" />
                    <ellipse cx="34" cy="28" rx="8" ry="10" fill="#2d9e5a" />
                  </svg>
                </div>
                <p className="font-mono text-xs text-cyan-400/70 tracking-widest">EARTH</p>
              </div>

              <div className="flex-1 max-w-xs flex flex-col items-center gap-2">
                <div className="relative w-full h-px">
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.5), rgba(139,92,246,0.4), rgba(232,105,42,0.5))' }} />
                  <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.06) 6px, rgba(255,255,255,0.06) 12px)' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/60 shadow-sm shadow-white/40" />
                </div>
                <p className="font-mono text-xs text-white/20 tracking-widest">54.6 MILLION KM</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full" style={{ background: 'radial-gradient(circle at 38% 33%, #e8692a 0%, #c1440e 45%, #3a0e00 100%)', boxShadow: '0 0 22px rgba(193,68,14,0.5)' }} />
                <p className="font-mono text-xs text-orange-400/70 tracking-widest">MARS</p>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <p className="font-display text-lg md:text-2xl font-black text-white/70 tracking-widest">THE JOURNEY CONTINUES</p>
              <p className="font-mono text-xs text-white/25 tracking-[0.3em]">MISSION MRX-001 · STATUS: ACTIVE · ETA: 2030</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}