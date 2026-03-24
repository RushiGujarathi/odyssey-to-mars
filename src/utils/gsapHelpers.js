import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Utility: create a scroll-triggered fade-in for a set of elements
export function createFadeInOnScroll(trigger, targets, options = {}) {
  return ScrollTrigger.create({
    trigger,
    start: options.start || 'top 75%',
    onEnter: () => {
      gsap.fromTo(
        targets,
        { y: options.y || 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: options.stagger || 0.1,
          duration: options.duration || 0.8,
          ease: options.ease || 'power3.out',
        }
      )
    },
    once: options.once !== false,
  })
}

// Utility: parallax element relative to scroll
export function createParallax(element, speed = 0.5, trigger) {
  return ScrollTrigger.create({
    trigger: trigger || element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(element, { y: self.progress * 100 * speed * -1 })
    },
  })
}

// Utility: pin-based scroll animation
export function createScrollScrub(trigger, targets, fromVars, toVars) {
  return gsap.fromTo(targets, fromVars, {
    ...toVars,
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  })
}
