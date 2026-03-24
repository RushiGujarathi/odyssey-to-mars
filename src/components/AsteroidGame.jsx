import React, { useEffect, useRef, useState } from 'react'

const W = 460, H = 520
function rand(a, b) { return a + Math.random() * (b - a) }

function drawRR(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default function AsteroidGame() {
  const canvasRef  = useRef(null)
  const stateRef   = useRef(null)
  const rafRef     = useRef(null)
  const keysRef    = useRef(new Set())
  const phaseRef   = useRef('idle')
  const hiRef      = useRef(0)
  // Mars journey animation state
  const marsJourneyRef = useRef(null)
  const [phase, setPhase] = useState('idle')
  const [score, setScore] = useState(0)
  const [hi,    setHi]    = useState(0)
  const [marsProgress, setMarsProgress] = useState(0)

  function mkState() {
    return {
      rocket: { x: W / 2, y: 70, vx: 0, vy: 0, fuel: 100 },
      asteroids: [],
      stars: Array.from({ length: 120 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.3, 1.8), tw: rand(0, 10),
        color: Math.random() > 0.92 ? '#00d4ff' : Math.random() > 0.88 ? '#8b5cf6' : '#ffffff'
      })),
      pad: { x: rand(50, W - 150), w: 100 },
      frame: 0,
    }
  }

  function mkRock() {
    const left = Math.random() < 0.5
    return {
      x: left ? -28 : W + 28, y: rand(40, H - 160),
      r: rand(10, 22),
      vx: left ? rand(1.0, 3.2) : rand(-3.2, -1.0),
      vy: rand(-0.3, 1.0),
      spin: rand(-0.04, 0.04), a: rand(0, Math.PI * 2),
    }
  }

  // ── MARS JOURNEY animation after landing ──
  function startMarsJourney(finalScore) {
    cancelAnimationFrame(rafRef.current)
    phaseRef.current = 'mars_journey'
    setPhase('mars_journey')
    setScore(finalScore)
    if (finalScore > hiRef.current) { hiRef.current = finalScore; setHi(finalScore) }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Journey state
    const journey = {
      // Rocket starts at pad position (center-ish, bottom)
      rx: W / 2, ry: H - 60,
      // Target: Mars (top right area)
      targetX: W * 0.78, targetY: H * 0.15,
      // Mars planet
      marsR: 0, marsMaxR: 48,
      // Stars that streak by (warp effect)
      streaks: Array.from({ length: 60 }, () => ({
        x: rand(0, W), y: rand(0, H),
        len: rand(8, 35), speed: rand(2.5, 6),
        alpha: rand(0.2, 0.8),
        color: Math.random() > 0.85 ? '#00d4ff' : '#ffffff'
      })),
      // Background stars
      bgStars: Array.from({ length: 80 }, () => ({
        x: rand(0, W), y: rand(0, H), r: rand(0.3, 1.5), tw: rand(0, 10)
      })),
      // Particles trail
      particles: [],
      frame: 0,
      totalFrames: 220,
      arrived: false,
      // Nebula clouds
      nebulae: [
        { x: W * 0.2, y: H * 0.3, r: 90, color: 'rgba(139,92,246,0.08)' },
        { x: W * 0.75, y: H * 0.6, r: 70, color: 'rgba(0,212,255,0.06)' },
        { x: W * 0.5,  y: H * 0.5, r: 120, color: 'rgba(193,68,14,0.05)' },
      ]
    }
    marsJourneyRef.current = journey

    const drawJourney = () => {
      if (phaseRef.current !== 'mars_journey') return
      const j = marsJourneyRef.current
      j.frame++
      const progress = Math.min(j.frame / j.totalFrames, 1)
      setMarsProgress(progress)

      // Ease-in-out progress for rocket movement
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      // Rocket follows a curved arc (bezier-like path)
      const cp1x = W * 0.3, cp1y = H * 0.8  // control point 1
      const cp2x = W * 0.9, cp2y = H * 0.4  // control point 2
      const startX = W / 2, startY = H - 60
      const endX = j.targetX, endY = j.targetY

      // Cubic bezier
      const t = eased
      j.rx = Math.pow(1-t,3)*startX + 3*Math.pow(1-t,2)*t*cp1x + 3*(1-t)*t*t*cp2x + t*t*t*endX
      j.ry = Math.pow(1-t,3)*startY + 3*Math.pow(1-t,2)*t*cp1y + 3*(1-t)*t*t*cp2y + t*t*t*endY

      // Rocket angle (tangent of bezier)
      const dt = 0.01
      const t2 = Math.min(t + dt, 1)
      const nx = Math.pow(1-t2,3)*startX + 3*Math.pow(1-t2,2)*t2*cp1x + 3*(1-t2)*t2*t2*cp2x + t2*t2*t2*endX
      const ny = Math.pow(1-t2,3)*startY + 3*Math.pow(1-t2,2)*t2*cp1y + 3*(1-t2)*t2*t2*cp2y + t2*t2*t2*endY
      const angle = Math.atan2(ny - j.ry, nx - j.rx) + Math.PI / 2

      // Mars grows as we approach
      j.marsR = Math.min(j.marsMaxR, progress * j.marsMaxR * 1.8)

      // Add trail particles
      if (j.frame % 3 === 0) {
        j.particles.push({
          x: j.rx, y: j.ry,
          vx: rand(-0.5, 0.5), vy: rand(0.5, 1.5),
          life: 1, maxLife: 30 + Math.random() * 20,
          r: rand(1.5, 3.5),
          color: Math.random() > 0.5 ? '#ff6b35' : '#00d4ff'
        })
      }
      j.particles = j.particles.filter(p => p.life > 0)
      j.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        p.life -= 1 / p.maxLife
        p.vy += 0.04
      })

      // Move streak stars upward (warp effect)
      const warpSpeed = 3 + progress * 5
      j.streaks.forEach(s => {
        s.y += s.speed * (warpSpeed / 4)
        if (s.y > H + 40) { s.y = rand(-40, 0); s.x = rand(0, W); s.len = rand(8, 35) }
      })

      // ── DRAW ──
      ctx.fillStyle = '#06080f'
      ctx.fillRect(0, 0, W, H)

      // Nebulae
      j.nebulae.forEach(n => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        grad.addColorStop(0, n.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      })

      // Background stars (twinkling)
      j.bgStars.forEach(st => {
        st.tw += 0.03
        const alpha = 0.25 + Math.sin(st.tw) * 0.25
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`; ctx.fill()
      })

      // Warp streaks (moving stars)
      j.streaks.forEach(s => {
        const speed = warpSpeed
        ctx.beginPath()
        ctx.moveTo(s.x, s.y - s.len * speed * 0.18)
        ctx.lineTo(s.x, s.y + s.len * 0.3)
        const alpha = s.alpha * Math.min(1, progress * 3)
        ctx.strokeStyle = `${s.color.replace(')', `,${alpha})`).replace('rgb', 'rgba').replace('#ffffff', 'rgba(255,255,255,')}`
        // simpler:
        ctx.strokeStyle = s.color === '#00d4ff'
          ? `rgba(0,212,255,${alpha * 0.7})`
          : `rgba(255,255,255,${alpha * 0.5})`
        ctx.lineWidth = 0.8 + progress * 0.6
        ctx.stroke()
      })

      // Mars planet (growing, top right)
      if (j.marsR > 2) {
        const mx = j.targetX, my = j.targetY

        // Mars atmosphere glow
        const atmGrad = ctx.createRadialGradient(mx, my, j.marsR * 0.7, mx, my, j.marsR * 1.8)
        atmGrad.addColorStop(0, 'rgba(193,68,14,0.25)')
        atmGrad.addColorStop(0.5, 'rgba(232,105,42,0.08)')
        atmGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = atmGrad; ctx.beginPath(); ctx.arc(mx, my, j.marsR * 1.8, 0, Math.PI * 2); ctx.fill()

        // Mars surface
        const marsGrad = ctx.createRadialGradient(mx - j.marsR * 0.3, my - j.marsR * 0.3, 0, mx, my, j.marsR)
        marsGrad.addColorStop(0, '#e8692a')
        marsGrad.addColorStop(0.4, '#c1440e')
        marsGrad.addColorStop(0.75, '#8b2e06')
        marsGrad.addColorStop(1, '#3a0e00')
        ctx.fillStyle = marsGrad
        ctx.beginPath(); ctx.arc(mx, my, j.marsR, 0, Math.PI * 2); ctx.fill()

        // Mars highlight
        ctx.fillStyle = 'rgba(255,255,255,0.07)'
        ctx.beginPath(); ctx.arc(mx - j.marsR * 0.25, my - j.marsR * 0.25, j.marsR * 0.45, 0, Math.PI * 2); ctx.fill()

        // Mars polar cap
        ctx.fillStyle = 'rgba(255,255,255,0.15)'
        ctx.beginPath(); ctx.ellipse(mx, my - j.marsR * 0.7, j.marsR * 0.3, j.marsR * 0.12, 0, 0, Math.PI * 2); ctx.fill()

        // Mars label
        if (j.marsR > 20) {
          const labelAlpha = Math.min(1, (j.marsR - 20) / 20)
          ctx.fillStyle = `rgba(232,105,42,${labelAlpha})`
          ctx.font = 'bold 9px monospace'
          ctx.textAlign = 'center'
          ctx.fillText('MARS', mx, my + j.marsR + 14)
        }
      }

      // Particle trail
      j.particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color === '#ff6b35'
          ? `rgba(255,107,53,${p.life * 0.7})`
          : `rgba(0,212,255,${p.life * 0.5})`
        ctx.fill()
      })

      // Rocket (oriented along flight path)
      ctx.save()
      ctx.translate(j.rx, j.ry)
      ctx.rotate(angle)

      // Flame
      const fl = 14 + Math.random() * 10 + progress * 8
      const fg = ctx.createLinearGradient(0, 14, 0, 14 + fl)
      fg.addColorStop(0, 'rgba(255,255,255,0.95)')
      fg.addColorStop(0.2, 'rgba(0,212,255,0.9)')
      fg.addColorStop(0.6, 'rgba(255,107,53,0.8)')
      fg.addColorStop(1, 'rgba(255,107,53,0)')
      ctx.beginPath(); ctx.moveTo(-5, 15); ctx.lineTo(0, 15 + fl); ctx.lineTo(5, 15)
      ctx.fillStyle = fg; ctx.fill()

      // Rocket body
      const bg = ctx.createLinearGradient(-9, -20, 9, -20)
      bg.addColorStop(0, '#7a8d99'); bg.addColorStop(0.5, '#d8e3ea'); bg.addColorStop(1, '#7a8d99')
      ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(-9, -15, -9, 7, -7, 16); ctx.lineTo(7, 16); ctx.bezierCurveTo(9, 7, 9, -15, 0, -21)
      ctx.fillStyle = bg; ctx.fill()
      ctx.fillStyle = 'rgba(0,212,255,0.45)'; ctx.fillRect(-7, 3, 14, 3)
      ctx.beginPath(); ctx.arc(0, -7, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,212,255,0.35)'; ctx.fill()
      ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.2; ctx.stroke()
      ctx.fillStyle = '#3d4e5c'
      ctx.beginPath(); ctx.moveTo(-7, 11); ctx.lineTo(-14, 18); ctx.lineTo(-7, 14); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(7, 11); ctx.lineTo(14, 18); ctx.lineTo(7, 14); ctx.closePath(); ctx.fill()
      ctx.restore()

      // Progress text overlay
      const distPct = Math.round(progress * 100)
      ctx.fillStyle = 'rgba(0,212,255,0.6)'
      ctx.font = 'bold 9px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`EN ROUTE TO MARS — ${distPct}%`, 10, H - 14)

      // Arrival flash
      if (progress >= 1 && !j.arrived) {
        j.arrived = true
        cancelAnimationFrame(rafRef.current)
        // Flash white then show landed screen
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillRect(0, 0, W, H)
        setTimeout(() => {
          phaseRef.current = 'landed'
          setPhase('landed')
        }, 400)
        return
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(drawJourney)
      }
    }

    rafRef.current = requestAnimationFrame(drawJourney)
  }

  function endGame(result, t) {
    if (result === 'landed') {
      // Trigger the Mars journey instead of immediately showing overlay
      startMarsJourney(t)
    } else {
      cancelAnimationFrame(rafRef.current)
      phaseRef.current = result
      setScore(t)
      if (t > hiRef.current) { hiRef.current = t; setHi(t) }
      setPhase(result)
    }
  }

  function gameLoop() {
    const canvas = canvasRef.current
    if (!canvas || phaseRef.current !== 'playing') return
    const ctx = canvas.getContext('2d')
    const s   = stateRef.current
    if (!s) return

    s.frame++
    const keys   = keysRef.current
    const thrust = keys.has('ArrowUp') || keys.has('w') || keys.has('W')
    const left   = keys.has('ArrowLeft') || keys.has('a') || keys.has('A')
    const right  = keys.has('ArrowRight') || keys.has('d') || keys.has('D')

    if (left  && s.rocket.vx > -3.5) s.rocket.vx -= 0.18
    if (right && s.rocket.vx < 3.5)  s.rocket.vx += 0.18
    if (thrust && s.rocket.fuel > 0) { s.rocket.vy -= 0.28; s.rocket.fuel = Math.max(0, s.rocket.fuel - 0.45) }
    s.rocket.vy += 0.09
    s.rocket.vx *= 0.975
    s.rocket.vy  = Math.min(s.rocket.vy, 7)
    s.rocket.x  += s.rocket.vx
    s.rocket.y  += s.rocket.vy
    s.rocket.x   = Math.max(14, Math.min(W - 14, s.rocket.x))

    const rate = Math.max(22, 85 - Math.floor(s.frame / 80))
    if (s.frame % rate === 0) s.asteroids.push(mkRock())
    s.asteroids = s.asteroids.filter(a => a.x > -55 && a.x < W + 55)
    s.asteroids.forEach(a => { a.x += a.vx; a.y += a.vy; a.a += a.spin })

    // Collision
    for (const a of s.asteroids) {
      const dx = s.rocket.x - a.x, dy = s.rocket.y - a.y
      if (Math.sqrt(dx * dx + dy * dy) < a.r + 10) { endGame('dead', Math.floor(s.frame / 60)); return }
    }

    // Ground
    if (s.rocket.y >= H - 46) {
      const onPad = s.rocket.x > s.pad.x + 8 && s.rocket.x < s.pad.x + s.pad.w - 8
      const soft  = Math.abs(s.rocket.vx) < 2.2 && s.rocket.vy < 3.8
      endGame(onPad && soft ? 'landed' : 'dead', Math.floor(s.frame / 60) + (onPad && soft ? 50 : 0))
      return
    }

    // ── DRAW ──
    const t = s.frame * 0.016
    ctx.fillStyle = '#07090f'; ctx.fillRect(0, 0, W, H)

    // Nebula
    const n1 = ctx.createRadialGradient(W * 0.25, H * 0.3, 0, W * 0.25, H * 0.3, 180)
    n1.addColorStop(0, 'rgba(55,18,95,0.18)'); n1.addColorStop(1, 'transparent')
    ctx.fillStyle = n1; ctx.fillRect(0, 0, W, H)
    const n2 = ctx.createRadialGradient(W * 0.75, H * 0.6, 0, W * 0.75, H * 0.6, 140)
    n2.addColorStop(0, 'rgba(0,70,130,0.14)'); n2.addColorStop(1, 'transparent')
    ctx.fillStyle = n2; ctx.fillRect(0, 0, W, H)

    s.stars.forEach(st => {
      const op = 0.3 + Math.sin(t + st.tw) * 0.28
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
      ctx.fillStyle = st.color === '#ffffff'
        ? `rgba(255,255,255,${op.toFixed(2)})`
        : st.color === '#00d4ff'
        ? `rgba(0,212,255,${(op * 0.8).toFixed(2)})`
        : `rgba(139,92,246,${(op * 0.7).toFixed(2)})`
      ctx.fill()
    })

    // Mars surface
    const surf = ctx.createLinearGradient(0, H - 50, 0, H)
    surf.addColorStop(0, '#9e3208'); surf.addColorStop(1, '#2e0800')
    ctx.fillStyle = surf; ctx.beginPath(); ctx.moveTo(0, H - 42)
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, H - 42 + Math.sin(x * 0.055 + 0.8) * 6)
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill()

    [[35, H - 40, 7], [110, H - 38, 4], [250, H - 41, 6], [360, H - 39, 8], [430, H - 40, 4]].forEach(([rx, ry, rr]) => {
      ctx.beginPath(); ctx.ellipse(rx, ry, rr, rr * 0.55, 0, 0, Math.PI * 2); ctx.fillStyle = '#6b2000'; ctx.fill()
    })

    // Landing pad
    const { x: px, w: pw } = s.pad, py = H - 46
    const pg = ctx.createRadialGradient(px + pw / 2, py + 2, 0, px + pw / 2, py + 2, pw)
    pg.addColorStop(0, 'rgba(0,212,255,0.22)'); pg.addColorStop(1, 'transparent')
    ctx.fillStyle = pg; ctx.fillRect(px - 15, py - 18, pw + 30, 30)
    ctx.fillStyle = '#002d3d'; ctx.fillRect(px, py, pw, 7)
    ctx.fillStyle = '#00d4ff'; ctx.fillRect(px, py, pw, 3)
    const blink = s.frame % 36 < 18
    [[px, py], [px + pw, py]].forEach(([lx, ly]) => {
      ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2)
      ctx.fillStyle = blink ? '#00d4ff' : 'rgba(0,212,255,0.2)'; ctx.fill()
    })
    ctx.fillStyle = 'rgba(0,212,255,0.75)'; ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'; ctx.fillText('LAND HERE', px + pw / 2, py - 5)

    // Asteroids
    s.asteroids.forEach(a => {
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.a)
      ctx.beginPath()
      for (let i = 0; i < 9; i++) {
        const ang = (i / 9) * Math.PI * 2, r = a.r * (0.70 + Math.sin(ang * 2.3 + a.a * 1.5) * 0.30)
        i === 0 ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r)
      }
      ctx.closePath()
      const rg = ctx.createRadialGradient(-a.r * 0.25, -a.r * 0.25, 0, 0, 0, a.r)
      rg.addColorStop(0, '#c49a3a'); rg.addColorStop(0.5, '#7a5018'); rg.addColorStop(1, '#2e1800')
      ctx.fillStyle = rg; ctx.fill(); ctx.strokeStyle = 'rgba(240,180,60,0.3)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.beginPath(); ctx.arc(-a.r * 0.28, -a.r * 0.18, a.r * 0.14, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill()
      ctx.restore()
    })

    // Rocket
    const { x: rx, y: ry } = s.rocket
    ctx.save(); ctx.translate(rx, ry)
    if (thrust && s.rocket.fuel > 0) {
      const fl = 16 + Math.random() * 12
      const fg = ctx.createLinearGradient(0, 14, 0, 14 + fl)
      fg.addColorStop(0, 'rgba(255,255,255,0.9)'); fg.addColorStop(0.2, 'rgba(0,212,255,0.9)')
      fg.addColorStop(0.65, 'rgba(255,107,53,0.8)'); fg.addColorStop(1, 'rgba(255,107,53,0)')
      ctx.beginPath(); ctx.moveTo(-5, 15); ctx.lineTo(0, 15 + fl); ctx.lineTo(5, 15)
      ctx.fillStyle = fg; ctx.fill()
    }
    const bg = ctx.createLinearGradient(-9, -20, 9, -20)
    bg.addColorStop(0, '#7a8d99'); bg.addColorStop(0.5, '#d8e3ea'); bg.addColorStop(1, '#7a8d99')
    ctx.beginPath(); ctx.moveTo(0, -21); ctx.bezierCurveTo(-9, -15, -9, 7, -7, 16); ctx.lineTo(7, 16); ctx.bezierCurveTo(9, 7, 9, -15, 0, -21)
    ctx.fillStyle = bg; ctx.fill()
    ctx.fillStyle = 'rgba(0,212,255,0.45)'; ctx.fillRect(-7, 3, 14, 3)
    ctx.beginPath(); ctx.arc(0, -7, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,212,255,0.30)'; ctx.fill()
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.fillStyle = '#3d4e5c'
    ctx.beginPath(); ctx.moveTo(-7, 11); ctx.lineTo(-14, 18); ctx.lineTo(-7, 14); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(7, 11); ctx.lineTo(14, 18); ctx.lineTo(7, 14); ctx.closePath(); ctx.fill()
    ctx.restore()

    // HUD
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; drawRR(ctx, 10, 12, 88, 10, 3); ctx.fill()
    const fc = s.rocket.fuel > 50 ? '#00d4ff' : s.rocket.fuel > 25 ? '#f0c040' : '#ff4444'
    if (s.rocket.fuel > 0) { ctx.fillStyle = fc; drawRR(ctx, 10, 12, s.rocket.fuel * 0.88, 10, 3); ctx.fill() }
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'left'; ctx.fillText('FUEL', 103, 20)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'right'; ctx.fillText(Math.floor(s.frame / 60) + 's', W - 10, 21)
    if (hiRef.current > 0) { ctx.fillStyle = 'rgba(255,200,50,0.45)'; ctx.font = 'bold 8px monospace'; ctx.fillText('BEST ' + hiRef.current, W - 10, 33) }
    if (s.frame < 200) {
      const alpha = Math.max(0, 0.38 - s.frame / 200 * 0.38)
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`; ctx.font = '8px monospace'; ctx.textAlign = 'center'
      ctx.fillText('← → steer  ↑ thrust  Land on pad!', W / 2, H - 56)
    }

    rafRef.current = requestAnimationFrame(gameLoop)
  }

  function startGame() {
    cancelAnimationFrame(rafRef.current)
    stateRef.current = mkState()
    keysRef.current  = new Set()
    phaseRef.current = 'playing'
    setPhase('playing')
    setScore(0)
    setMarsProgress(0)
    rafRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    const prevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    const dn = e => { if (prevent.includes(e.key)) e.preventDefault(); keysRef.current.add(e.key) }
    const up = e => keysRef.current.delete(e.key)
    window.addEventListener('keydown', dn)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); cancelAnimationFrame(rafRef.current) }
  }, [])

  const tb = (key, on) => { if (on) keysRef.current.add(key); else keysRef.current.delete(key) }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full" style={{ maxWidth: W }}>
        <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-white/10 block w-full" />

        {/* Mars journey progress bar overlay */}
        {phase === 'mars_journey' && (
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-cyan-400/70">🚀 EN ROUTE TO MARS</span>
              <span className="font-mono text-xs text-white/30 ml-auto">{Math.round(marsProgress * 100)}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-none"
                style={{ width: `${marsProgress * 100}%`, background: 'linear-gradient(90deg, #00d4ff, #8b5cf6, #e8692a)' }} />
            </div>
          </div>
        )}

        {/* Overlays for idle / dead / landed */}
        {(phase === 'idle' || phase === 'dead' || phase === 'landed') && (
          <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-5"
            style={{ background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(8px)' }}>

            {phase === 'idle' && <>
              <div className="text-5xl">🚀</div>
              <div className="text-center">
                <h3 className="font-display text-2xl font-black text-white mb-2">LAND ON MARS</h3>
                <p className="font-mono text-xs text-white/40 max-w-xs leading-relaxed">
                  Dodge asteroids · manage fuel · land softly on the blue pad
                </p>
                <p className="font-mono text-xs text-cyan-400/50 mt-2">
                  🌟 Land safely → watch your rocket fly to Mars!
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['← →', 'Steer'], ['↑', 'Thrust'], ['Pad', 'Land']].map(([k, v]) => (
                  <div key={k} className="rounded-lg px-4 py-2 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="font-mono text-sm font-bold text-cyan-400">{k}</div>
                    <div className="font-mono text-xs text-white/30 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </>}

            {phase === 'dead' && <>
              <div className="text-5xl">💥</div>
              <div className="text-center">
                <h3 className="font-display text-xl font-black text-red-400 mb-1">MISSION FAILED</h3>
                <p className="font-mono text-sm text-white/50">Survived <span className="text-white font-bold">{score}s</span></p>
                {hi > 0 && <p className="font-mono text-xs text-yellow-400/60 mt-1">Best: {hi}s</p>}
                <p className="font-mono text-xs text-white/25 mt-2">Land on the pad to journey to Mars!</p>
              </div>
            </>}

            {phase === 'landed' && <>
              <div className="text-5xl">🎉</div>
              <div className="text-center">
                <h3 className="font-display text-xl font-black text-green-400 mb-1">ARRIVED AT MARS!</h3>
                <p className="font-mono text-sm text-white/50">Score <span className="text-green-400 font-bold">{score}</span></p>
                {hi > 0 && <p className="font-mono text-xs text-yellow-400/60 mt-1">Best: {hi}</p>}
                <p className="font-mono text-xs text-orange-400/60 mt-2">🔴 You made it to the Red Planet!</p>
              </div>
            </>}

            <button onClick={startGame}
              className="font-display font-bold text-sm tracking-widest px-10 py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.12),rgba(139,92,246,0.12))', border: '1px solid rgba(0,212,255,0.45)', color: '#00d4ff' }}>
              {phase === 'idle' ? '⚡ START MISSION' : '↺ RETRY'}
            </button>
          </div>
        )}
      </div>

      {phase === 'playing' && (
        <div className="flex items-center gap-3 md:hidden">
          {[['◀', 'ArrowLeft'], ['▲ THRUST', 'ArrowUp'], ['▶', 'ArrowRight']].map(([label, key]) => (
            <button key={key}
              onTouchStart={e => { e.preventDefault(); tb(key, true) }} onTouchEnd={e => { e.preventDefault(); tb(key, false) }}
              onMouseDown={() => tb(key, true)} onMouseUp={() => tb(key, false)} onMouseLeave={() => tb(key, false)}
              className="font-mono text-sm font-bold px-5 py-4 rounded-xl border border-white/15 text-white/60 active:bg-white/10 active:text-white"
              style={{ touchAction: 'none', minWidth: 56 }}>{label}</button>
          ))}
        </div>
      )}

      <p className="font-mono text-xs text-white/20">
        {phase === 'playing' ? 'Arrow keys / WASD to control'
          : phase === 'mars_journey' ? '🚀 Flying through space to Mars…'
          : 'Keyboard + mobile touch supported'}
      </p>
    </div>
  )
}