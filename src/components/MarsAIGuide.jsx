import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useSounds } from './SoundEngine'

const KB = [
  { keys: ['astronaut','become','join','crew','apply','how to'], answer: "To become a Mars astronaut: ① STEM degree (engineering, biology, physics) ② 1,000+ flight hours OR 3 years professional experience ③ Pass NASA/SpaceX medical & psychological screening ④ 2+ years EVA & systems training. Selection rate: ~0.08% — but the mission needs YOU." },
  { keys: ['distance','far','km','miles','how long'], answer: "Mars is 54.6M km at closest approach and 401M km at farthest. Light takes 3–22 minutes between planets. A Hohmann transfer orbit takes 6–9 months one-way." },
  { keys: ['temperature','cold','hot','weather','climate','degrees'], answer: "Mars averages −60°C, ranging from −125°C at poles to +20°C near the equator. Dust storms can engulf the entire planet for months. Wind hits 30 m/s but the thin air means it feels gentle." },
  { keys: ['life','alive','microbe','bacteria','organism','biosignature'], answer: "Not confirmed yet, but signs are promising! Perseverance found organic molecules in Jezero Crater. Curiosity detected methane spikes. Subsurface liquid brines may harbor extremophiles. The search is ongoing." },
  { keys: ['oxygen','breathe','air','atmosphere','co2'], answer: "Mars atmosphere is 95% CO₂ at 0.6% Earth pressure. NASA's MOXIE on Perseverance split CO₂ into O₂, producing 122g total. Scaled up, this technology could supply a full colony." },
  { keys: ['water','ice','ocean','liquid','river'], answer: "Both poles have water ice. Subsurface brines may exist. Ancient valley networks prove liquid water flowed 3 billion years ago. Ice can be electrolyzed into H₂ fuel and drinking water." },
  { keys: ['olympus','mons','volcano','mountain','tall'], answer: "Olympus Mons is 21.9 km tall (3× Everest) and 600 km wide — so wide you can't see the summit from the base. It formed because Mars has no tectonic plates, so the crust stayed over the same hotspot." },
  { keys: ['gravity','weight','heavy','light'], answer: "Mars gravity is 3.72 m/s² — 38% of Earth's. A 70 kg person weighs only 26.5 kg on Mars. Long-term exposure causes muscle atrophy and bone density loss." },
  { keys: ['colony','base','habitat','live','settle','terraform'], answer: "Early colonies will be underground or in lava tubes for radiation protection. Pressurized habs will grow food hydroponically. Terraforming: 100–1,000 years using greenhouse gases and synthetic biology." },
  { keys: ['radiation','cancer','solar','cosmic','danger'], answer: "Mars gets 2× more radiation than the ISS. A 6-month mission = ~300 mSv (15× nuclear worker limit). Solutions: underground habs, polyethylene shielding, and future genetic modifications." },
  { keys: ['food','eat','grow','farm','plant'], answer: "Mars colonies will grow food in pressurized greenhouses using Martian regolith amended with Earth microbes. Potatoes, lettuce, and radishes are top candidates. Perchlorates must first be removed from the soil." },
  { keys: ['spacex','starship','rocket','vehicle'], answer: "SpaceX Starship is designed for Mars — 120m tall, carries 100+ tonnes, fully reusable. Uses methane fuel that can be produced on Mars (Sabatier process), enabling return trips. First crewed landing: 2030s." },
  { keys: ['moons','phobos','deimos'], answer: "Phobos (27 km) orbits so low it rises in the west twice a day and will crash into Mars in ~50M years. Deimos (15 km) is smaller and farther. Both are likely captured asteroids." },
  { keys: ['day','sol','time','year','hour'], answer: "A Martian sol is 24h 39m 35s — 40 mins longer than Earth. A Martian year is 687 Earth days. Mars has 4 seasons, each nearly twice as long as Earth's." },
  { keys: ['cost','money','billion','price','expensive'], answer: "Estimates: $500B (NASA) to $10B (SpaceX Starship scenario). Elon Musk's goal: $100,000 ticket eventually. Apollo cost $28B in 1960s dollars — Mars is the next moonshot." },
]

const SUGGESTIONS = [
  "How do I become an astronaut?",
  "How far is Mars?",
  "Is there life on Mars?",
  "How do we breathe there?",
  "What is Olympus Mons?",
  "How much do I weigh on Mars?",
]

function getAnswer(input) {
  const lower = input.toLowerCase()
  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) return entry.answer
  }
  return "Great question! Try asking about: distance to Mars, life, temperature, astronaut training, water, gravity, Olympus Mons, or Starship."
}

export default function MarsAIGuide() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: "👋 Hello explorer! I'm ARIA — Mars Intelligence Assistant. Ask me anything about Mars or the mission!" }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatRef = useRef(null)
  const panelRef = useRef(null)
  const { sounds } = useSounds() || { sounds: {} }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  useEffect(() => {
    if (!open || !panelRef.current) return
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.4)' }
    )
  }, [open])

  const send = (text) => {
    const q = (text || input).trim()
    if (!q) return
    sounds?.click?.()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'ai', text: getAnswer(q) }])
    }, 700 + Math.random() * 400)
  }

  return (
    <>
      {/* Floating button — sits above the toast zone */}
      <button
        onClick={() => { setOpen(o => !o); sounds?.click?.() }}
        className="fixed z-[9999] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        style={{
          bottom: '7.5rem', right: '1.5rem',
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0d1b2a, #1a2744)',
          border: '1.5px solid rgba(0,212,255,0.5)',
          boxShadow: open ? '0 0 28px rgba(0,212,255,0.45)' : '0 0 14px rgba(0,212,255,0.2)',
        }}
        title="Ask ARIA"
      >
        <span className="text-xl">{open ? '✕' : '🤖'}</span>
        {!open && <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />}
      </button>

      {/* Chat panel — opens upward from the button */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9998]"
          style={{
            bottom: '9.5rem', right: '1.5rem',
            width: 340,
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'rgba(10,14,24,0.97)',
            border: '1px solid rgba(0,212,255,0.18)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,212,255,0.08)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
            style={{ background: 'linear-gradient(90deg,rgba(0,212,255,0.07),transparent)' }}>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-cyan-400/15 flex items-center justify-center text-base">🤖</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0a0e18]" />
            </div>
            <div>
              <p className="font-display text-xs font-bold text-white">ARIA</p>
              <p className="font-mono text-xs text-cyan-400/60">Mars Intelligence · Online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="px-4 py-3 space-y-2.5 overflow-y-auto" style={{ height: 220 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed"
                  style={{
                    background: m.role === 'user' ? 'rgba(0,212,255,0.13)' : 'rgba(255,255,255,0.05)',
                    border: m.role === 'user' ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    color: m.role === 'user' ? '#e0f8ff' : 'rgba(255,255,255,0.78)',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-xl px-4 py-3 flex gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"
                      style={{ animation: `bounce 0.7s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.slice(0, 3).map(s => (
              <button key={s} onClick={() => send(s)}
                className="font-mono text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 px-4 pb-4">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about Mars..."
              className="flex-1 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none font-mono"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            <button onClick={() => send()}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-colors flex-shrink-0"
              style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 6.5L2 2l2.5 4.5L2 11l9-4.5z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}