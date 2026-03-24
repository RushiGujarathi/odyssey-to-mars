/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: { dark: '#0b0f1a', navy: '#0d1b2a', blue: '#1a2744' },
        neon:  { blue: '#00d4ff', purple: '#8b5cf6', red: '#ff4444', orange: '#ff6b35' },
        mars:  { red: '#c1440e', orange: '#e8692a', dust: '#d4835a' },
      },
      fontFamily: {
        display: ['Orbitron','monospace'],
        body:    ['Exo 2','sans-serif'],
        mono:    ['Share Tech Mono','monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float':      'floatY 5s ease-in-out infinite',
        'spin-slow':  'spinSlow 20s linear infinite',
        'twinkle':    'twinkle 3s ease-in-out infinite',
        'bounce':     'bounce 1s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.3)' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        twinkle: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
}