import React, { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useSounds } from './SoundEngine'

const ROLES = ['Commander','Pilot','Engineer','Geologist','Biologist','Medic','Communications Officer']
const SPECIALTIES = ['Surface EVA','Sample Analysis','Habitat Construction','Navigation','Life Support','Robotics','Terraforming']

function generateMissionId() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const nums = Math.floor(Math.random() * 9000 + 1000)
  return `MRX-${letters[Math.floor(Math.random()*letters.length)]}${letters[Math.floor(Math.random()*letters.length)]}-${nums}`
}

function generateCrewNumber() {
  return `CREW-${Math.floor(Math.random() * 900 + 100)}`
}

export default function MarsIdentityCard() {
  const [name, setName]         = useState('')
  const [generated, setGenerated] = useState(null)
  const [flipped, setFlipped]   = useState(false)
  const cardRef                 = useRef(null)
  const { sounds } = useSounds() || { sounds: {} }

  const generate = () => {
    if (!name.trim()) return
    sounds?.achievement?.()
    const role = ROLES[Math.floor(Math.random() * ROLES.length)]
    const spec = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)]
    const missionId = generateMissionId()
    const crewNum = generateCrewNumber()
    const launchYear = 2029 + Math.floor(Math.random() * 5)
    setGenerated({ name: name.trim(), role, spec, missionId, crewNum, launchYear })
    setFlipped(false)
    setTimeout(() => {
      if (cardRef.current) {
        gsap.fromTo(cardRef.current, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' })
      }
    }, 50)
  }

  const flipCard = () => {
    sounds?.click?.()
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: flipped ? 0 : 180, duration: 0.5, ease: 'power2.inOut',
        onComplete: () => setFlipped(f => !f)
      })
    }
  }

  const downloadCard = () => {
    if (!generated) return
    sounds?.click?.()
    // Create a text-based download (canvas download requires more setup)
    const content = `
═══════════════════════════════
  MARS MISSION IDENTITY CARD
═══════════════════════════════
  NAME:        ${generated.name}
  ROLE:        ${generated.role}
  SPECIALTY:   ${generated.spec}
  MISSION ID:  ${generated.missionId}
  CREW NO:     ${generated.crewNum}
  LAUNCH YEAR: ${generated.launchYear}
  STATUS:      CLEARED FOR MARS
═══════════════════════════════
  ODYSSEY TO MARS · MRX-001
═══════════════════════════════
    `.trim()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${generated.name.replace(/ /g,'_')}_MarsID.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex gap-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Enter your name, astronaut..."
          maxLength={30}
          className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none font-body"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', }}
        />
        <button
          onClick={generate}
          disabled={!name.trim()}
          className="px-6 py-3 rounded-xl font-display font-bold text-xs tracking-widest transition-all duration-200 disabled:opacity-30 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(0,212,255,0.4)',
            color: '#00d4ff',
          }}
        >
          GENERATE ID
        </button>
      </div>

      {/* Identity Card */}
      {generated && (
        <div className="flex flex-col items-center gap-4">
          <div ref={cardRef} style={{ perspective: 1000, width: '100%', maxWidth: 380 }}>
            <div
              onClick={flipCard}
              className="relative cursor-pointer rounded-2xl overflow-hidden"
              style={{
                height: 220,
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, #0d1b2a, #1a2744)',
                border: '1.5px solid rgba(0,212,255,0.3)',
                boxShadow: '0 0 40px rgba(0,212,255,0.12), 0 0 80px rgba(139,92,246,0.08)',
              }}
            >
              {/* Card front */}
              <div className="absolute inset-0 p-5" style={{ backfaceVisibility: 'hidden' }}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #00d4ff 0, #00d4ff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-white/30 tracking-[0.3em]">MARS MISSION</p>
                    <p className="font-mono text-xs text-cyan-400/70 tracking-widest">IDENTITY CARD</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
                    👨‍🚀
                  </div>
                </div>

                {/* Name */}
                <p className="font-display text-2xl font-black text-white mb-1 uppercase tracking-wide">
                  {generated.name}
                </p>
                <p className="font-mono text-sm text-cyan-400 mb-3">{generated.role}</p>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-xs text-white/25 mb-0.5">SPECIALTY</p>
                    <p className="font-mono text-xs text-purple-400">{generated.spec}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-white/25 mb-0.5">LAUNCH YEAR</p>
                    <p className="font-mono text-xs text-orange-400">{generated.launchYear}</p>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-5 gap-4"
                  style={{ background: 'rgba(0,212,255,0.06)', borderTop: '1px solid rgba(0,212,255,0.15)' }}>
                  <p className="font-mono text-white/40 flex-1" style={{ fontSize: 8, letterSpacing: 2 }}>
                    {generated.missionId}
                  </p>
                  <p className="font-mono text-white/25" style={{ fontSize: 8 }}>CLICK TO FLIP</p>
                </div>
              </div>

              {/* Card back */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg, #1a0a30, #0d1b2a)' }}>
                <div>
                  <p className="font-mono text-xs text-purple-400/70 tracking-[0.3em] mb-4">MISSION CLEARANCE</p>
                  <div className="space-y-2">
                    {[
                      ['MISSION ID', generated.missionId],
                      ['CREW NUMBER', generated.crewNum],
                      ['CLEARANCE LEVEL', 'ALPHA — UNRESTRICTED'],
                      ['DESTINATION', 'MARS · JEZERO CRATER'],
                      ['STATUS', '✓ CLEARED FOR LAUNCH'],
                    ].map(([k,v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="font-mono text-white/30" style={{ fontSize: 9 }}>{k}</span>
                        <span className="font-mono text-white/70 text-xs">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-white/15 text-center" style={{ fontSize: 8, letterSpacing: 3 }}>
                  ODYSSEY TO MARS · MRX-001
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={generate}
              className="font-mono text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2 transition-colors">
              ↺ Regenerate
            </button>
            <button onClick={downloadCard}
              className="font-mono text-xs text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/60 rounded-lg px-4 py-2 transition-colors hover:bg-cyan-400/05">
              ↓ Download Card
            </button>
          </div>
          <p className="font-mono text-xs text-white/20">Click card to flip · Download as .txt</p>
        </div>
      )}
    </div>
  )
}
