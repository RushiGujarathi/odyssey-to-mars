import React, { useEffect, useRef } from 'react'

// Adapts ambient audio per section using Web Audio API
// No external files — all synthesized
export default function AdaptiveSound() {
  const ctxRef    = useRef(null)
  const nodesRef  = useRef({})
  const sectionRef= useRef('hero')

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return ctxRef.current
  }

  const stopAll = () => {
    Object.values(nodesRef.current).forEach(n => {
      try { n.gain?.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.3) } catch {}
      try { setTimeout(() => n.source?.stop(), 400) } catch {}
    })
    nodesRef.current = {}
  }

  const playSection = (section) => {
    if (sectionRef.current === section) return
    sectionRef.current = section
    stopAll()
    const ctx = getCtx()
    if (ctx.state === 'suspended') return // wait for user gesture

    if (section === 'space') {
      // Deep space ambient drone — very quiet
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination)
      osc.type = 'sine'; osc.frequency.value = 55
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
      osc.start()
      // Second harmonic
      const osc2 = ctx.createOscillator()
      const g2   = ctx.createGain()
      osc2.connect(g2); g2.connect(ctx.destination)
      osc2.type = 'sine'; osc2.frequency.value = 82
      g2.gain.setValueAtTime(0, ctx.currentTime)
      g2.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 3)
      osc2.start()
      nodesRef.current = { source: osc, gain: g, source2: osc2, gain2: g2 }
    }

    if (section === 'landing') {
      // Wind / atmosphere whoosh
      const bufSize = ctx.sampleRate * 2
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.3
      const src = ctx.createBufferSource()
      src.buffer = buf; src.loop = true
      const filt = ctx.createBiquadFilter()
      filt.type = 'bandpass'; filt.frequency.value = 300; filt.Q.value = 0.8
      const g = ctx.createGain()
      src.connect(filt); filt.connect(g); g.connect(ctx.destination)
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
      src.start()
      nodesRef.current = { source: src, gain: g }
    }
  }

  useEffect(() => {
    // Detect section based on scroll position
    const sections = ['hero','launch','space','landing','explore','conclusion']
    const onScroll = () => {
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          playSection(id); break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // Unlock audio on first user interaction
    const unlock = () => { getCtx().resume(); document.removeEventListener('click', unlock) }
    document.addEventListener('click', unlock)
    return () => {
      window.removeEventListener('scroll', onScroll)
      stopAll()
    }
  }, [])

  return null
}