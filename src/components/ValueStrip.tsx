import { motion } from 'framer-motion'

const keywords = [
  'Strategies',
  'Software',
  'Automation',
  'Testing',
  'Real Trading',
]

export function ValueStrip() {
  return (
    <section className="py-12 lg:py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="flex gap-12 lg:gap-20 items-center justify-center flex-wrap px-8"
      >
        {keywords.map((k, i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.1 }}
            className="font-mono text-sm lg:text-base tracking-[0.15em] uppercase text-white/35 hover:text-[#00d4aa]/80 transition-colors duration-300"
          >
            {k}
          </motion.span>
        ))}
      </motion.div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-2xl mx-auto mt-8" />
    </section>
  )
}
