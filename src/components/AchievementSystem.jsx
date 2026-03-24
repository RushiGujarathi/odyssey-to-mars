import React, { useState, useEffect, useCallback, useRef } from 'react'
import { gsap } from 'gsap'

const ACHIEVEMENTS = [
  { id: 'explorer',    icon: '🛰️',  title: 'Explorer Unlocked',    desc: 'You started the odyssey',        trigger: 0.05 },
  { id: 'launch',     icon: '🚀',  title: 'Launch Operator',       desc: 'You initiated launch sequence',  trigger: 0.18 },
  { id: 'astronaut',  icon: '👨‍🚀', title: 'Astronaut Certified',   desc: 'Crossed the void of space',      trigger: 0.42 },
  { id: 'navigator',  icon: '🧭',  title: 'Deep Space Navigator',  desc: 'Survived the transit phase',     trigger: 0.58 },
  { id: 'pioneer',    icon: '🔴',  title: 'Mars Pioneer',          desc: 'You touched down on Mars!',      trigger: 0.72 },
  { id: 'scientist',  icon: '🔬',  title: 'Mars Scientist',        desc: 'Explored the red planet',        trigger: 0.85 },
  { id: 'visionary',  icon: '🌌',  title: 'Visionary',             desc: 'You completed the Odyssey!',     trigger: 0.97 },
]

export default function AchievementSystem() {
  const [unlocked, setUnlocked] = useState(new Set())
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const toastRef = useRef(null)
  const processedRef = useRef(new Set())

  // Show toast
  const showToast = useCallback((achievement) => {
    setCurrent(achievement)
    if (toastRef.current) {
      gsap.fromTo(toastRef.current,
        { x: 120, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
      )
      gsap.to(toastRef.current, {
        x: 120, opacity: 0, duration: 0.5, ease: 'power2.in',
        delay: 3.5,
        onComplete: () => setCurrent(null)
      })
    }
  }, [])

  // Process queue
  useEffect(() => {
    if (queue.length > 0 && !current) {
      const [next, ...rest] = queue
      setQueue(rest)
      showToast(next)
    }
  }, [queue, current, showToast])

  // Scroll watcher
  useEffect(() => {
    const onScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      ACHIEVEMENTS.forEach(a => {
        if (progress >= a.trigger && !processedRef.current.has(a.id)) {
          processedRef.current.add(a.id)
          setUnlocked(prev => new Set([...prev, a.id]))
          setQueue(prev => [...prev, a])
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Only toast notification — no badge counter, no top-right panel
  return (
    <>
      {current && (
        <div ref={toastRef} className="fixed bottom-6 right-6 z-[9998] pointer-events-none">
          <div className="flex items-center gap-3 bg-[#0d1b2a]/95 border border-yellow-400/40 rounded-xl px-5 py-4 shadow-2xl shadow-yellow-400/10 backdrop-blur-md min-w-64">
            <div className="text-3xl">{current.icon}</div>
            <div>
              <p className="font-mono text-xs text-yellow-400 tracking-widest mb-0.5">ACHIEVEMENT UNLOCKED</p>
              <p className="font-display text-sm font-bold text-white">{current.title}</p>
              <p className="font-mono text-xs text-white/40">{current.desc}</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}