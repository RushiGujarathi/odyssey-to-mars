import React, { useEffect } from 'react'

// Shifts background tint from blue-space to red-mars as user scrolls
export default function ScrollColorShift() {
  useEffect(() => {
    const body = document.body
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1))
      // Blend bg from pure #0b0f1a (blue-dark) toward #130a08 (mars-dark)
      const r = Math.round(11  + p * 10)
      const g = Math.round(15  - p * 8)
      const b = Math.round(26  - p * 18)
      body.style.backgroundColor = `rgb(${r},${g},${b})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); body.style.backgroundColor = '' }
  }, [])
  return null
}