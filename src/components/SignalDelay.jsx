import React, { useState, useRef, useEffect } from 'react'
import { useSounds } from './SoundEngine'

const RESPONSES = [
  { trigger: ['hello','hi','hey'],          reply: '👋 Signal received at Mars Base Alpha. Hello from 54.6 million kilometres away. Sol 312 — all well here.' },
  { trigger: ['status','update','report'],  reply: '📊 All systems nominal. Crew: 7 active. O₂: 98%. Power: 94%. Hab pressure: 101.3 kPa. Rover: standby.' },
  { trigger: ['weather','storm','dust'],    reply: '🌪 Dust storm advisory active — Sector 7. Reduced visibility to 200m. EVA suspended for 48 sols.' },
  { trigger: ['help','sos','emergency'],    reply: '⚠️ PRIORITY SIGNAL. Mission Control activating emergency protocols. All crew accounted for. Stand by.' },
  { trigger: ['water','ice','resource'],    reply: '💧 Ice extraction nominal: 847L today. Electrolysis producing O₂ at 2.3 kg/hr. Reserves at 68%.' },
  { trigger: ['power','energy','reactor'],  reply: '⚛️ Nuclear reactor: 2.1 MW output. Solar backup: 340 kW. Return mission fuel: 67% reserved.' },
  { trigger: ['crew','people','team'],      reply: '👨‍🚀 Crew of 7 active. Cmdr Chen leads EVA today. Dr. Patel analyzing Jezero sample #MRX-089.' },
  { trigger: ['life','microbe','bio'],      reply: '🔬 ALERT: Anomalous organics in sample #MRX-089. Peer review in progress. Do not publish yet.' },
  { trigger: ['food','farm','plant'],       reply: '🌱 Greenhouse yield: 42kg this week. Potatoes thriving. Lettuce batch 3 harvested. Morale: excellent.' },
  { trigger: ['mars','planet','surface'],   reply: '🔴 Mars surface temp today: -58°C. Wind: 12 m/s from NW. Olympus Mons visible at 340km bearing.' },
]

function getReply(msg) {
  const low = msg.toLowerCase()
  for (const r of RESPONSES) {
    if (r.trigger.some(t => low.includes(t))) return r.reply
  }
  return `📡 Signal acknowledged. One-way delay today: ${(3 + Math.random()*4).toFixed(1)} min. Message queued for Base Alpha crew review.`
}

export default function SignalDelay() {
  const [messages, setMessages] = useState([
    { role: 'system', text: '📡 Connected to Mars Relay Network — MRX-001. Messages experience 3–22 minute real delay. Simulated at 3–10s for demo.' }
  ])
  const [input,   setInput]   = useState('')
  const [pending, setPending] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [delay,   setDelay]   = useState(0)
  const chatRef  = useRef(null)
  const timerRef = useRef(null)
  const { sounds } = useSounds() || { sounds: {} }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, elapsed])

  const send = () => {
    const msg = input.trim()
    if (!msg || pending) return
    sounds?.click?.()
    setInput('')
    setMessages(m => [...m, { role: 'earth', text: msg }])
    const d = 3 + Math.random() * 7
    const reply = getReply(msg)
    setDelay(d)
    setPending(true)
    setElapsed(0)

    const start = Date.now()
    timerRef.current = setInterval(() => {
      const e = (Date.now() - start) / 1000
      setElapsed(e)
      if (e >= d) {
        clearInterval(timerRef.current)
        setPending(false)
        setElapsed(0)
        setMessages(m => [...m, { role: 'mars', text: reply }])
        sounds?.achievement?.()
      }
    }, 80)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  return (
    <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: 'rgba(8,12,20,0.95)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5"
        style={{ background: 'linear-gradient(90deg, rgba(232,105,42,0.08), rgba(139,92,246,0.05), transparent)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(232,105,42,0.15)', border: '1px solid rgba(232,105,42,0.4)' }}>
            <span className="text-sm">📡</span>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-400 border-2 border-[#080c14]"
              style={{ animation: 'pulse 2s infinite' }} />
          </div>
          <div>
            <p className="font-display text-xs font-bold text-white">MARS COMMS RELAY</p>
            <p className="font-mono text-xs text-orange-400/60">Base Alpha · Sol 312</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-white/25">ONE-WAY DELAY</p>
          <p className="font-mono text-xs font-bold text-orange-400">~8 MIN TODAY</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="px-4 py-4 space-y-3 overflow-y-auto" style={{ height: 240 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'earth' ? 'justify-end' : m.role === 'system' ? 'justify-center' : 'justify-start'} gap-2 items-end`}>
            {m.role === 'system' && (
              <p className="font-mono text-center text-white/25 leading-relaxed" style={{ fontSize: 10 }}>{m.text}</p>
            )}
            {m.role === 'mars' && (
              <>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                  style={{ background: 'rgba(232,105,42,0.2)', border: '1px solid rgba(232,105,42,0.3)' }}>🔴</div>
                <div className="max-w-[80%] rounded-xl rounded-bl-sm px-3 py-2.5 text-xs leading-relaxed"
                  style={{ background: 'linear-gradient(135deg,rgba(232,105,42,0.12),rgba(193,68,14,0.08))', border: '1px solid rgba(232,105,42,0.2)', color: 'rgba(255,230,210,0.85)' }}>
                  {m.text}
                  <p className="font-mono mt-1 opacity-40" style={{ fontSize: 9 }}>🔴 Mars Base Alpha</p>
                </div>
              </>
            )}
            {m.role === 'earth' && (
              <>
                <div className="max-w-[80%] rounded-xl rounded-br-sm px-3 py-2.5 text-xs leading-relaxed"
                  style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.12),rgba(0,150,200,0.08))', border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(200,240,255,0.85)' }}>
                  {m.text}
                  <p className="font-mono mt-1 opacity-40" style={{ fontSize: 9 }}>🌍 Mission Control, Earth</p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                  style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>🌍</div>
              </>
            )}
          </div>
        ))}

        {/* Signal traveling indicator */}
        {pending && (
          <div className="flex justify-center">
            <div className="rounded-xl px-4 py-3 border border-purple-400/20 w-full"
              style={{ background: 'rgba(139,92,246,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 0.8s infinite' }} />
                  <p className="font-mono text-xs text-purple-300/80">Signal traveling to Mars…</p>
                </div>
                <span className="font-mono text-xs text-white/30">{elapsed.toFixed(1)}s / {delay.toFixed(1)}s</span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-none"
                  style={{
                    width: `${Math.min(100,(elapsed/delay)*100)}%`,
                    background: 'linear-gradient(90deg, #8b5cf6, #00d4ff)',
                    boxShadow: '0 0 6px rgba(139,92,246,0.6)',
                  }} />
              </div>
              <p className="font-mono text-xs text-white/20 mt-1.5">
                🛰 Relaying via MRX-001 satellite · {Math.round((1-(elapsed/delay))*delay*60)} seconds remaining
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick messages */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {['Hello Mars!','Status report','Any life signs?','Weather report','Crew check-in','Power status'].map(s => (
          <button key={s} onClick={() => { setInput(s) }} disabled={pending}
            className="font-mono px-2.5 py-1 rounded-full border transition-all disabled:opacity-30 hover:border-orange-400/40 hover:text-orange-300"
            style={{ fontSize: 10, borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-4 pb-4">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder={pending?'Waiting for Mars response…':'Send a message to Mars Base Alpha…'}
          disabled={!!pending}
          className="flex-1 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none font-mono disabled:opacity-40"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <button onClick={send} disabled={!!pending}
          className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-30 hover:scale-105"
          style={{ background: pending?'rgba(255,255,255,0.04)':'linear-gradient(135deg,rgba(232,105,42,0.25),rgba(193,68,14,0.15))', border:`1px solid ${pending?'rgba(255,255,255,0.08)':'rgba(232,105,42,0.5)'}`, color: pending?'rgba(255,255,255,0.25)':'#e8692a' }}>
          {pending ? '📡' : 'SEND ▸'}
        </button>
      </div>
    </div>
  )
}