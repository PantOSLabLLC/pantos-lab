import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AdvisoryCTA } from './AdvisoryCTA'

const pillars = [
  {
    tag: '01',
    title: 'Management Consulting',
    desc: 'Strategic guidance for investment operations, risk frameworks, and process design.',
  },
  {
    tag: '02',
    title: 'Investment Advisory',
    desc: 'Bespoke advice on portfolio construction, asset allocation, and execution.',
  },
  {
    tag: '03',
    title: 'Education',
    desc: 'Training and development for teams and individuals on quantitative methods.',
  },
]

const clients = [
  'Corporations',
  'Hedge Funds',
  'Private Equity',
  'High Net Worth',
]

const ease = [0.25, 0.46, 0.45, 0.94]

export function AboutPillars() {
  const ref = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15, once: true })
  const pillarsInView = useInView(pillarsRef, { amount: 0.2, once: true })

  return (
    <section id="about" ref={ref} className="px-8 lg:px-16 py-24 lg:py-32 overflow-visible">
      <div className="max-w-6xl mx-auto">
        {/* Intro statement */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.9, ease }}
          className="mb-16 lg:mb-20 max-w-[800px]"
        >
          <div className="group panel relative overflow-hidden rounded-2xl p-8 lg:p-12 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#00d4aa] before:to-[#00d4aa]/30 before:opacity-80 hover:before:opacity-100 before:content-['']">
            <p className="text-lg lg:text-xl xl:text-2xl font-light text-white/80 leading-relaxed">
              We also do management consulting, investment advisory and education for{' '}
              <span className="text-white/90">corporations, hedge funds, private equity funds, and high net worth individuals</span>.
            </p>
          </div>
        </motion.div>

        {/* Institutional Consulting & Education + Institutional Access */}
        <AdvisoryCTA embedded />

        {/* Three pillars - slide in from different sides, staggered */}
        <div ref={pillarsRef} className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20 overflow-visible">
          {pillars.map((p, i) => (
            <PillarCard key={p.tag} pillar={p} index={i} inView={pillarsInView} />
          ))}
        </div>

        {/* Client types - tag strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="flex flex-wrap gap-4 lg:gap-6"
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/40">
            Who we serve
          </span>
          {clients.map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease }}
              className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] font-mono text-sm tracking-wide text-white/70 hover:border-[#00d4aa]/30 hover:text-[#00d4aa]/90 transition-colors duration-300"
            >
              {c}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const ENTRY_DIRECTIONS = [
  { x: -200, y: 0 },      // Block 0: from left
  { x: 0, y: 100 },       // Block 1: from bottom
  { x: 200, y: 0 },       // Block 2: from right
]

const smoothEase = [0.22, 1, 0.36, 1]

const STAGGER_DELAY = 0.45

function PillarCard({ pillar, index, inView }: { pillar: (typeof pillars)[0]; index: number; inView: boolean }) {
  const dir = ENTRY_DIRECTIONS[index] ?? { x: 0, y: 48 }
  const cardDelay = index * STAGGER_DELAY

  return (
    <motion.div
      initial={{ opacity: 0, x: dir.x, y: dir.y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: dir.x, y: dir.y }}
      transition={{ duration: 1.2, delay: cardDelay, ease: smoothEase }}
      className="panel rounded-2xl p-8 lg:p-10 group hover:border-[#00d4aa]/15 transition-colors duration-500"
    >
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.7, delay: cardDelay + 0.3, ease: smoothEase }}
        className="font-mono text-xs tracking-[0.2em] text-[#00d4aa] mb-6 block"
      >
        {pillar.tag}
      </motion.span>
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.7, delay: cardDelay + 0.45, ease: smoothEase }}
        className="font-heading text-xl lg:text-2xl font-medium text-white mb-4 group-hover:text-[#00d4aa] transition-colors duration-300"
      >
        {pillar.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.7, delay: cardDelay + 0.6, ease: smoothEase }}
        className="text-white/60 leading-relaxed"
      >
        {pillar.desc}
      </motion.p>
    </motion.div>
  )
}
