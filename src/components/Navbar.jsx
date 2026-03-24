import React, { useState, useEffect } from 'react'

const navItems = [
  { label: 'Hero', href: '#hero' },
  { label: 'Launch', href: '#launch' },
  { label: 'Journey', href: '#space' },
  { label: 'Landing', href: '#landing' },
  { label: 'Explore', href: '#explore' },
  { label: 'Future', href: '#conclusion' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-space-dark/90 backdrop-blur-md border-b border-white/5' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo('#hero')} className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="16" cy="16" r="14" stroke="url(#logoGrad)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="3" fill="#00d4ff" />
              <path d="M16 4 L14 16 L16 28 L18 16 Z" fill="url(#logoGrad)" opacity="0.6" />
              <defs>
                <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d4ff" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display text-sm font-bold tracking-widest text-white group-hover:text-neon-blue transition-colors">
            ODYSSEY
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="font-mono text-xs tracking-widest text-white/50 hover:text-neon-blue transition-colors duration-200 relative group"
            >
              {item.label.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-blue group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('#launch')}
          className="hidden md:flex items-center gap-2 border border-neon-blue/40 text-neon-blue font-mono text-xs tracking-widest px-4 py-2 rounded hover:bg-neon-blue/10 hover:border-neon-blue transition-all duration-200"
        >
          <span>LAUNCH</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0L7.4 4.6H12L8.3 7.4L9.7 12L6 9.2L2.3 12L3.7 7.4L0 4.6H4.6Z" />
          </svg>
        </button>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
        >
          <div className="w-5 space-y-1">
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="bg-space-dark/95 backdrop-blur-md border-t border-white/5 px-6 py-4 space-y-4">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="block w-full text-left font-mono text-xs tracking-widest text-white/50 hover:text-neon-blue transition-colors py-2"
            >
              {item.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
