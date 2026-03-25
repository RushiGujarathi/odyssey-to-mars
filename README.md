# 🚀 Odyssey to Mars — An Interactive Journey Beyond Earth

 An immersive, scroll-based storytelling website that takes users on a cinematic journey from Earth to Mars.

🌐 **Live Demo:** [odyssey-to-mars.vercel.app](https://odyssey-to-mars.vercel.app)  
📁 **GitHub:** [github.com/RushiGujarathi/odyssey-to-mars](https://github.com/RushiGujarathi/odyssey-to-mars)

---

## 📖 About

Odyssey to Mars is built with React 18, GSAP ScrollTrigger, Tailwind CSS, and the Web Audio API. The experience unfolds across six narrative phases — Hero, Launch, Space Travel, Mars Landing, Exploration, and The Future of Humanity.

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| **React 18** (Vite) | UI Framework |
| **GSAP + ScrollTrigger** | All scroll animations |
| **Tailwind CSS** | Styling & dark space theme |
| **Canvas API** | Animated starfield background |
| **Web Audio API** | Synthesized sound effects |
| **Google Fonts** | Orbitron, Exo 2, Share Tech Mono |

---

## 📁 Folder Structure

```
odyssey-to-mars/
├── public/
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx       # Animated loading screen
│   │   ├── Navbar.jsx              # Sticky nav with smooth scroll
│   │   ├── StarField.jsx           # Canvas starfield background
│   │   ├── Hero.jsx                # Earth view + mission stats
│   │   ├── Launch.jsx              # Countdown + rocket launch
│   │   ├── SpaceTravel.jsx         # Parallax planets + telemetry
│   │   ├── MarsLanding.jsx         # EDL sequence + Mars zoom
│   │   ├── Exploration.jsx         # Mars facts + Sol slider + Map
│   │   ├── MarsMap.jsx             # Interactive Mars surface map
│   │   ├── Conclusion.jsx          # Timeline + future of Mars
│   │   ├── Footer.jsx              # Footer
│   │   ├── MarsAIGuide.jsx         # ARIA chatbot
│   │   ├── AchievementSystem.jsx   # Scroll achievement toasts
│   │   ├── ColonyBuilder.jsx       # Build your Mars colony
│   │   ├── CrewSelection.jsx       # Choose your crew role
│   │   ├── MarsIdentityCard.jsx    # Generate Mars ID card
│   │   ├── MarsEnvironmentSim.jsx  # Environment survival sim
│   │   ├── MissionDashboard.jsx    # Active Mars missions
│   │   ├── MissionPathSelector.jsx # Fast vs Exploration route
│   │   ├── MissionProgressBar.jsx  # Scroll progress tracker
│   │   ├── SignalDelay.jsx         # Earth-Mars comms simulator
│   │   ├── SoundEngine.jsx         # Web Audio sound system
│   │   ├── AdaptiveSound.jsx       # Section-based ambient audio
│   │   ├── ScrollColorShift.jsx    # Background color on scroll
│   │   ├── LowGravityLayer.jsx     # Floating element animations
│   │   └── EasterEggs.jsx          # Hidden easter eggs
│   ├── hooks/
│   │   ├── useGSAP.js
│   │   └── useScrollProgress.js
│   ├── utils/
│   │   ├── gsapHelpers.js
│   │   └── starfield.js
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
# 1. Clone the repository
git clone https://github.com/RushiGujarathi/odyssey-to-mars.git

# 2. Navigate to project folder
cd odyssey-to-mars

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev

# 5. Open in browser
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

---

## 🎬 Key Sections & Features

| Section | Features |
|---------|----------|
| **Hero** | Earth visualization, mission stats, staggered title reveal |
| **Launch** | Rocket countdown, liftoff animation, mouse parallax |
| **Space Travel** | Parallax planets, star streaks, live telemetry |
| **Mars Landing** | EDL scroll zoom, Phase III narrative |
| **Exploration** | Mars facts cards, Sol slider, interactive surface map |
| **The Future** | Timeline, crew selection, colony builder, identity card, environment sim, signal delay, ARIA chatbot |

---

## 🎮 Interactive Features

- 🗺️ **Mars Surface Map** — 6 clickable locations with facts
- 🌅 **Sol Day Slider** — Simulate Martian time of day
- 👨‍🚀 **Crew Selection** — Choose your mission role
- 🏗️ **Colony Builder** — Pick habitat, rover & energy source
- 📡 **Signal Delay Simulator** — Real Earth-Mars comms lag
- 🪪 **Mars Identity Card** — Generate & download your Mars ID
- 🌡️ **Environment Simulator** — Survival conditions on Mars
- 🤖 **ARIA Chatbot** — AI-powered Mars guide
- 🏆 **Achievement System** — Scroll-triggered unlocks
- 🥚 **Easter Eggs** — Konami code + hidden secrets

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0b0f1a` |
| Navy | `#0d1b2a` |
| Neon Blue | `#00d4ff` |
| Neon Purple | `#8b5cf6` |
| Mars Orange | `#e8692a` |
| Mars Red | `#c1440e` |
| Display Font | Orbitron |
| Body Font | Exo 2 |
| Mono Font | Share Tech Mono |

---

## 🏆 Judging Criteria Coverage

| Criteria | Weight | Implementation |
|----------|--------|----------------|
| Creativity & Storytelling | 30% | 6-phase Mars narrative, path selector, ARIA guide |
| Visual Design | 25% | Custom design system, space-to-Mars color shift |
| Animation & Interactivity | 20% | GSAP ScrollTrigger, 10+ interactive components |
| Responsiveness | 15% | Tailwind responsive grid, mobile nav |
| Code Quality | 10% | Component architecture, GSAP cleanup, hooks |

---

## 📝 Project Description

Odyssey to Mars is an immersive, scroll-based storytelling website that takes users on a cinematic journey from Earth to Mars. Built with React 18, GSAP ScrollTrigger, Tailwind CSS, and the Web Audio API, the experience unfolds across six narrative phases — Hero, Launch, Space Travel, Mars Landing, Exploration, and The Future of Humanity.

The site features a dynamic loading screen, animated starfield canvas, rocket launch countdown, parallax planet animations, and a Mars EDL sequence with scroll-triggered animations. Interactive elements include a clickable Mars Surface Map, Sol Day sky simulator, crew role selection, colony builder, signal delay communicator, Mars identity card generator, environment survival simulator, and ARIA — an AI-powered Mars guide chatbot.

The design system uses Orbitron, Exo 2, and Share Tech Mono fonts with a space-to-Mars color gradient that dynamically shifts as users scroll. All animations are GSAP-powered with proper React cleanup. Audio is fully synthesized via Web Audio API — no external sound files needed.

Additional features include a scroll-driven mission progress bar, achievement unlock system, hidden Easter eggs, adaptive ambient sound, and a mission path selector that shapes the opening experience.

---

Built with ❤️ for the stars · © 2047 Odyssey Mars Mission MRX-001  
**Developed by Rushi Gujarathi**
