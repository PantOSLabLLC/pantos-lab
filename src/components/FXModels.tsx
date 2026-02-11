import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function FXModels() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.1 })

  return (
    <section id="fx" ref={ref} className="min-h-[60vh] flex items-center py-20 px-8 lg:px-16">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl"
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00d4aa] mb-6 block">
            FX
          </span>
          <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-tight text-white mb-6">
            Relative Value Models
          </h2>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Nominal vs real exchange rates. Fundamental drivers. Capital flow models.
          </p>
          <div className="panel p-6 rounded-xl">
            <div className="flex justify-between py-4 border-b border-white/[0.06] text-base">
              <span className="text-white/80">G10 Pairs</span>
              <span className="font-mono text-[#00d4aa]">Covered</span>
            </div>
            <div className="flex justify-between py-4 text-base">
              <span className="text-white/80">EM FX</span>
              <span className="font-mono text-[#00d4aa]">Selective</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
