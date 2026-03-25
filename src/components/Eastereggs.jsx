import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const EGGS = [
  {
    id: 'konami',
    type: 'konami',
    title: '🕹️ Konami Code Unlocked!',
    message: 'You found the legendary code! The original astronaut training program used Konami codes as memory exercises. True story? Maybe not. But you found it!',
    color: '#ffcc00',
  },
  {
    id: 'star17',
    type: 'star_click',
    title: '⭐ Secret Star Found!',
    message: 'This star is designated HD 40307g — a super-Earth 42 light-years away with conditions similar to Mars. You have excellent eyes, explorer.',
    color: '#00d4ff',
  },
  {
    id: 'logo5',
    type: 'logo_clicks',
    title: '🚀 Mission Control Access!',
    message: 'ACCESS LEVEL: ALPHA CLEARANCE. You found the hidden command channel. The real Mars mission codename is "Ares Vallis." Welcome to the inner circle.',
    color: '#8b5cf6',
  },
]

export default function EasterEggs() {
  const [found, setFound]     = useState([])
  const [showing, setShowing] = useState(null)
  const [logoClicks, setLogoClicks] = useState(0)
  const [keys, setKeys]       = useState([])
  const panelRef              = useRef(null)
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

  const unlock = (egg) => {
    if (found.includes(egg.id)) return
    setFound(f => [...f, egg.id])
    setShowing(egg)
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' }
      )
      gsap.to(panelRef.current, { opacity: 0, y: -20, duration: 0.4, delay: 5, ease: 'power2.in', onComplete: () => setShowing(null) })
    }
  }

  // Konami code listener
  useEffect(() => {
    const onKey = (e) => {
      setKeys(prev => {
        const next = [...prev, e.key].slice(-10)
        if (next.join(',') === KONAMI.join(',')) unlock(EGGS[0])
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [found])

  // Logo click easter egg (5 rapid clicks on navbar logo)
  useEffect(() => {
    const logo = document.querySelector('nav button:first-child')
    if (!logo) return
    let count = 0, timer = null
    const onClick = () => {
      count++
      clearTimeout(timer)
      timer = setTimeout(() => { count = 0 }, 1500)
      if (count >= 5) { count = 0; unlock(EGGS[2]) }
    }
    logo.addEventListener('click', onClick)
    return () => logo.removeEventListener('click', onClick)
  }, [found])

  // Hidden star in hero — inject one glowing star user can click
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const star = document.createElement('div')
    star.style.cssText = `position:absolute;top:35%;right:18%;width:8px;height:8px;border-radius:50%;background:#fff;
      cursor:pointer;z-index:5;animation:twinkle 1.5s ease-in-out infinite;box-shadow:0 0 6px #fff,0 0 12px #00d4ff;`
    star.title = 'What star is this?'
    star.onclick = () => unlock(EGGS[1])
    hero.style.position = 'relative'
    hero.appendChild(star)
    return () => star.remove()
  }, [])

  return (
    <>
      {/* Toast notification */}
      {showing && (
        <div
          ref={panelRef}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[9997] max-w-sm w-full px-4"
        >
          <div className="rounded-2xl p-5 border shadow-2xl"
            style={{
              background: 'rgba(10,14,24,0.97)',
              borderColor: showing.color + '50',
              boxShadow: `0 0 40px ${showing.color}25`,
              backdropFilter: 'blur(20px)',
            }}>
            <div className="flex items-start gap-3">
              <div className="text-3xl">{showing.title.split(' ')[0]}</div>
              <div>
                <p className="font-mono text-xs tracking-widest mb-1" style={{ color: showing.color }}>
                  🥚 EASTER EGG #{found.length} FOUND
                </p>
                <p className="font-display text-sm font-black text-white mb-2">{showing.title.slice(3)}</p>
                <p className="font-body text-xs text-white/60 leading-relaxed">{showing.message}</p>
              </div>
            </div>
            <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full" style={{ background: showing.color, animation: 'loadBar 5s linear forwards' }} />
            </div>
          </div>
        </div>
      )}

      {/* Counter badge */}
      {found.length > 0 && (
        <div className="fixed bottom-6 left-20 z-40">
          <div className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-full border border-yellow-400/30 text-yellow-400/70"
            style={{ background: 'rgba(255,204,0,0.08)' }}>
            🥚 {found.length}/{EGGS.length}
          </div>
        </div>
      )}
    </>
  )
}