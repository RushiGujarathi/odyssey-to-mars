import React, { useEffect, useRef, useMemo } from 'react'

// Generates a canvas-based animated star field that serves as global background
export default function StarField() {
  const canvasRef = useRef(null)

  const stars = useMemo(() => {
    return Array.from({ length: 300 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 3 + 2,
      twinkleDelay: Math.random() * 3,
      color: i % 20 === 0 ? '#00d4ff' : i % 15 === 0 ? '#8b5cf6' : '#ffffff',
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animFrame
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      stars.forEach(star => {
        const twinkle = Math.sin((time + star.twinkleDelay) * star.twinkleSpeed) * 0.4 + 0.6
        const opacity = star.opacity * twinkle

        ctx.beginPath()
        ctx.arc(
          (star.x / 100) * canvas.width,
          (star.y / 100) * canvas.height,
          star.size,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = star.color + Math.round(opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(
            (star.x / 100) * canvas.width,
            (star.y / 100) * canvas.height,
            star.size * 3,
            0,
            Math.PI * 2
          )
          const grd = ctx.createRadialGradient(
            (star.x / 100) * canvas.width,
            (star.y / 100) * canvas.height,
            0,
            (star.x / 100) * canvas.width,
            (star.y / 100) * canvas.height,
            star.size * 3
          )
          grd.addColorStop(0, star.color + '44')
          grd.addColorStop(1, 'transparent')
          ctx.fillStyle = grd
          ctx.fill()
        }
      })

      animFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrame)
    }
  }, [stars])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}
