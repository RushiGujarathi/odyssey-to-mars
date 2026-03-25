import React from 'react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-center">
        <p className="font-display text-sm font-bold text-white/40 tracking-widest">ODYSSEY TO MARS</p>
        <p className="font-mono text-xs text-white/20">AN INTERACTIVE JOURNEY BEYOND EARTH</p>
        <p className="font-mono text-xs text-white/20 mt-1">Built for the stars © 2047</p>
        <p className="font-mono text-xs text-neon-blue/30">MRX-001 MISSION STATUS: ACTIVE</p>
      </div>
    </footer>
  )
}