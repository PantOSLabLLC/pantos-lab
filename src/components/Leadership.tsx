import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function Leadership() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.1, once: false })

  return (
    <section id="leadership" ref={ref} className="min-h-[75vh] flex items-center py-20 px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-2xl mx-auto text-center lg:mr-auto lg:ml-[12%]"
      >
        <div className="panel p-12 lg:p-16 rounded-2xl">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00d4aa] mb-6 block">
            Leadership
          </span>
          <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-tight text-white mb-3">
            Fedor Naumov
          </h2>
          <p className="text-xl text-white/70 mb-6">Chief Executive Officer</p>
          <p className="text-white/60 text-lg leading-relaxed">
            Extensive experience in quantitative finance, macro strategy, and institutional advisory. Background in systematic trading, derivatives modeling, and risk management across global markets.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
