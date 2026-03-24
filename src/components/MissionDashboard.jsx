import React, { useState } from 'react'
import { useSounds } from './SoundEngine'

const MISSIONS = [
  {
    id: 'perseverance',
    name: 'Perseverance Rover',
    agency: 'NASA',
    status: 'ACTIVE',
    launched: 'Jul 30, 2020',
    location: 'Jezero Crater, Mars',
    icon: '🤖',
    color: '#00d4ff',
    coords: '18.4°N 77.7°E',
    detail: 'Searching for ancient microbial life in what was once a lake delta. Has collected 23 rock samples sealed for future return to Earth. Its MOXIE experiment successfully produced oxygen from CO₂ — a first on Mars.',
    stats: [
      { label: 'Distance Driven', value: '27.4 km' },
      { label: 'Samples Cached', value: '23' },
      { label: 'Sols on Mars', value: '1,450+' },
      { label: 'O₂ Produced', value: '122g' },
    ],
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity Helicopter',
    agency: 'NASA',
    status: 'RETIRED',
    launched: 'Jul 30, 2020',
    location: 'Jezero Crater, Mars',
    icon: '🚁',
    color: '#8b5cf6',
    coords: '18.4°N 77.6°E',
    detail: 'The first powered aircraft to fly on another planet. Completed 72 flights before a rotor blade was damaged. Proved aerial reconnaissance on Mars is possible — paving the way for future Mars helicopters.',
    stats: [
      { label: 'Total Flights', value: '72' },
      { label: 'Max Altitude', value: '24m' },
      { label: 'Total Distance', value: '17km' },
      { label: 'Status', value: 'Retired' },
    ],
  },
  {
    id: 'artemis',
    name: 'Artemis Program',
    agency: 'NASA',
    status: 'IN PROGRESS',
    launched: 'Nov 16, 2022',
    location: 'Moon / En route',
    icon: '🌙',
    color: '#e8692a',
    coords: 'Lunar Gateway',
    detail: 'Artemis is humanity\'s stepping stone to Mars. Establishing a permanent lunar base and Gateway station in lunar orbit will rehearse the deep-space systems needed for a crewed Mars mission by 2030.',
    stats: [
      { label: 'Phase', value: 'Artemis III' },
      { label: 'Crew', value: 'Mixed (First woman on Moon)' },
      { label: 'Launch Vehicle', value: 'SLS Block 1B' },
      { label: 'Mars Goal', value: '2030s' },
    ],
  },
]

export default function MissionDashboard() {
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const { sounds } = useSounds() || { sounds: {} }

  const toggle = (id) => {
    sounds?.click?.()
    setActive(active === id ? null : id)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <p className="font-display text-sm font-bold text-white/30 tracking-widest">📡 MISSION CONTROL DASHBOARD</p>
        <p className="font-mono text-xs text-white/20 mt-1">Click any mission for full briefing</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {MISSIONS.map(m => {
          const isOpen = active === m.id
          const isHov = hovered === m.id
          return (
            <div key={m.id}
              onClick={() => toggle(m.id)}
              onMouseEnter={() => { setHovered(m.id); sounds?.hover?.() }}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer rounded-xl border transition-all duration-400 overflow-hidden"
              style={{
                borderColor: isOpen || isHov ? m.color + '60' : 'rgba(255,255,255,0.07)',
                background: isOpen ? m.color + '10' : 'rgba(13,27,42,0.6)',
                boxShadow: isOpen ? `0 0 25px ${m.color}20` : isHov ? `0 0 15px ${m.color}15` : 'none',
                transform: isOpen ? 'translateY(-3px)' : 'none',
              }}>

              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl" style={{ filter: isHov || isOpen ? `drop-shadow(0 0 8px ${m.color})` : 'none' }}>
                    {m.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      m.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' :
                      m.status === 'IN PROGRESS' ? 'bg-yellow-400 animate-pulse' :
                      'bg-white/20'
                    }`} />
                    <span className="font-mono text-xs" style={{ color: m.status === 'ACTIVE' ? '#4ade80' : m.status === 'IN PROGRESS' ? '#facc15' : 'rgba(255,255,255,0.3)' }}>
                      {m.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-sm font-bold text-white mb-0.5">{m.name}</h3>
                <p className="font-mono text-xs mb-2" style={{ color: m.color }}>{m.agency}</p>

                <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
                  <span>📍 {m.location}</span>
                </div>

                {/* Expanded detail */}
                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <div className="border-t border-white/5 pt-4">
                    <p className="font-body text-xs text-white/60 leading-relaxed mb-4">{m.detail}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {m.stats.map(s => (
                        <div key={s.label} className="bg-[#0d1b2a]/60 rounded p-2 border border-white/5">
                          <p className="font-mono text-xs text-white/30 mb-0.5">{s.label}</p>
                          <p className="font-display text-xs font-bold" style={{ color: m.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-mono text-xs text-white/20">COORDS: {m.coords}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-white/20">LAUNCHED {m.launched}</span>
                <span className="font-mono text-xs" style={{ color: m.color }}>{isOpen ? '▲ CLOSE' : '▼ DETAILS'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}