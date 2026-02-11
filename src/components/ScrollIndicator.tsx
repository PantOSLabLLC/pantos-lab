import { motion } from 'framer-motion'

export function ScrollIndicator() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={scrollToAbout}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-8 left-8 lg:left-16 z-30 font-mono text-sm tracking-[0.2em] text-white/60 hover:text-[#00d4aa] transition-colors duration-300 inline-flex items-center gap-4 px-5 py-3 rounded-full panel border border-white/[0.06] hover:border-[#00d4aa]/20 hover:bg-[#00d4aa]/5 group"
    >
      <span className="w-6 h-px bg-white/30 group-hover:bg-[#00d4aa]/50 transition-colors" />
      Scroll to explore
      <motion.span
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-white/50"
      >
        ↓
      </motion.span>
    </motion.button>
  )
}
