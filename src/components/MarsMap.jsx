import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useSounds } from './SoundEngine'

const LOCATIONS = [
  { id:'olympus',    name:'Olympus Mons',      type:'Shield Volcano',  x:22, y:36, icon:'🏔️', color:'#e8692a',
    detail:'Tallest volcano in the solar system — 21.9 km high, 600 km wide. So vast the summit is below the horizon from its base.',
    facts:['21.9 km altitude','600 km diameter','3× taller than Everest','Dormant ~25M years'] },
  { id:'jezero',     name:'Jezero Crater',     type:'Landing Zone',    x:56, y:39, icon:'🔴', color:'#00d4ff',
    detail:'Ancient lake delta 3.5 billion years ago. Home to Perseverance Rover, collecting samples for Earth return.',
    facts:['Perseverance Rover here','Ancient river delta','49 km diameter','23 samples cached'] },
  { id:'valles',     name:'Valles Marineris',  type:'Canyon System',   x:50, y:54, icon:'🌋', color:'#8b5cf6',
    detail:'4,000 km long — would stretch across the USA. Up to 7 km deep with walls spanning billions of years of geology.',
    facts:['4,000 km long','7 km deep','Width of USA','Water ice confirmed'] },
  { id:'north_pole', name:'North Polar Cap',   type:'Ice Reserve',     x:50, y:9,  icon:'🧊', color:'#a8d8ea',
    detail:'Permanent water ice cap — enough to flood Mars 5.6m deep. Critical future water and fuel source for colonists.',
    facts:['1,000 km across','2 km thick ice','Permanent H₂O','Future fuel source'] },
  { id:'base',       name:'Colony Base Alpha', type:'Future Base',     x:63, y:37, icon:'🏗️', color:'#4ade80',
    detail:'Planned first permanent human settlement near Jezero. Target: 6 crew by 2035, expanding to 50+ by 2045.',
    facts:['Near water ice','Lava tube candidate','Target: 2035','6 crew initial'] },
  { id:'hellas',     name:'Hellas Basin',      type:'Impact Crater',   x:69, y:63, icon:'💥', color:'#ff4444',
    detail:'Deepest crater on Mars — 7 km below average surface. Higher pressure inside makes it a future habitat candidate.',
    facts:['7 km below surface','2,300 km wide','Higher pressure','Geothermal possible'] },
]

export default function MarsMap() {
  const [active,  setActive]  = useState(null)
  const [hovered, setHovered] = useState(null)
  const popupRef = useRef(null)
  const { sounds } = useSounds() || { sounds: {} }
  // Satellite angle
  const [satAngle, setSatAngle] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setSatAngle(a => (a + 0.4) % 360), 30)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (active && popupRef.current) {
      gsap.fromTo(popupRef.current,
        { opacity:0, y:10, scale:0.97 },
        { opacity:1, y:0, scale:1, duration:0.3, ease:'back.out(1.4)' }
      )
    }
  }, [active?.id])

  const select = (loc) => { sounds?.click?.(); setActive(active?.id===loc.id ? null : loc) }

  // Satellite position
  const satRad  = (satAngle * Math.PI) / 180
  const satCX   = 50, satCY = 48, satRX = 46, satRY = 14
  const satX    = satCX + satRX * Math.cos(satRad)
  const satY    = satCY + satRY * Math.sin(satRad)
  const satFront= Math.sin(satRad) > 0 // in front of mars

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-display text-sm font-bold text-white tracking-widest">🗺️ MARS SURFACE MAP</p>
          <p className="font-mono text-xs text-white/25 mt-0.5">{LOCATIONS.length} sites · click any to explore</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs text-green-400/70">SATELLITE LIVE</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-white/8" style={{ paddingBottom:'50%', background:'#3d0e00' }}>
        {/* Mars surface */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <defs>
            <radialGradient id="mg" cx="42%" cy="42%" r="65%">
              <stop offset="0%" stopColor="#c1440e"/>
              <stop offset="35%" stopColor="#922d08"/>
              <stop offset="70%" stopColor="#631e04"/>
              <stop offset="100%" stopColor="#3a0e00"/>
            </radialGradient>
          </defs>
          <rect width="100" height="50" fill="url(#mg)"/>
          {/* Olympus Mons */}
          <ellipse cx="22" cy="35" rx="7" ry="5" fill="rgba(255,140,60,0.22)"/>
          <ellipse cx="22" cy="35" rx="3" ry="2.2" fill="rgba(255,170,80,0.28)"/>
          {/* Valles Marineris */}
          <path d="M28 51 Q50 49.5 72 53" stroke="rgba(40,8,0,0.85)" strokeWidth="2.2" fill="none"/>
          {/* North polar cap */}
          <ellipse cx="50" cy="7.5" rx="13" ry="5.5" fill="rgba(210,230,255,0.28)"/>
          <ellipse cx="50" cy="7.5" rx="8" ry="3.2" fill="rgba(235,245,255,0.22)"/>
          {/* Hellas basin */}
          <ellipse cx="69" cy="62" rx="10" ry="7" fill="rgba(20,4,0,0.6)"/>
          {/* Craters */}
          {[[14,14,1.8],[82,22,1.4],[36,61,2.2],[86,52,1.6],[9,54,1.4],[76,9,1.1]].map(([cx,cy,r],i)=>(
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(60,15,0,0.35)" strokeWidth="0.5"/>
          ))}
          {/* Atmosphere */}
          <rect width="100" height="50" fill="url(#atm)" opacity="0.18"/>
          <defs>
            <linearGradient id="atm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9060" stopOpacity="0.6"/>
              <stop offset="40%" stopColor="#ff6030" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Satellite orbit ellipse (behind) */}
          <ellipse cx={satCX} cy={satCY} rx={satRX} ry={satRY}
            fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="0.4" strokeDasharray="2 3"/>

          {/* Satellite — only draw when behind mars (satFront=false) */}
          {!satFront && (
            <g transform={`translate(${satX},${satY})`}>
              <rect x="-2" y="-1" width="4" height="2" rx="0.5" fill="#8b9bb4"/>
              <rect x="-5" y="-0.8" width="2.8" height="1.6" rx="0.3" fill="#1a3a5c" stroke="rgba(0,212,255,0.8)" strokeWidth="0.3"/>
              <rect x="2.2" y="-0.8" width="2.8" height="1.6" rx="0.3" fill="#1a3a5c" stroke="rgba(0,212,255,0.8)" strokeWidth="0.3"/>
              <circle cx="0" cy="0" r="0.8" fill="rgba(0,212,255,0.9)"/>
            </g>
          )}
        </svg>

        {/* Location pins */}
        {LOCATIONS.map(loc => {
          const isA = active?.id===loc.id, isH = hovered===loc.id
          return (
            <button key={loc.id} onClick={()=>select(loc)}
              onMouseEnter={()=>{setHovered(loc.id);sounds?.hover?.()}} onMouseLeave={()=>setHovered(null)}
              className="absolute" style={{ left:`${loc.x}%`, top:`${loc.y}%`, transform:'translate(-50%,-50%)', zIndex: isA?20:10 }}>
              <div className="relative flex flex-col items-center">
                {isA && <div className="absolute rounded-full border-2 animate-ping"
                  style={{ borderColor:loc.color, width:30, height:30, top:0, left:0, margin:'-2px' }} />}
                <div className="flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: isA||isH?32:26, height: isA||isH?32:26,
                    background: isA?`${loc.color}28`:`${loc.color}15`,
                    border:`2px solid ${loc.color}`,
                    boxShadow: isA||isH?`0 0 14px ${loc.color}90`:'none',
                    fontSize: isA||isH?14:11,
                  }}>{loc.icon}</div>
                {(isH||isA) && (
                  <div className="absolute whitespace-nowrap font-mono text-xs font-bold pointer-events-none"
                    style={{ bottom:'105%', marginBottom:3, color:loc.color, textShadow:'0 1px 6px #000, 0 0 10px #000' }}>
                    {loc.name}
                  </div>
                )}
              </div>
            </button>
          )
        })}

        {/* Satellite — draw in front when satFront=true */}
        {satFront && (
          <div className="absolute pointer-events-none" style={{ left:`${satX}%`, top:`${satY}%`, transform:'translate(-50%,-50%)', zIndex:15 }}>
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <rect x="7" y="5" width="8" height="4" rx="1" fill="#8b9bb4"/>
              <rect x="0" y="4" width="6" height="6" rx="1" fill="#1a3a5c" stroke="rgba(0,212,255,0.8)" strokeWidth="0.8"/>
              <rect x="16" y="4" width="6" height="6" rx="1" fill="#1a3a5c" stroke="rgba(0,212,255,0.8)" strokeWidth="0.8"/>
              <circle cx="11" cy="7" r="2" fill="rgba(0,212,255,0.9)"/>
              <line x1="11" y1="0" x2="11" y2="4" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info popup */}
      {active && (
        <div ref={popupRef} className="mt-4 rounded-xl border p-5"
          style={{ borderColor:active.color+'45', background:`${active.color}08`, boxShadow:`0 0 24px ${active.color}12` }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background:active.color+'1e', border:`1px solid ${active.color}40` }}>{active.icon}</div>
              <div>
                <h3 className="font-display text-base font-black text-white">{active.name}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full border"
                  style={{ borderColor:active.color+'40', color:active.color }}>{active.type}</span>
              </div>
            </div>
            <button onClick={()=>setActive(null)} className="text-white/30 hover:text-white/70 transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5">×</button>
          </div>
          <p className="font-body text-sm text-white/65 leading-relaxed mb-4">{active.detail}</p>
          <div className="grid grid-cols-2 gap-2">
            {active.facts.map(f=>(
              <div key={f} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{background:active.color}}/>
                <span className="font-mono text-xs text-white/55">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}