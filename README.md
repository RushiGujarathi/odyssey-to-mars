# 🚀 Odyssey to Mars — Interactive Journey Website

An Awwwards-level, scroll-based storytelling website simulating a cinematic journey from Earth to Mars.

---

## 🛠 Tech Stack
- **React 18** (Vite)
- **Tailwind CSS** — dark space theme
- **GSAP + ScrollTrigger** — all scroll animations
- **Canvas API** — animated star field
- **Google Fonts** — Orbitron, Exo 2, Share Tech Mono

---

## 📁 Folder Structure

```
odyssey-to-mars/
├── public/
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx   # Animated loading screen with progress
│   │   ├── Navbar.jsx          # Sticky nav with smooth scroll
│   │   ├── StarField.jsx       # Canvas star field (global background)
│   │   ├── Hero.jsx            # Earth view + mission stats
│   │   ├── Launch.jsx          # Countdown + rocket launch animation
│   │   ├── SpaceTravel.jsx     # Parallax planets + live telemetry
│   │   ├── MarsLanding.jsx     # EDL zoom sequence (sticky scroll)
│   │   ├── Exploration.jsx     # Rover + clickable Mars facts cards
│   │   ├── Conclusion.jsx      # Timeline + future of Mars
│   │   └── Footer.jsx
│   ├── hooks/
│   │   └── useScrollProgress.js
│   ├── utils/
│   │   └── gsapHelpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚡ Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — select Vite framework preset
# Your site will be live at https://your-project.vercel.app
```

## 🌐 Deploy to Netlify

```bash
# Build the project
npm run build

# Option A: Drag-drop the /dist folder at netlify.com/drop

# Option B: CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🎬 Key Animations

| Component | Animation | Tech |
|-----------|-----------|------|
| LoadingScreen | Progress bar + rocket float | GSAP |
| StarField | 300 twinkling stars with glow | Canvas API |
| Hero | Staggered title reveal + Earth rotation | GSAP timeline |
| Launch | Countdown + rocket liftoff | GSAP + state |
| SpaceTravel | Parallax planets, star streaks | GSAP ScrollTrigger scrub |
| MarsLanding | Mars zoom-in EDL sequence | Sticky scroll + GSAP |
| Exploration | Rover scroll drive + card expand | GSAP + React state |
| Conclusion | Staggered timeline reveal | GSAP ScrollTrigger |

---

## 🔊 Sound Effect Suggestions

Add these with the Howler.js library (`npm install howler`):

| Moment | Sound |
|--------|-------|
| Page load complete | Short sci-fi chime |
| Launch button click | Rocket ignition rumble |
| Countdown | Beep every second |
| Liftoff | Engine roar + whoosh |
| Mars landing | Thud + atmospheric wind |
| Card click | Soft UI click |

---

## ⚡ Performance Tips

1. **Lazy-load sections** — use `React.lazy()` + `Suspense` for below-fold components
2. **Kill ScrollTriggers** on unmount (already implemented in each component)
3. **Canvas star field** — requestAnimationFrame with `cancelAnimationFrame` cleanup
4. **GSAP.context()** — wrap animations in GSAP context for React 18 cleanup
5. **Image optimization** — use WebP format if adding Mars surface photos
6. **Preload fonts** — already handled in `index.html` with `<link rel="preconnect">`
7. **will-change: transform** — Tailwind's `transform` class handles this
8. **Reduce motion** — respect `prefers-reduced-motion` for accessibility:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0b0f1a` |
| Navy | `#0d1b2a` |
| Neon Blue | `#00d4ff` |
| Neon Purple | `#8b5cf6` |
| Neon Red | `#ff4444` |
| Mars Orange | `#e8692a` |
| Mars Red | `#c1440e` |
| Display Font | Orbitron |
| Body Font | Exo 2 |
| Mono Font | Share Tech Mono |

---

Built with ❤️ for the stars. © 2047 Odyssey Mars Mission MRX-001
