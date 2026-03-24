import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollAnimation — wraps GSAP fromTo with ScrollTrigger.
 * Returns a ref to attach to the target element.
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y: options.y ?? 60, scale: options.scale ?? 1, ...options.from },
        {
          opacity: 1, y: 0, scale: options.scale ?? 1, ...options.to,
          duration: options.duration ?? 1,
          ease: options.ease ?? 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none reverse',
            ...options.scrollTrigger,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])
  return ref
}

export { gsap, ScrollTrigger }
