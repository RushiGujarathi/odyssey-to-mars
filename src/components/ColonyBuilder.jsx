import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useSounds } from './SoundEngine'

const OPTIONS = {
  habitat: [
    { id: 'dome',        label: 'Geodesic Dome',    icon: '🔵', desc: 'Transparent pressurized dome. Best visibility, moderate radiation protection.',     color: '#00d4ff', crew: 20, cost: '$$',  risk: 'Medium' },
    { id: 'underground', label: 'Lava Tube Base',   icon: '🟤', desc: 'Natural cave. Maximum radiation shielding, near-zero construction cost.',           color: '#e8692a', crew: 50, cost: '$',   risk: 'Low' },
    { id: 'module',      label: 'Modular Hab Stack', icon: '🟦', desc: 'Expandable cylinders. Scalable, industry-standard, quick to deploy.',              color: '#8b5cf6', crew: 35, cost: '$$$', risk: 'Low' },
  ],
  rover: [
    { id: 'cargo',    label: 'Cargo Hauler',     icon: '🚛', desc: 'Heavy-lift 6-wheel rover. Carries 2 tonnes. Slow but reliable.',   color: '#e8692a', range: '500km',  speed: '10km/h' },
    { id: 'explorer', label: 'Science Explorer', icon: '🔬', desc: 'Drill, spectrometer, cameras. The science workhorse.',             color: '#00d4ff', range: '1000km', speed: '25km/h' },
    { id: 'fast',     label: 'Crew Transport',   icon: '🏎️', desc: 'Pressurized cab for 4. Fast and essential for EVA emergencies.', color: '#8b5cf6', range: '800km',  speed: '60km/h' },
  ],
  energy: [
    { id: 'solar',   label: 'Solar Farm',          icon: '☀️',  desc: 'Photovoltaic arrays. Excellent near equator, weak in dust storms.', color: '#ffcc00', output: '500kW', risk: 'Dust storms' },
    { id: 'nuclear', label: 'Nuclear Fission',     icon: '⚛️',  desc: 'Compact reactor. Reliable 24/7 power, weather-independent.',      color: '#4ade80', output: '2MW',   risk: 'Very low' },
    { id: 'hybrid',  label: 'Wind + Solar Hybrid', icon: '🌬️', desc: 'Dual-source for resilience. Lower output but never fully dark.',   color: '#a78bfa', output: '800kW', risk: 'Moderate' },
  ],
}

const COLONY_RESULTS = {
  'dome+cargo+solar':        { name: 'Horizon Base',        score: 72, grade: 'B', vibe: 'Tourist-friendly but dust-vulnerable.' },
  'dome+cargo+nuclear':      { name: 'Apex Station',        score: 88, grade: 'A', vibe: 'Premium colony. High visibility, stable power.' },
  'dome+explorer+nuclear':   { name: 'Discovery Prime',     score: 86, grade: 'A', vibe: 'Stunning views and top-tier science output.' },
  'dome+fast+nuclear':       { name: 'Nexus Outpost',       score: 82, grade: 'B+', vibe: 'Fast rescue capability. Great for expeditions.' },
  'underground+cargo+solar': { name: 'Bunker Alpha',        score: 78, grade: 'B+', vibe: 'Safe from radiation but risky power supply.' },
  'underground+cargo+nuclear': { name: 'Fortress Marineris', score: 95, grade: 'S', vibe: 'Safest colony possible. Built to last centuries.' },
  'underground+explorer+nuclear': { name: 'Deep Science Lab', score: 91, grade: 'A+', vibe: 'Maximum science. The researchers\' dream colony.' },
  'underground+fast+nuclear':{ name: 'Shadow Compound',     score: 87, grade: 'A', vibe: 'Rapid response + max protection. Elite ops base.' },
  'module+cargo+solar':      { name: 'Frontier Post',       score: 70, grade: 'B-', vibe: 'Quick setup but power instability in storms.' },
  'module+explorer+nuclear': { name: 'Research Nexus',      score: 89, grade: 'A', vibe: 'Expandable science hub. Ideal for long missions.' },
  'module+fast+nuclear':     { name: 'Rapid Deploy Alpha',  score: 85, grade: 'A', vibe: 'Fast, flexible, expandable. The SpaceX choice.' },
  'module+fast+hybrid':      { name: 'Agile Station',       score: 80, grade: 'B+', vibe: 'Resilient power + fast crew. Well-rounded choice.' },
}

const MarsColonySVG = ({ hab, rov, eng }) => (
  <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    {/* Sky */}
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c4632a" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#e8844e" stopOpacity="0.4"/>
      </linearGradient>
      <radialGradient id="sun" cx="80%" cy="20%">
        <stop offset="0%" stopColor="#ffe8b0" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#ffe8b0" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="300" height="160" fill="url(#sky)" />
    <ellipse cx="240" cy="30" rx="50" ry="50" fill="url(#sun)" />

    {/* Ground */}
    <path d="M0 115 Q75 108 150 112 Q225 116 300 110 L300 160 L0 160Z" fill="#7a2800" />
    <path d="M0 120 Q75 113 150 117 Q225 121 300 115 L300 160 L0 160Z" fill="#8b3008" />

    {/* Surface rocks */}
    {[[20,118,8,4],[80,116,5,3],[200,119,7,4],[270,117,6,3]].map(([x,y,rx,ry],i)=>(
      <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#5a1800" />
    ))}

    {/* HABITAT */}
    {hab?.id === 'dome' && <>
      <ellipse cx="110" cy="110" rx="55" ry="38" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />
      <ellipse cx="110" cy="110" rx="55" ry="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <line x1="110" y1="72" x2="110" y2="148" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5"/>
      <line x1="55" y1="110" x2="165" y2="110" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5"/>
      <ellipse cx="110" cy="110" rx="20" ry="14" fill="rgba(0,212,255,0.12)" />
      <text x="110" y="114" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="8" fontFamily="monospace">BASE</text>
    </>}
    {hab?.id === 'underground' && <>
      <rect x="70" y="100" width="80" height="25" rx="3" fill="#3a1400" stroke="#e8692a" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="90" y="90" width="40" height="14" rx="2" fill="#4a1800" stroke="#e8692a" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="105" y="84" width="10" height="8" rx="1" fill="#2a0e00" stroke="#e8692a" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="110" y="116" textAnchor="middle" fill="rgba(232,105,42,0.8)" fontSize="7" fontFamily="monospace">LAVA TUBE BASE</text>
      {[0,1,2,3,4].map(i=><line key={i} x1={75+i*16} y1="100" x2={75+i*16} y2="125" stroke="rgba(232,105,42,0.2)" strokeWidth="0.5"/>)}
    </>}
    {hab?.id === 'module' && <>
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x={60+i*38} y="92" width="32" height="26" rx="10" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.2" />
          <circle cx={76+i*38} cy="105" r="4" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.6)" strokeWidth="0.8" />
          {i < 2 && <rect x={92+i*38} y="101" width="6" height="8" rx="2" fill="rgba(139,92,246,0.4)" />}
        </g>
      ))}
      <text x="110" y="130" textAnchor="middle" fill="rgba(139,92,246,0.7)" fontSize="7" fontFamily="monospace">MOD-HAB ARRAY</text>
    </>}

    {/* ENERGY SOURCE */}
    {eng?.id === 'solar' && <>
      {[0,1,2,3,4].map(i=>(
        <g key={i}>
          <rect x={180+i*20} y="100" width="14" height="20" rx="1" fill="#1a3a5c" stroke="rgba(255,204,0,0.6)" strokeWidth="0.8" />
          {[0,1,2].map(j=><line key={j} x1={183+i*20} y1={104+j*5} x2={191+i*20} y2={104+j*5} stroke="rgba(255,204,0,0.3)" strokeWidth="0.4"/>)}
          <line x1={187+i*20} y1="100" x2={187+i*20} y2="120" stroke="rgba(255,204,0,0.2)" strokeWidth="0.4"/>
          <line x1={180+i*20} y1="120" x2={194+i*20} y2="120" stroke="#4a3800" strokeWidth="1"/>
        </g>
      ))}
      <text x="235" y="132" textAnchor="middle" fill="rgba(255,204,0,0.7)" fontSize="7" fontFamily="monospace">SOLAR ARRAY</text>
    </>}
    {eng?.id === 'nuclear' && <>
      <rect x="210" y="88" width="28" height="36" rx="4" fill="rgba(74,222,128,0.15)" stroke="rgba(74,222,128,0.5)" strokeWidth="1.2" />
      <ellipse cx="224" cy="88" rx="10" ry="5" fill="rgba(74,222,128,0.25)" stroke="rgba(74,222,128,0.5)" strokeWidth="1" />
      <circle cx="224" cy="106" r="7" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.6)" strokeWidth="1" />
      <path d="M224 99 L227 106 L221 106Z" fill="rgba(74,222,128,0.5)" />
      <text x="224" y="134" textAnchor="middle" fill="rgba(74,222,128,0.7)" fontSize="7" fontFamily="monospace">REACTOR</text>
    </>}
    {eng?.id === 'hybrid' && <>
      {/* Wind turbines */}
      {[0,1].map(i=>(
        <g key={i}>
          <line x1={198+i*22} y1="95" x2={198+i*22} y2="120" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5"/>
          {[0,1,2].map(j=>(
            <line key={j} x1={198+i*22} y1="95"
              x2={198+i*22+Math.cos(j*2.09)*10} y2={95+Math.sin(j*2.09)*10}
              stroke="rgba(167,139,250,0.7)" strokeWidth="1"/>
          ))}
        </g>
      ))}
      <rect x="228" y="105" width="20" height="14" rx="1" fill="#1a3a5c" stroke="rgba(255,204,0,0.5)" strokeWidth="0.8" />
      <text x="213" y="133" textAnchor="middle" fill="rgba(167,139,250,0.7)" fontSize="7" fontFamily="monospace">HYBRID POWER</text>
    </>}

    {/* ROVER */}
    {rov && <>
      <ellipse cx="148" cy="122" rx="18" ry="5" fill="rgba(0,0,0,0.3)" />
      <rect x="133" y="112" width="30" height="12" rx="3"
        fill={rov.id==='cargo'?'rgba(232,105,42,0.4)':rov.id==='explorer'?'rgba(0,212,255,0.35)':'rgba(139,92,246,0.35)'}
        stroke={rov.color} strokeWidth="0.8" />
      {[0,1,2].map(i=>(
        <ellipse key={i} cx={135+i*10} cy="124" rx="3.5" ry="4.5"
          fill="#2a0e00" stroke={rov.color} strokeWidth="0.7" />
      ))}
      <circle cx="152" cy="109" r="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6"/>
      <line x1="148" y1="103" x2="148" y2="112" stroke={rov.color} strokeWidth="0.8" opacity="0.7"/>
    </>}

    {/* Colony name label at top */}
    <rect x="8" y="6" width="120" height="14" rx="3" fill="rgba(0,0,0,0.45)"/>
    <text x="68" y="16" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontFamily="monospace" fontWeight="bold">YOUR COLONY</text>
  </svg>
)

export default function ColonyBuilder() {
  const [sel, setSel] = useState({ habitat: null, rover: null, energy: null })
  const [built, setBuilt] = useState(false)
  const [step, setStep] = useState(0) // 0=habitat 1=rover 2=energy 3=done
  const resultRef = useRef(null)
  const { sounds } = useSounds() || { sounds: {} }

  const steps = [
    { key: 'habitat', label: 'CHOOSE HABITAT',      items: OPTIONS.habitat },
    { key: 'rover',   label: 'CHOOSE ROVER',         items: OPTIONS.rover },
    { key: 'energy',  label: 'CHOOSE ENERGY SOURCE', items: OPTIONS.energy },
  ]

  const pick = (cat, id) => {
    sounds?.click?.()
    setSel(s => ({ ...s, [cat]: id }))
    setBuilt(false)
    if (step < 2) setTimeout(() => setStep(s => s + 1), 400)
  }

  const allDone = sel.habitat && sel.rover && sel.energy

  const buildKey = allDone ? `${sel.habitat}+${sel.rover}+${sel.energy}` : ''
  const result = COLONY_RESULTS[buildKey] || { name: 'Custom Colony', score: 78, grade: 'B+', vibe: 'A functional, well-rounded Mars settlement.' }

  const hab = OPTIONS.habitat.find(o => o.id === sel.habitat)
  const rov = OPTIONS.rover.find(o => o.id === sel.rover)
  const eng = OPTIONS.energy.find(o => o.id === sel.energy)

  const build = () => {
    sounds?.achievement?.()
    setBuilt(true)
    setTimeout(() => {
      if (resultRef.current) {
        gsap.fromTo(resultRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        )
      }
    }, 50)
  }

  const reset = () => {
    sounds?.click?.()
    setSel({ habitat: null, rover: null, energy: null })
    setBuilt(false)
    setStep(0)
  }

  const gradeColor = { 'S': '#ffd700', 'A+': '#4ade80', 'A': '#4ade80', 'B+': '#00d4ff', 'B': '#00d4ff', 'B-': '#8b9bb4' }

  return (
    <div className="space-y-6">
      {/* Step progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <button
              onClick={() => setStep(i)}
              className="flex items-center gap-2 transition-all"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300"
                style={{
                  background: sel[s.key] ? '#00d4ff' : step === i ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${sel[s.key] ? '#00d4ff' : step === i ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: sel[s.key] ? '#0b0f1a' : step === i ? '#00d4ff' : 'rgba(255,255,255,0.3)',
                }}
              >
                {sel[s.key] ? '✓' : i + 1}
              </div>
              <span className={`font-mono text-xs hidden sm:block transition-colors ${step === i ? 'text-white/70' : 'text-white/25'}`}>
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px" style={{ background: sel[steps[i].key] ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.07)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current step options */}
      {!built && step < 3 && (
        <div>
          <p className="font-mono text-xs text-white/30 tracking-widest mb-3">{steps[step].label}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {steps[step].items.map(opt => {
              const isSelected = sel[steps[step].key] === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => pick(steps[step].key, opt.id)}
                  className="text-left rounded-xl border p-4 transition-all duration-300"
                  style={{
                    borderColor: isSelected ? opt.color + '70' : 'rgba(255,255,255,0.07)',
                    background: isSelected ? opt.color + '14' : 'rgba(13,27,42,0.7)',
                    boxShadow: isSelected ? `0 0 22px ${opt.color}22` : 'none',
                    transform: isSelected ? 'translateY(-3px) scale(1.01)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" style={{ filter: isSelected ? `drop-shadow(0 0 6px ${opt.color})` : 'none' }}>
                      {opt.icon}
                    </span>
                    <div>
                      <p className="font-display text-xs font-bold text-white">{opt.label}</p>
                      {isSelected && (
                        <p className="font-mono text-xs" style={{ color: opt.color }}>● SELECTED</p>
                      )}
                    </div>
                  </div>
                  <p className="font-body text-xs text-white/50 leading-relaxed mb-3">{opt.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(opt).filter(([k]) => !['id','label','icon','desc','color'].includes(k)).map(([k,v]) => (
                      <span key={k} className="font-mono text-xs px-2 py-0.5 rounded border border-white/10 text-white/35">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors">← Back</button>
              : <div />
            }
            {sel[steps[step].key] && step < 2 && (
              <button onClick={() => setStep(s => s + 1)}
                className="font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors border-b border-cyan-400/30 pb-0.5">
                Next step →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary before build */}
      {allDone && !built && (
        <div className="rounded-xl border border-white/8 p-5" style={{ background: 'rgba(13,27,42,0.8)' }}>
          <p className="font-mono text-xs text-white/30 tracking-widest mb-4">YOUR SELECTIONS</p>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[['Habitat', hab], ['Rover', rov], ['Energy', eng]].map(([label, item]) => item && (
              <div key={label} className="text-center">
                <div className="text-3xl mb-1" style={{ filter: `drop-shadow(0 0 8px ${item.color})` }}>{item.icon}</div>
                <p className="font-display text-xs font-bold text-white">{item.label}</p>
                <p className="font-mono text-xs text-white/30">{label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={build}
            className="w-full font-display font-black text-sm tracking-widest py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(139,92,246,0.18))',
              border: '1px solid rgba(0,212,255,0.45)',
              color: '#00d4ff',
              boxShadow: '0 0 28px rgba(0,212,255,0.15)',
            }}
          >
            🏗️ BUILD MY COLONY ON MARS →
          </button>
        </div>
      )}

      {/* Built result — colony render + stats */}
      {built && allDone && (
        <div ref={resultRef} className="space-y-4">
          {/* Colony SVG visualization */}
          <div className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(10,14,22,0.9)' }}>
            <MarsColonySVG hab={hab} rov={rov} eng={eng} />
          </div>

          {/* Result card */}
          <div className="rounded-xl border p-5"
            style={{
              borderColor: 'rgba(74,222,128,0.3)',
              background: 'rgba(74,222,128,0.05)',
              boxShadow: '0 0 30px rgba(74,222,128,0.08)',
            }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-green-400/70 tracking-widest mb-1">🏙️ COLONY ESTABLISHED</p>
                <h3 className="font-display text-2xl font-black text-white">{result.name}</h3>
                <p className="font-body text-sm text-white/55 italic mt-1">{result.vibe}</p>
              </div>
              <div className="text-center flex-shrink-0 ml-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center font-display text-3xl font-black"
                  style={{
                    background: `${gradeColor[result.grade] || '#4ade80'}18`,
                    border: `2px solid ${gradeColor[result.grade] || '#4ade80'}50`,
                    color: gradeColor[result.grade] || '#4ade80',
                  }}
                >
                  {result.grade}
                </div>
                <p className="font-mono text-xs text-white/30 mt-1">GRADE</p>
              </div>
            </div>

            {/* Stat bars */}
            <div className="space-y-2 mb-4">
              {[
                { label: 'Viability', val: result.score, color: '#4ade80' },
                { label: 'Safety',    val: hab?.id === 'underground' ? 95 : hab?.id === 'module' ? 75 : 65, color: '#00d4ff' },
                { label: 'Power',     val: eng?.id === 'nuclear' ? 95 : eng?.id === 'hybrid' ? 78 : 60, color: '#ffcc00' },
                { label: 'Mobility',  val: rov?.id === 'fast' ? 90 : rov?.id === 'explorer' ? 70 : 55, color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-xs text-white/40">{s.label}</span>
                    <span className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.val}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${s.val}%`, background: `linear-gradient(90deg, ${s.color}80, ${s.color})` }} />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="w-full font-mono text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 rounded-lg py-3 transition-colors tracking-widest"
            >
              ↺ BUILD ANOTHER COLONY
            </button>
          </div>
        </div>
      )}
    </div>
  )
}