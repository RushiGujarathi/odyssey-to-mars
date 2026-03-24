import React, { useEffect, useState } from 'react'

const MILESTONES = [
  { id: 'launch',      label: 'Launch',      icon: '🚀', section: 'launch',     threshold: 0.10 },
  { id: 'travel',      label: 'Transit',     icon: '🌌', section: 'space',      threshold: 0.30 },
  { id: 'landing',     label: 'Landing',     icon: '🔴', section: 'landing',    threshold: 0.52 },
  { id: 'exploration', label: 'Explore',     icon: '🛸', section: 'explore',    threshold: 0.68 },
  { id: 'colony',      label: 'Colony',      icon: '🏗️', section: 'conclusion', threshold: 0.85 },
]

export default function MissionProgressBar() {
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(new Set())
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)
      setProgress(p)
      setVisible(p > 0.02)
      const done = new Set()
      MILESTONES.forEach(m => { if (p >= m.threshold) done.add(m.id) })
      setCompleted(done)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9985] pointer-events-none">
      {/* Thin progress line */}
      <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full transition-none"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, #00d4ff, #8b5cf6 50%, #e8692a)`,
            boxShadow: '0 0 8px rgba(0,212,255,0.6)',
          }}
        />
      </div>

      {/* Milestone dots */}
      <div className="pointer-events-auto flex items-center justify-center gap-0 px-4 py-1.5">
        <div className="flex items-center gap-0 bg-[#0b0f1a]/80 backdrop-blur-sm rounded-full px-3 py-1 border border-white/5">
          {MILESTONES.map((m, i) => (
            <React.Fragment key={m.id}>
              <button
                onClick={() => scrollTo(m.section)}
                title={m.label}
                className="flex flex-col items-center gap-0.5 px-2 group transition-all duration-200"
              >
                <span className={`text-xs transition-all duration-300 ${completed.has(m.id) ? 'opacity-100' : 'opacity-25'}`}
                  style={{ filter: completed.has(m.id) ? 'none' : 'grayscale(1)' }}>
                  {m.icon}
                </span>
                <span className={`font-mono text-xs leading-none transition-colors duration-200 ${
                  completed.has(m.id) ? 'text-white/60' : 'text-white/20'
                } group-hover:text-white/80`} style={{ fontSize: 8 }}>
                  {m.label}
                </span>
              </button>
              {i < MILESTONES.length - 1 && (
                <div className="w-8 h-px mx-1 flex-shrink-0" style={{
                  background: completed.has(m.id) && completed.has(MILESTONES[i+1].id)
                    ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}