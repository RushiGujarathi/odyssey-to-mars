import React from 'react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display text-sm font-bold text-white/40 tracking-widest">ODYSSEY TO MARS</p>
          <p className="font-mono text-xs text-white/20 mt-1">AN INTERACTIVE JOURNEY BEYOND EARTH</p>
        </div>
        <div className="flex items-center gap-8">
          {['NASA', 'SpaceX', 'ESA', 'ISRO'].map(agency => (
            <span key={agency} className="font-mono text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer tracking-widest">
              {agency}
            </span>
          ))}
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-white/20">Built for the stars © 2047</p>
          <p className="font-mono text-xs text-neon-blue/30 mt-1">MRX-001 MISSION STATUS: ACTIVE</p>
        </div>
      </div>
    </footer>
  )
}
