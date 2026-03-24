import React, { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useSounds } from './SoundEngine'

const ROLES = [
  {
    id: 'astronaut',
    icon: '👨‍🚀',
    title: 'Astronaut',
    subtitle: 'Mission Commander',
    color: '#00d4ff',
    border: 'rgba(0,212,255,0.4)',
    glow: 'rgba(0,212,255,0.15)',
    desc: 'You lead the crew through EVAs, emergency procedures, and surface operations on Mars. Physical peak, nerves of steel.',
    perks: ['EVA Specialist', 'Command Authority', 'Survival Expert'],
    badge: '🪐',
    difficulty: 'EXTREME',
  },
  {
    id: 'engineer',
    icon: '👨‍💻',
    title: 'Engineer',
    subtitle: 'Systems Architect',
    color: '#8b5cf6',
    border: 'rgba(139,92,246,0.4)',
    glow: 'rgba(139,92,246,0.15)',
    desc: 'You keep the ship alive. Life support, propulsion, power — if it breaks, you fix it. 140 million km from the nearest repair shop.',
    perks: ['Systems Repair', 'Propulsion Control', 'Habitat Builder'],
    badge: '⚙️',
    difficulty: 'HARD',
  },
  {
    id: 'scientist',
    icon: '🔬',
    title: 'Scientist',
    subtitle: 'Exobiologist',
    color: '#e8692a',
    border: 'rgba(232,105,42,0.4)',
    glow: 'rgba(232,105,42,0.15)',
    desc: 'You search for signs of life in Martian soil. Every rock sample, every subsurface reading — you are humanity\'s first detective on Mars.',
    perks: ['Sample Analysis', 'Life Detection', 'Mars Geology'],
    badge: '🧬',
    difficulty: 'MODERATE',
  },
]

export default function CrewSelection() {
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const { sounds } = useSounds() || { sounds: {} }
  const cardRefs = useRef({})

  const selectRole = (role) => {
    sounds?.click?.()
    if (selected?.id === role.id) { setSelected(null); return }
    setSelected(role)
    // Animate selected card
    const el = cardRefs.current[role.id]
    if (el) {
      gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' })
    }
  }

  const confirm = () => {
    sounds?.achievement?.()
    setConfirmed(true)
  }

  if (confirmed && selected) return (
    <div className="text-center py-12">
      <div className="inline-flex flex-col items-center gap-4 bg-[#0d1b2a]/80 border rounded-2xl px-10 py-8"
        style={{ borderColor: selected.border, boxShadow: `0 0 40px ${selected.glow}` }}>
        <div className="text-6xl animate-float">{selected.icon}</div>
        <div>
          <p className="font-mono text-xs tracking-widest mb-1" style={{ color: selected.color }}>CREW ASSIGNMENT CONFIRMED</p>
          <p className="font-display text-2xl font-black text-white">You are selected as:</p>
          <p className="font-display text-3xl font-black mt-1" style={{ color: selected.color }}>
            {selected.title} {selected.badge}
          </p>
          <p className="font-mono text-xs text-white/40 mt-1">{selected.subtitle}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          {selected.perks.map(p => (
            <span key={p} className="font-mono text-xs px-3 py-1 rounded-full border" style={{ borderColor: selected.border, color: selected.color }}>
              {p}
            </span>
          ))}
        </div>
        <button onClick={() => { setConfirmed(false); setSelected(null) }}
          className="mt-2 font-mono text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest border-b border-white/10 pb-0.5">
          ← CHANGE ROLE
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="text-center mb-8">
        <p className="font-display text-sm font-bold text-white/30 tracking-widest">CHOOSE YOUR ROLE</p>
        <p className="font-mono text-xs text-white/20 mt-1">Click a role to expand — then confirm your assignment</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {ROLES.map(role => {
          const isSelected = selected?.id === role.id
          return (
            <div key={role.id}
              ref={el => cardRefs.current[role.id] = el}
              onClick={() => selectRole(role)}
              className="cursor-pointer rounded-xl border transition-all duration-400 overflow-hidden"
              style={{
                borderColor: isSelected ? role.border : 'rgba(255,255,255,0.07)',
                background: isSelected ? role.glow : 'rgba(13,27,42,0.6)',
                boxShadow: isSelected ? `0 0 30px ${role.glow}, inset 0 0 30px ${role.glow}` : 'none',
                transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
              }}>

              {/* Header */}
              <div className="p-5 flex items-start gap-4">
                {/* Helmet glow on hover/select */}
                <div className="relative flex-shrink-0">
                  <div className="text-4xl transition-all duration-300" style={{
                    filter: isSelected ? `drop-shadow(0 0 12px ${role.color})` : 'none',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  }}>
                    {role.icon}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{role.title}</h3>
                      <p className="font-mono text-xs mt-0.5" style={{ color: role.color }}>{role.subtitle}</p>
                    </div>
                    <span className="font-mono text-xs text-white/20 border border-white/10 rounded px-2 py-0.5">
                      {role.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              <div className={`overflow-hidden transition-all duration-500 ${isSelected ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 pb-5">
                  <div className="h-px bg-white/5 mb-4" />
                  <p className="font-body text-sm text-white/60 leading-relaxed mb-4">{role.desc}</p>
                  <div className="space-y-1.5">
                    {role.perks.map(p => (
                      <div key={p} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full" style={{ background: role.color }} />
                        <span className="font-mono text-xs text-white/50">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Select indicator */}
              <div className="px-5 pb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-white/20">{isSelected ? '● SELECTED' : '○ SELECT'}</span>
                <span className="text-lg">{role.badge}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirm button */}
      {selected && (
        <div className="mt-6 text-center">
          <button onClick={confirm}
            className="font-display font-bold text-sm tracking-widest px-10 py-4 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${selected.color}22, ${selected.color}44)`,
              border: `1px solid ${selected.border}`,
              color: selected.color,
              boxShadow: `0 0 20px ${selected.glow}`,
            }}>
            CONFIRM ASSIGNMENT AS {selected.title.toUpperCase()} →
          </button>
        </div>
      )}
    </div>
  )
}
