import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen relative px-6 lg:px-10 pt-28 pb-28 overflow-hidden flex items-center"
    >
      {/* Subtle grid - top right */}
      <div
        className="absolute top-0 right-0 w-[min(55vw,640px)] h-[min(55vh,480px)] opacity-[0.04] pointer-events-none"
        aria-hidden
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Top row: Title left, Card right - more balanced */}
        <div className="grid lg:grid-cols-[1fr,1.15fr] lg:gap-20 xl:gap-24 items-start lg:items-center">
          {/* Left: Brand + Title + Subtitle */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              <div className="font-mono text-xl lg:text-2xl xl:text-[1.5rem] tracking-[0.2em] uppercase text-white/90 mb-6">
                Pant<span className="text-2xl lg:text-4xl xl:text-5xl font-bold text-[#00d4aa] tracking-tight align-middle">OS</span> Lab LLC
              </div>
              <p className="text-lg lg:text-xl text-white/55 max-w-[26ch] leading-relaxed">
                Quantitative investment strategies & institutional software
              </p>
            </motion.div>
          </div>

          {/* Right: Statement card - elevated, more prominent */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="mt-14 lg:mt-0"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] shadow-[0_4px_48px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d4aa] via-[#00d4aa]/70 to-[#00d4aa]/20" />
              <p className="pl-8 pr-8 pt-8 pb-8 lg:pl-10 lg:pr-10 lg:pt-10 lg:pb-10 text-lg lg:text-xl xl:text-2xl font-light text-white/85 leading-[1.6]">
                We develop investment strategies and software to automate these strategies, and test
                the effectiveness of strategies and software for real trading.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom row: CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-14 lg:mt-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <motion.button
            type="button"
            onClick={() => scrollTo('software')}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-mono text-[13px] tracking-[0.12em] uppercase bg-[#00d4aa]/12 text-[#00d4aa] border border-[#00d4aa]/25 hover:bg-[#00d4aa]/20 hover:border-[#00d4aa]/40 transition-all duration-300"
          >
            Explore capabilities
            <span className="text-[#00d4aa]/70">→</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => scrollTo('cta')}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-mono text-[13px] tracking-[0.12em] uppercase text-white/70 border border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 hover:text-white/90 transition-all duration-300"
          >
            Request access
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1, ease }}
          className="mt-10 font-mono text-[10px] tracking-[0.2em] text-white/30"
        >
          PantOS Lab LLC · Institutional-grade quantitative research
        </motion.p>
      </div>
    </section>
  )
}
