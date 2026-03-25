import { useSounds } from './SoundEngine'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarsMap from './MarsMap'

gsap.registerPlugin(ScrollTrigger)

const marsFacts = [
  { id: 1, icon: '🌡️', title: 'Temperature', short: '-60°C average', detail: 'Mars averages -60°C but ranges from -125°C at the poles in winter to +20°C at the equator in summer. A human without a suit would freeze and suffocate simultaneously.', color: '#00d4ff', border: 'rgba(0,212,255,0.3)', glow: 'rgba(0,212,255,0.08)' },
  { id: 2, icon: '🏔️', title: 'Olympus Mons', short: '21.9 km high', detail: 'The largest volcano in the solar system — 3x taller than Everest. So wide (600km diameter) that standing at its base, the summit would be below the horizon.', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)', glow: 'rgba(139,92,246,0.08)' },
  { id: 3, icon: '🌬️', title: 'Atmosphere', short: '0.6% Earth pressure', detail: "Mars' thin CO₂ atmosphere is only 0.6% as dense as Earth's. Dust storms can cover the entire planet for months, as Opportunity rover experienced in 2018.", color: '#e8692a', border: 'rgba(232,105,42,0.3)', glow: 'rgba(232,105,42,0.08)' },
  { id: 4, icon: '💧', title: 'Water Ice', short: 'Polar caps confirmed', detail: 'Both poles have confirmed water ice. Subsurface liquid brines may exist. MAVEN data suggests Mars once had oceans covering 20% of its surface 3 billion years ago.', color: '#00d4ff', border: 'rgba(0,212,255,0.3)', glow: 'rgba(0,212,255,0.08)' },
  { id: 5, icon: '🔴', title: 'Why Red?', short: 'Iron oxide dust', detail: "Mars is red because of iron oxide (rust) covering its surface. Fine dust particles suspended in the thin atmosphere give the sky a butterscotch hue during the day.", color: '#ff4444', border: 'rgba(255,68,68,0.3)', glow: 'rgba(255,68,68,0.08)' },
  { id: 6, icon: '🛸', title: 'Moons', short: 'Phobos & Deimos', detail: "Mars has two tiny captured asteroid moons. Phobos orbits so close it completes 3 orbits per day and is slowly spiraling inward — it will crash or shatter in ~50M years.", color: '#8b5cf6', border: 'rgba(139,92,246,0.3)', glow: 'rgba(139,92,246,0.08)' },
]

function Rover({ className }) {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="50" y="35" width="100" height="45" rx="4" fill="url(#roverBody)" />
      <rect x="30" y="15" width="140" height="20" rx="2" fill="#1a3a5c" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
      {[45,60,75,90,105,120,135,150].map(x => <line key={x} x1={x} y1="15" x2={x} y2="35" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />)}
      <rect x="120" y="5" width="4" height="32" rx="1" fill="#636e72" />
      <rect x="114" y="3" width="16" height="10" rx="2" fill="#2d3436" />
      <circle cx="122" cy="8" r="3" fill="rgba(0,212,255,0.8)" />
      <path d="M50 58 L20 70 L20 78 L30 78 L30 70 L50 70 Z" fill="#636e72" />
      <circle cx="20" cy="74" r="6" fill="#2d3436" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
      <circle cx="155" cy="38" r="10" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
      <line x1="155" y1="38" x2="155" y2="48" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
      {[22,60,98,102,140,178].map((cx,i) => (
        <g key={i}>
          <ellipse cx={cx} cy={88} rx="12" ry="16" fill="#2d3436" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />
          <line x1={cx} y1={72} x2={cx} y2={104} stroke="#636e72" strokeWidth="1.5" />
          <line x1={cx-12} y1={88} x2={cx+12} y2={88} stroke="#636e72" strokeWidth="1.5" />
        </g>
      ))}
      <line x1="34" y1="75" x2="22" y2="88" stroke="#636e72" strokeWidth="2" />
      <line x1="50" y1="80" x2="60" y2="88" stroke="#636e72" strokeWidth="2" />
      <line x1="100" y1="80" x2="98" y2="88" stroke="#636e72" strokeWidth="2" />
      <line x1="100" y1="80" x2="102" y2="88" stroke="#636e72" strokeWidth="2" />
      <line x1="150" y1="80" x2="140" y2="88" stroke="#636e72" strokeWidth="2" />
      <line x1="166" y1="75" x2="178" y2="88" stroke="#636e72" strokeWidth="2" />
      <ellipse cx="22" cy="102" rx="14" ry="4" fill="rgba(193,68,14,0.3)" />
      <ellipse cx="60" cy="102" rx="14" ry="4" fill="rgba(193,68,14,0.3)" />
      <defs>
        <linearGradient id="roverBody" x1="50" y1="35" x2="150" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7f8c8d" /><stop offset="0.5" stopColor="#95a5a6" /><stop offset="1" stopColor="#636e72" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SolSlider() {
  const [sol, setSol] = useState(12)
  const getSkyColor = (h) => h < 5 ? 'from-[#0a0518] to-[#2d1548]' : h < 7 ? 'from-[#2d1548] to-[#e8692a]' : h < 17 ? 'from-[#c4844e] to-[#c4632a]' : h < 19 ? 'from-[#8b3a20] to-[#4a1a60]' : 'from-[#0a0518] to-[#0a0518]'
  const getDesc = (h) => h < 5 ? 'The twin moons Phobos and Deimos cross the night sky' : h < 7 ? 'Sunrise: the sky turns from violet to caramel orange' : h < 17 ? 'Day: the sky glows a distinctive butterscotch yellow' : h < 19 ? 'Sunset: the sky turns blue near the sun — unique to Mars' : 'Night falls fast. Stars are crystal clear through thin air'
  return (
    <div>
      <div className={`h-20 rounded-lg bg-gradient-to-b ${getSkyColor(sol)} mb-4 relative overflow-hidden transition-all duration-700 flex items-center justify-center`}>
        {sol >= 6 && sol <= 20 && <div className="absolute w-8 h-8 rounded-full bg-white/80 blur-sm transition-all duration-700" style={{ left: `${((sol-6)/14)*100}%`, top: sol >= 12 ? '20%' : '40%', transform: 'translateX(-50%)' }} />}
        <span className="font-mono text-xs text-white/60 z-10">{sol.toString().padStart(2,'0')}:00 MST</span>
      </div>
      <input type="range" min="0" max="24" value={sol} onChange={e => setSol(parseInt(e.target.value))} className="w-full accent-orange-500 cursor-pointer" />
      <div className="flex justify-between mt-1 mb-3"><span className="font-mono text-xs text-white/20">00:00</span><span className="font-mono text-xs text-white/20">24:00 MST</span></div>
      <p className="font-body text-sm text-white/50 italic">{getDesc(sol)}</p>
    </div>
  )
}

export default function Exploration() {
  const sectionRef = useRef(null)
  const roverRef = useRef(null)
  const [activeCard, setActiveCard] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [roverX, setRoverX] = useState(0)
  const { sounds } = useSounds() || { sounds: {} }

  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: self => setRoverX(self.progress * 60),
    })
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      onEnter: () => {
        gsap.fromTo(sectionRef.current.querySelectorAll('.explore-reveal'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out' }
        )
      }
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section id="explore" ref={sectionRef} className="relative min-h-screen py-24 overflow-hidden">
      <div className="absolute top-8 left-6 md:left-12 z-10">
        <span className="font-mono text-xs text-white/20 tracking-[0.4em]">04 — EXPLORATION</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-red-900/20 to-transparent" />

      {/* Rover */}
      <div ref={roverRef} className="absolute bottom-16 z-10 transition-none" style={{ left: `${roverX}%`, transform: 'translateX(-50%)' }}>
        <Rover className="drop-shadow-lg" />
        <div data-gravity="slow" className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-cyan-400/60 whitespace-nowrap">● PERSEVERANCE ONLINE</div>
      </div>

      {/* Surface */}
      <div className="absolute bottom-12 left-0 right-0 h-16 overflow-hidden">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-full">
          <path d="M0 40 Q180 20 360 35 Q540 50 720 30 Q900 10 1080 38 Q1260 55 1440 25 L1440 60 L0 60Z" fill="rgba(193,68,14,0.15)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-orange-400 tracking-[0.3em] mb-3 block explore-reveal">PHASE IV</span>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-4 explore-reveal">SURFACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">OPERATIONS</span></h2>
          <p className="font-body text-white/50 max-w-xl mx-auto explore-reveal">Click any card to explore Mars facts. Move the sun. Check the map.</p>
        </div>

        {/* Facts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {marsFacts.map(fact => {
            const isActive = activeCard === fact.id
            const isHov = hoveredCard === fact.id
            return (
              <div key={fact.id}
                className="explore-reveal cursor-pointer rounded-lg border p-5 transition-all duration-300 relative overflow-hidden"
                style={{
                  borderColor: isHov || isActive ? fact.border : 'rgba(255,255,255,0.05)',
                  background: isActive ? fact.glow : isHov ? 'rgba(255,255,255,0.02)' : 'rgba(13,27,42,0.6)',
                  boxShadow: isHov || isActive ? `0 0 25px ${fact.glow}` : 'none',
                  transform: isHov && !isActive ? 'translateY(-4px) scale(1.01)' : isActive ? 'translateY(-6px) scale(1.02)' : 'none',
                }}
                onClick={() => { sounds?.click?.(); setActiveCard(isActive ? null : fact.id) }}
                onMouseEnter={() => { setHoveredCard(fact.id); sounds?.hover?.() }}
                onMouseLeave={() => setHoveredCard(null)}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl" style={{ filter: isActive ? `drop-shadow(0 0 8px ${fact.color})` : 'none' }}>{fact.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display text-sm font-bold text-white">{fact.title}</h3>
                      <span className="text-white/20 text-xs">{isActive ? '−' : '+'}</span>
                    </div>
                    <p className="font-mono text-xs mb-2" style={{ color: fact.color }}>{fact.short}</p>
                    <div className={`overflow-hidden transition-all duration-400 ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="font-body text-sm text-white/60 leading-relaxed pt-2 border-t border-white/5">{fact.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sol slider */}
        <div className="explore-reveal bg-[#0d1b2a]/60 border border-white/5 rounded-lg p-6 mb-12">
          <h3 className="font-display text-sm font-bold text-white mb-1">Mars Day Explorer</h3>
          <p className="font-body text-xs text-white/40 mb-4">A Martian sol is 24h 37m — drag to simulate Martian time</p>
          <SolSlider />
        </div>

        {/* Mars Map — only once */}
        <div className="explore-reveal bg-[#0d1b2a]/60 border border-white/5 rounded-xl p-6">
          <MarsMap />
        </div>
      </div>
    </section>
  )
}