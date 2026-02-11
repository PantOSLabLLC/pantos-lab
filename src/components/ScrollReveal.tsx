import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Direction = 'left' | 'right'

interface ScrollRevealBlockProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  className?: string
}

/** Block that slides in from left or right on scroll */
export function ScrollRevealBlock({
  children,
  direction = 'left',
  delay = 0,
  className = '',
}: ScrollRevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.1, once: true })

  const x = direction === 'left' ? -80 : 80

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimationFrom {
  x?: number
  y?: number
}

interface SequentialRevealProps {
  /** Chart/visual block */
  primary: React.ReactNode
  /** Text content - can be ReactNode or (inView) => ReactNode for staggered */
  secondary: React.ReactNode | ((inView: boolean) => React.ReactNode)
  /** Chart on left or right */
  primarySide?: 'left' | 'right'
  /** Layout offset: left, right, or center */
  layout?: 'left' | 'right' | 'center'
  /** Custom entry animation for primary (chart) */
  primaryFrom?: AnimationFrom
  /** Custom entry animation for secondary (text) */
  secondaryFrom?: AnimationFrom
  className?: string
}

const LAYOUT_OFFSETS = {
  left: 'lg:ml-[2%] lg:mr-[14%]',
  right: 'lg:ml-[24%] lg:mr-[2%]',
  center: 'lg:mx-auto',
}

/** Chart appears first, then content with staggered animation */
export function SequentialReveal({
  primary,
  secondary,
  primarySide = 'left',
  layout = 'center',
  primaryFrom,
  secondaryFrom,
  className = '',
}: SequentialRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { amount: 0.15, once: true })

  const defaultPrimaryFrom = { x: 0, y: 40 }
  const defaultSecondaryFrom = { x: primarySide === 'left' ? 48 : -48, y: 0 }

  const pFrom = { ...defaultPrimaryFrom, ...primaryFrom }
  const sFrom = { ...defaultSecondaryFrom, ...secondaryFrom }

  const gridOrder = primarySide === 'left' ? '' : 'md:grid-flow-dense'
  const colOrder = primarySide === 'left' ? '' : 'md:col-start-2'

  return (
    <div
      ref={sectionRef}
      className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl ${LAYOUT_OFFSETS[layout]} ${gridOrder} ${className}`}
    >
      <motion.div
        className={colOrder}
        initial={{ opacity: 0, x: pFrom.x, y: pFrom.y }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: pFrom.x, y: pFrom.y }}
        transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {primary}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: sFrom.x, y: sFrom.y }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: sFrom.x, y: sFrom.y }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {typeof secondary === 'function' ? secondary(inView) : secondary}
      </motion.div>
    </div>
  )
}

/** Staggered reveal: tag → title → body */
export function StaggeredContent({
  tag,
  title,
  children,
  inView,
}: {
  tag: React.ReactNode
  title: React.ReactNode
  children: React.ReactNode
  inView: boolean
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {tag}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
