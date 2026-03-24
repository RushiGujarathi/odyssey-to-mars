import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Hero section — cinematic opening with Earth, title reveal, and scroll CTA
export default function Hero() {
  const sectionRef = useRef(null)
  const earthRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    // Entrance animations with staggered reveal
    const tl = gsap.timeline({ delay: 0.5 })

    tl.fromTo(earthRef.current,
      { scale: 0.6, opacity: 0, rotation: -20 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.8, ease: 'power3.out' }
    )
    .fromTo(titleRef.current.children,
      { y: 60, opacity: 0, skewX: 3 },
      { y: 0, opacity: 1, skewX: 0, duration: 1, stagger: 0.15, ease: 'power3.out' },
      '-=1.2'
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(statsRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.3'
    )

    // Continuous Earth rotation
    gsap.to(earthRef.current, {
      rotation: 5,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  const scrollToLaunch = () => {
    document.querySelector('#launch')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Atmospheric glow behind Earth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-neon-blue/5 blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="order-2 md:order-1">
          {/* Mission tag */}
          <div className="inline-flex items-center gap-2 border border-neon-blue/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            <span className="font-mono text-xs text-neon-blue tracking-widest">MISSION: MRX-2047</span>
          </div>

          {/* Main title */}
          <div ref={titleRef} className="overflow-hidden">
            <h1 className="font-display font-black leading-none mb-2">
              <span className="block text-5xl md:text-7xl lg:text-8xl text-white">ODYSSEY</span>
              <span className="block text-5xl md:text-7xl lg:text-8xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-mars-orange">TO MARS</span>
              </span>
            </h1>
          </div>

          <p ref={subtitleRef} className="font-body text-lg text-white/50 mt-6 mb-8 max-w-md leading-relaxed">
            Humanity's greatest adventure awaits. Follow the mission from launch to landing
            across <span className="text-neon-blue">54.6 million kilometers</span> of empty space.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToLaunch}
              className="group relative overflow-hidden bg-neon-blue text-space-dark font-display font-bold text-sm tracking-widest px-8 py-4 rounded transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/30"
            >
              <span className="relative z-10">BEGIN JOURNEY</span>
              <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>
            <button className="font-mono text-sm text-white/40 hover:text-white/70 transition-colors tracking-widest border-b border-white/20 pb-1">
              LEARN MORE ↓
            </button>
          </div>

          {/* Stats bar */}
          <div ref={statsRef} className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5">
            {[
              { label: 'Distance', value: '54.6M', unit: 'KM' },
              { label: 'Travel Time', value: '6–9', unit: 'MONTHS' },
              { label: 'Crew Size', value: '7', unit: 'ASTRONAUTS' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display text-2xl md:text-3xl font-bold text-neon-blue">{stat.value}</p>
                <p className="font-mono text-xs text-white/30 tracking-widest">{stat.unit}</p>
                <p className="font-body text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Earth visualization */}
        <div className="order-1 md:order-2 flex items-center justify-center">
          <div ref={earthRef} data-gravity="slow" className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Outer atmosphere ring */}
            <div className="absolute inset-0 rounded-full border border-neon-blue/10 animate-spin-slow" />
            <div className="absolute -inset-4 rounded-full border border-neon-blue/5" style={{ animation: 'spin 30s linear infinite reverse' }} />
            
            {/* Orbit path */}
            <div className="absolute -inset-8 rounded-full border border-white/5 border-dashed" />

            {/* Satellite on orbit */}
            <div className="absolute -inset-8 rounded-full" style={{ animation: 'spin 15s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3">
                <div className="w-3 h-3 bg-neon-blue rounded-sm rotate-45 shadow-lg shadow-neon-blue/50" />
              </div>
            </div>

            {/* Earth sphere */}
            <div className="absolute inset-0 rounded-full overflow-hidden" style={{
              background: `
                radial-gradient(circle at 35% 35%, #1a6b9e 0%, #0d4b7a 30%, #063559 60%, #02203a 100%)
              `,
              boxShadow: `
                0 0 60px rgba(0,100,200,0.4),
                0 0 120px rgba(0,100,200,0.2),
                inset -20px -20px 60px rgba(5,8,18,0.7)
              `
            }}>
              {/* Continent shapes */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-60">
                <ellipse cx="80" cy="70" rx="30" ry="20" fill="#2d9e5a" opacity="0.8" />
                <ellipse cx="120" cy="90" rx="25" ry="35" fill="#2d9e5a" opacity="0.7" />
                <ellipse cx="60" cy="120" rx="20" ry="15" fill="#2d9e5a" opacity="0.6" />
                <ellipse cx="150" cy="60" rx="15" ry="10" fill="#2d9e5a" opacity="0.5" />
                {/* Cloud layers */}
                <ellipse cx="70" cy="50" rx="35" ry="8" fill="white" opacity="0.2" />
                <ellipse cx="130" cy="130" rx="30" ry="6" fill="white" opacity="0.15" />
                <ellipse cx="100" cy="170" rx="40" ry="7" fill="white" opacity="0.1" />
              </svg>

              {/* Atmosphere rim */}
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle at 30% 30%, transparent 60%, rgba(100,180,255,0.3) 100%)',
              }} />
            </div>

            {/* Glow ring */}
            <div className="absolute -inset-2 rounded-full" style={{
              background: 'radial-gradient(ellipse, transparent 70%, rgba(0,150,255,0.15) 100%)',
            }} />

            {/* Mars small preview — upper right */}
            <div data-gravity="medium" className="absolute -top-4 -right-4 w-14 h-14 rounded-full" style={{
              background: 'radial-gradient(circle at 40% 35%, #e8692a 0%, #c1440e 50%, #7a2800 100%)',
              boxShadow: '0 0 20px rgba(193,68,14,0.4)',
            }}>
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1) 0%, transparent 60%)',
              }} />
            </div>

            {/* Distance line */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 400 400">
              <line x1="340" y1="60" x2="280" y2="140" stroke="rgba(0,212,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <text x="345" y="56" fill="rgba(0,212,255,0.5)" fontSize="8" fontFamily="monospace">MARS</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="font-mono text-xs text-white/40 tracking-widest">SCROLL TO LAUNCH</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
          <div className="absolute top-0 w-full h-4 bg-neon-blue/80 animate-bounce" />
        </div>
      </div>
    </section>
  )
}