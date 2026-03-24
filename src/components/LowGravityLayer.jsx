import React, { useEffect } from 'react'
import { gsap } from 'gsap'

// Gentle vertical float only — no rotation/x drift (those cause text blur)
export default function LowGravityLayer() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-gravity]')
    const tweens = []
    els.forEach(el => {
      const dist = el.dataset.gravity === 'fast' ? 12 : el.dataset.gravity === 'slow' ? 5 : 8
      const dur  = el.dataset.gravity === 'fast' ? 2.8 : el.dataset.gravity === 'slow' ? 5.5 : 4
      tweens.push(
        gsap.to(el, {
          y: `+=${dist}`,
          duration: dur + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        })
      )
    })
    return () => tweens.forEach(t => t.kill())
  }, [])
  return null
}