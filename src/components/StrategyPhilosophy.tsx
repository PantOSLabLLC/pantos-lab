import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const panels = [
  {
    tag: '01',
    title: 'Systematic Alpha Generation',
    text: 'Rigorous quantitative frameworks designed to capture risk-adjusted returns across regimes. Signal generation, portfolio construction, and execution optimised for institutional scale.',
  },
  {
    tag: '02',
    title: 'Data-Driven Decisions',
    text: 'Proprietary signals from high-frequency and macro datasets. No discretionary override without documented rationale. Systematic, repeatable decision frameworks.',
  },
  {
    tag: '03',
    title: 'Risk-Adjusted Construction',
    text: 'Portfolio optimization grounded in volatility targeting, correlation stress, and tail risk constraints. Real-time risk monitoring and position limits.',
  },
  {
    tag: '04',
    title: 'Backtesting & Stress Testing',
    text: 'Historical simulation, regime-specific analysis, and crisis scenario validation before deployment. Out-of-sample testing and walk-forward validation.',
  },
  {
    tag: '05',
    title: 'Institutional Research Discipline',
    text: 'Peer-reviewed methodology. Transparent assumptions. Continuous model validation. Documentation and audit trails for compliance.',
  },
]

const ease = [0.25, 0.46, 0.45, 0.94]

export function StrategyPhilosophy() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { amount: 0.2, once: true })

  return (
    <div id="strategy">
      <section className="min-h-[50vh] flex items-center justify-center px-8 lg:px-16 py-16 lg:py-24">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.3, delay: 0.1, ease }}
          className="text-center"
        >
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00d4aa] mb-6 block">
            Philosophy
          </span>
          <h2 className="font-heading text-[clamp(2.25rem,5vw,3.5rem)] font-medium tracking-tight text-white">
            Systematic Approach
          </h2>
          <div className="w-20 h-px bg-white/20 mx-auto mt-10" />
        </motion.div>
      </section>

      <div className="px-8 lg:px-16 pb-24 lg:pb-32">
        <div className="max-w-4xl mx-auto flex flex-col gap-20 lg:gap-28">
          {panels.map((panel, i) => (
            <StrategyCard key={panel.tag} panel={panel} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StrategyCard({ panel, index }: { panel: (typeof panels)[0]; index: number }) {
  const alignRight = index % 2 === 1
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { amount: 0.15, once: true })

  const slideX = alignRight ? 72 : -72
  const stagger = index * 0.08

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: slideX }}
      animate={cardInView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideX }}
      transition={{
        duration: 1.4,
        delay: stagger,
        ease,
      }}
      className={`relative w-full md:w-auto ${alignRight ? 'md:self-end' : 'md:self-start'}`}
    >
      <div className="group panel relative overflow-hidden rounded-2xl p-8 lg:p-12 max-w-2xl min-w-0 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#00d4aa] before:to-[#00d4aa]/30 before:opacity-70 group-hover:before:opacity-100 before:transition-opacity before:duration-500 before:content-['']">
        <motion.span
          initial={{ opacity: 0 }}
          animate={cardInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: stagger + 0.15, ease }}
          className="font-mono text-sm tracking-[0.2em] text-[#00d4aa] mb-5 block"
        >
          {panel.tag}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.9, delay: stagger + 0.25, ease }}
          className="font-heading text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium text-white leading-[1.2] mb-6"
        >
          {panel.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.9, delay: stagger + 0.4, ease }}
          className="text-lg lg:text-xl text-white/70 leading-[1.7]"
        >
          {panel.text}
        </motion.p>
      </div>
    </motion.article>
  )
}
