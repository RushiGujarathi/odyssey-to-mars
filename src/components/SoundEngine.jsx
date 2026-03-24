import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react'

// Sound context so any component can trigger sounds
export const SoundContext = createContext(null)

export function useSounds() {
  return useContext(SoundContext)
}

// Generates sounds via Web Audio API — no external files needed!
function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)()
}

function playTone(ctx, freq, type, duration, gain = 0.3, detune = 0) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.connect(g)
  g.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  osc.detune.setValueAtTime(detune, ctx.currentTime)
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playNoise(ctx, duration, gain = 0.1) {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 400
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  source.connect(filter)
  filter.connect(g)
  g.connect(ctx.destination)
  source.start()
}

export function SoundProvider({ children }) {
  const ctxRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const ambientRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = createAudioContext()
    return ctxRef.current
  }, [])

  const sounds = {
    click: () => {
      if (muted) return
      const ctx = getCtx()
      playTone(ctx, 880, 'sine', 0.08, 0.15)
      playTone(ctx, 1200, 'sine', 0.05, 0.08)
    },
    launch: () => {
      if (muted) return
      const ctx = getCtx()
      // Rumble build-up
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          playNoise(ctx, 0.3, 0.05 + i * 0.015)
          playTone(ctx, 60 + i * 10, 'sawtooth', 0.3, 0.08 + i * 0.01)
        }, i * 150)
      }
      // Whoosh
      setTimeout(() => {
        playNoise(ctx, 1.5, 0.2)
        playTone(ctx, 200, 'sawtooth', 1.5, 0.15, -200)
      }, 1200)
    },
    achievement: () => {
      if (muted) return
      const ctx = getCtx()
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(ctx, freq, 'sine', 0.3, 0.2), i * 100)
      })
    },
    hover: () => {
      if (muted) return
      const ctx = getCtx()
      playTone(ctx, 440, 'sine', 0.05, 0.05)
    },
    ambient: () => {
      if (muted) return
      const ctx = getCtx()
      if (ambientRef.current) return
      // Low ambient hum
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g)
      g.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 55
      g.gain.value = 0.03
      osc.start()
      ambientRef.current = { osc, g }
    },
    stopAmbient: () => {
      if (ambientRef.current) {
        ambientRef.current.g.gain.exponentialRampToValueAtTime(0.001, ctxRef.current.currentTime + 1)
        setTimeout(() => { ambientRef.current?.osc.stop(); ambientRef.current = null }, 1000)
      }
    },
  }

  return (
    <SoundContext.Provider value={{ sounds, muted, setMuted }}>
      {children}
      {/* Mute toggle button */}
      <button
        onClick={() => { setMuted(m => !m); sounds.click() }}
        className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-[#0d1b2a]/80 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
        title={muted ? 'Unmute' : 'Mute'}>
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 3L5 6H2v4h3l4 3V3z" /><line x1="13" y1="4" x2="10" y2="7" /><line x1="10" y1="4" x2="13" y2="7" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 3L5 6H2v4h3l4 3V3z" /><path d="M12 6c.5.8.8 1.7.8 2.8s-.3 2-.8 2.7" /><path d="M14 4c1 1.5 1.5 3 1.5 4.8s-.5 3.3-1.5 4.7" />
          </svg>
        )}
      </button>
    </SoundContext.Provider>
  )
}
