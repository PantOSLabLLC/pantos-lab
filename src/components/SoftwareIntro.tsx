import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function SoftwareIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: true })

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed max-w-3xl px-8 lg:px-16 mb-16 mx-auto"
    >
      Currently we develop and test the following software to automate trading:
    </motion.p>
  )
}
