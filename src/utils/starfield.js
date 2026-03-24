/**
 * Starfield — draws animated stars on a <canvas>.
 * Returns a cleanup function.
 */
export function initStarfield(canvas) {
  const ctx = canvas.getContext('2d')
  let animId
  let stars = []
  const STAR_COUNT = 300

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }))
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(s => {
      // Twinkle
      s.alpha += s.twinkleSpeed * s.twinkleDir
      if (s.alpha >= 1 || s.alpha <= 0.1) s.twinkleDir *= -1

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200,220,255,${s.alpha})`
      ctx.fill()
    })
    animId = requestAnimationFrame(draw)
  }

  resize()
  createStars()
  draw()
  window.addEventListener('resize', () => { resize(); createStars() })

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  }
}
