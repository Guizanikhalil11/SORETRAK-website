import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed')
            if (!options.repeat) {
              observer.unobserve(entry.target)
            }
          } else if (options.repeat) {
            entry.target.classList.remove('scroll-revealed')
          }
        })
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    )

    const children = options.children
      ? element.querySelectorAll(options.children)
      : [element]

    children.forEach((child) => {
      child.classList.add('scroll-reveal')
      observer.observe(child)
    })

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.children, options.repeat])

  return ref
}

export function useStaggerReveal(containerSelector = '.stagger-container') {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = container.querySelectorAll('.stagger-item')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const staggerIndex = entry.target.dataset.staggerIndex || 0
            setTimeout(() => {
              entry.target.classList.add('scroll-revealed')
            }, staggerIndex * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )

    children.forEach((child, index) => {
      child.classList.add('scroll-reveal')
      child.dataset.staggerIndex = index
      observer.observe(child)
    })

    return () => observer.disconnect()
  }, [])

  return ref
}
