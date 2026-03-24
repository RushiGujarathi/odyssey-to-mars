import React, { useState } from 'react'
import { useSounds } from './SoundEngine'

const PRESETS = {
  mars:    { temp: -60,  gravity: 0.38, pressure: 0.6,  oxygen: 0.1,  name: 'Mars Surface', color: '#e8692a' },
  earth:   { temp:  15,  gravity: 1.00, pressure: 100,  oxygen: 21,   name: 'Earth',         color: '#00d4ff' },
  habitat: { temp:  22,  gravity: 0.38, pressure: 101,  oxygen: 21,   name: 'Mars Habitat',  color: '#4ade80' },
  polar:   { temp: -125, gravity: 0.38, pressure: 0.5,  oxygen: 0.1,  name: 'Mars Poles',    color: '#a8d8ea' },
}

export default function MarsEnvironmentSim() {
  const [env, setEnv] = useState({ temp: -60, gravity: 0.38, pressure: 0.6, oxygen: 0.1 })
  const { sounds } = useSounds() || { sounds: {} }

  const getSurvival = () => {
    const ok = env.temp > 0 && env.temp < 40 && env.pressure > 50 && env.oxygen > 16
    const suit = env.pressure > 10 && env.oxygen > 10
    if (ok) return { status: '✅ Survivable', color: '#4ade80', desc: 'You could survive here without a suit!' }
    if (suit) return { status: '🧑‍🚀 Suit Required', color: '#ffcc00', desc: 'Pressurized suit needed to survive.' }
    return { status: '💀 Lethal', color: '#ff4444', desc: 'You would not survive these conditions.' }
  }

  const getBodyWeight = () => (70 * env.gravity).toFixed(1)
  const getJumpHeight = () => (2.5 * (1 / env.gravity)).toFixed(1)
  const getBoilPoint  = () => (100 * (env.pressure / 101.3)).toFixed(0)

  const survival = getSurvival()

  const applyPreset = (key) => {
    sounds?.click?.()
    setEnv({ ...PRESETS[key] })
  }

  const sliders = [
    { key: 'temp',     label: 'Temperature',   unit: '°C',   min: -130, max: 50,  step: 1,   color: '#e8692a',  desc: env.temp < -50 ? 'Extreme cold' : env.temp < 0 ? 'Freezing' : env.temp < 30 ? 'Comfortable' : 'Hot' },
    { key: 'gravity',  label: 'Gravity',        unit: '× g',  min: 0.1,  max: 1.5, step: 0.01,color: '#8b5cf6',  desc: env.gravity < 0.5 ? 'Low gravity — floating feeling' : env.gravity < 0.9 ? 'Reduced' : 'Earth-like' },
    { key: 'pressure', label: 'Air Pressure',   unit: '% atm',min: 0.1,  max: 110, step: 0.1, color: '#00d4ff',  desc: env.pressure < 1 ? 'Near vacuum' : env.pressure < 30 ? 'Very thin air' : 'Breathable' },
    { key: 'oxygen',   label: 'Oxygen Level',   unit: '%',    min: 0,    max: 25,  step: 0.1, color: '#4ade80',  desc: env.oxygen < 2 ? 'No oxygen' : env.oxygen < 10 ? 'Hypoxic' : 'Sufficient' },
  ]

  return (
    <div className="space-y-5">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([key, p]) => (
          <button key={key} onClick={() => applyPreset(key)}
            className="font-mono text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105"
            style={{ borderColor: p.color + '50', color: p.color, background: p.color + '0d' }}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {sliders.map(s => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-white/50">{s.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white/30">{s.desc}</span>
                <span className="font-display text-sm font-black" style={{ color: s.color }}>
                  {env[s.key]}{s.unit}
                </span>
              </div>
            </div>
            <input
              type="range" min={s.min} max={s.max} step={s.step}
              value={env[s.key]}
              onChange={e => { setEnv(v => ({ ...v, [s.key]: parseFloat(e.target.value) })) }}
              className="w-full cursor-pointer h-1.5 rounded-full appearance-none"
              style={{ accentColor: s.color }}
            />
          </div>
        ))}
      </div>

      {/* Survival indicator */}
      <div className="rounded-xl border p-4"
        style={{ borderColor: survival.color + '40', background: survival.color + '08' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-base font-black" style={{ color: survival.color }}>
            {survival.status}
          </span>
        </div>
        <p className="font-body text-sm text-white/55">{survival.desc}</p>
      </div>

      {/* Fun stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Your Weight', value: `${getBodyWeight()} kg`, sub: 'on 70kg person', color: '#8b5cf6' },
          { label: 'Max Jump', value: `${getJumpHeight()} m`, sub: 'from 2.5m on Earth', color: '#00d4ff' },
          { label: 'Water Boils', value: `${getBoilPoint()}°C`, sub: 'at this pressure', color: '#e8692a' },
        ].map(s => (
          <div key={s.label} className="text-center rounded-xl p-3 border border-white/5"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="font-display text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="font-mono text-white/40 mt-0.5" style={{ fontSize: 9 }}>{s.label}</p>
            <p className="font-mono text-white/20" style={{ fontSize: 8 }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}