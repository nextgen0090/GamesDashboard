import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  disabled?: boolean
}

export function ScrollReveal({ children, className, delay = 0, disabled = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15, margin: '0px 0px -48px 0px' })
  const off =
    disabled ||
    (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('portal-reduced-motion'))

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={off ? false : { opacity: 0, y: 24 }}
      animate={off || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: off ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
