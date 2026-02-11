import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SoftwareIntro } from './SoftwareIntro'
import { YieldCurveChart } from './charts/YieldCurveChart'
import { VolSurfaceChart } from './charts/VolSurfaceChart'
import { CorrelationPairChart } from './charts/CorrelationPairChart'
import { MacroVolatilityChart } from './charts/MacroVolatilityChart'
import { OptionsPayoffChart } from './charts/OptionsPayoffChart'
import { FXRelativeValueChart } from './charts/FXRelativeValueChart'
import { ConfigurableDashboard } from './ConfigurableDashboard'

function TitleWithShifts({ title }: { title: string; index?: number }) {
  const parts = title.split(/,\s*|;\s*/).map((s) => s.trim()).filter(Boolean)
  if (parts.length <= 1) {
    return <>{title}</>
  }
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={i % 2 === 0 ? 'block pl-0' : 'block pl-4 lg:pl-8'}>
          {part}
          {i < parts.length - 1 ? (title.includes(';') ? ';' : ',') : ''}
        </span>
      ))}
    </>
  )
}

const BLOCKS = [
  {
    id: 'macro',
    title: 'Macro models to forecasts interest rates, FX and stock market volatility',
    chart: 'macro-vol' as const,
  },
  {
    id: 'market-making',
    title: 'Tools for market making of exchange traded options',
    chart: 'vol' as const,
  },
  {
    id: 'options-pricing',
    title: 'Tools for pricing of options',
    chart: 'payoff' as const,
  },
  {
    id: 'pairs',
    title: 'Tools for screening and trading pairs of stocks (for long / short trading)',
    chart: 'correlation' as const,
  },
  {
    id: 'yield-curve',
    title: 'Tools for yield curve forecasting and trading',
    chart: 'yield' as const,
  },
  {
    id: 'fx',
    title: 'FX relative value models (nominal exchange rates against real)',
    chart: 'fx' as const,
  },
]

function SoftwareBlockCard({
  index,
  id,
  title,
  chart,
  alignRight,
}: {
  index: number
  id: string
  title: string
  chart: 'vol' | 'yield' | 'correlation' | 'macro-vol' | 'payoff' | 'fx'
  alignRight: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15, once: true })
  const baseDelay = index * 0.08

  const sectionId =
    id === 'macro' ? 'macro' : id === 'market-making' || id === 'options-pricing' ? 'options' : id === 'pairs' ? 'statarb' : undefined

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <article
      ref={ref}
      id={sectionId}
      className={`flex flex-col gap-8 lg:gap-16 ${alignRight ? 'lg:flex-row-reverse lg:ml-auto lg:max-w-[92%]' : 'lg:flex-row'} lg:items-center w-full`}
    >
      {/* Text block - number + title */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <motion.span
          initial={{ opacity: 0, x: alignRight ? 40 : -40 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: alignRight ? 40 : -40 }}
          transition={{ duration: 0.5, delay: baseDelay, ease }}
          className="font-mono text-2xl lg:text-3xl xl:text-4xl font-medium tracking-[0.15em] text-[#00d4aa] block"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: baseDelay + 0.1, ease }}
          className={`font-heading text-base lg:text-lg font-medium text-white/90 leading-[1.5] max-w-xl ${
            index % 3 === 0 ? 'lg:translate-x-1' : index % 3 === 1 ? 'lg:-translate-x-3' : 'lg:translate-x-2'
          }`}
        >
          <TitleWithShifts title={title} index={index} />
        </motion.h2>
      </div>

      {/* Chart block */}
      <motion.div
        initial={{ opacity: 0, x: alignRight ? -80 : 80 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: alignRight ? -80 : 80 }}
        transition={{ duration: 0.6, delay: baseDelay + 0.2, ease }}
        className="flex-shrink-0 w-full lg:w-[420px] xl:w-[480px] lg:max-w-[52%]"
      >
        {chart === 'vol' && <VolSurfaceChart />}
        {chart === 'yield' && <YieldCurveChart />}
        {chart === 'correlation' && <CorrelationPairChart />}
        {chart === 'macro-vol' && <MacroVolatilityChart />}
        {chart === 'payoff' && <OptionsPayoffChart />}
        {chart === 'fx' && <FXRelativeValueChart />}
      </motion.div>
    </article>
  )
}

export function SoftwareBlocks() {
  return (
    <section id="software" className="py-20 lg:py-28 px-8 lg:px-16">
      <SoftwareIntro />
      <div className="max-w-6xl mx-auto space-y-20 lg:space-y-28">
        {BLOCKS.map((block, i) => (
          <SoftwareBlockCard
            key={block.id}
            index={i}
            id={block.id}
            title={block.title}
            chart={block.chart}
            alignRight={i % 2 === 1}
          />
        ))}

        <ConfigurableDashboard />
      </div>
    </section>
  )
}
