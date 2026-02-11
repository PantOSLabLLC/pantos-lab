import { useRef, useState, useEffect } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { motion, useInView } from 'framer-motion'
import { SequentialReveal, StaggeredContent } from './ScrollReveal'

const dataRows = [
  { label: 'Options pricing', value: 'Software' },
  { label: 'Market making', value: 'Exchange-traded' },
  { label: 'IV surface', value: 'Calibrated' },
]

// Sample IV surface: strikes (%) x tenors -> implied vol (%)
const STRIKES = [90, 95, 100, 105, 110]
const TENORS = ['1M', '3M', '6M', '1Y']
// Vol smile: higher at wings (OTM), lower ATM; increases with tenor
const IV_SURFACE: number[][] = [
  [22, 23, 24, 25],
  [18, 19, 20, 21],
  [16, 17, 18, 19],
  [18, 19, 20, 21],
  [22, 23, 24, 25],
]

const PADDING = { left: 44, right: 24, top: 24, bottom: 40 }
const WIDTH = 280
const HEIGHT = 180
const CELL_W = (WIDTH - PADDING.left - PADDING.right) / STRIKES.length
const CELL_H = (HEIGHT - PADDING.top - PADDING.bottom) / TENORS.length

function getIVColor(iv: number) {
  const min = 14
  const max = 26
  const t = (iv - min) / (max - min)
  return `rgba(0, 212, 170, ${0.25 + t * 0.6})`
}

function VolSurfaceChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { amount: 0.1 })
  const [hovered, setHovered] = useState<{ strike: number; tenor: string; iv: number; x: number; y: number } | null>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (inView && !animated) setAnimated(true)
  }, [inView, animated])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - PADDING.left
    const y = e.clientY - rect.top - PADDING.top

    if (x < 0 || y < 0 || x > CELL_W * STRIKES.length || y > CELL_H * TENORS.length) {
      setHovered(null)
      return
    }

    const col = Math.min(Math.floor(x / CELL_W), STRIKES.length - 1)
    const row = Math.min(Math.floor(y / CELL_H), TENORS.length - 1)

    setHovered({
      strike: STRIKES[col],
      tenor: TENORS[row],
      iv: IV_SURFACE[col][row],
      x: PADDING.left + col * CELL_W + CELL_W / 2,
      y: PADDING.top + row * CELL_H + CELL_H / 2,
    })
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div className="panel p-6 rounded-2xl" ref={containerRef}>
      <div className="h-[220px] lg:h-[240px] relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {/* Grid cells */}
          {STRIKES.map((_, col) =>
            TENORS.map((_, row) => (
              <motion.rect
                key={`${col}-${row}`}
                x={PADDING.left + col * CELL_W + 1}
                y={PADDING.top + row * CELL_H + 1}
                width={CELL_W - 2}
                height={CELL_H - 2}
                fill={getIVColor(IV_SURFACE[col][row])}
                initial={{ opacity: 0 }}
                animate={animated ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: (col + row) * 0.05 }}
                style={{
                  opacity: hovered
                    ? hovered.strike === STRIKES[col] && hovered.tenor === TENORS[row]
                      ? 1
                      : 0.4
                    : undefined,
                }}
              />
            ))
          )}

          {/* X-axis labels (strikes) */}
          {STRIKES.map((s, i) => (
            <text
              key={s}
              x={PADDING.left + i * CELL_W + CELL_W / 2}
              y={HEIGHT - 12}
              textAnchor="middle"
              className="fill-white/40 text-[9px] font-mono"
            >
              {s}%
            </text>
          ))}

          {/* Y-axis labels (tenors) */}
          {TENORS.map((t, i) => (
            <text
              key={t}
              x={PADDING.left - 6}
              y={PADDING.top + i * CELL_H + CELL_H / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-white/40 text-[9px] font-mono"
            >
              {t}
            </text>
          ))}

          {/* Axes */}
          <line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={PADDING.top + CELL_H * TENORS.length}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
          <line
            x1={PADDING.left}
            y1={PADDING.top + CELL_H * TENORS.length}
            x2={PADDING.left + CELL_W * STRIKES.length}
            y2={PADDING.top + CELL_H * TENORS.length}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />

          {/* Tooltip */}
          {hovered && (
            <g>
              <rect
                x={hovered.x - 42}
                y={hovered.y - 32}
                width={84}
                height={28}
                rx={4}
                className="fill-[#0d0e10] stroke-white/20"
                strokeWidth={1}
              />
              <text
                x={hovered.x}
                y={hovered.y - 16}
                textAnchor="middle"
                className="fill-[#00d4aa] text-[10px] font-mono font-medium"
              >
                K {hovered.strike}% · {hovered.tenor}
              </text>
              <text
                x={hovered.x}
                y={hovered.y - 2}
                textAnchor="middle"
                className="fill-white/70 text-[10px] font-mono"
              >
                IV {hovered.iv}%
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="text-xs font-mono text-white/40 mt-3">IV surface · Strike × Tenor</p>
    </div>
  )
}

export function OptionsPricing() {
  const visual = <VolSurfaceChart />

  const secondary = (inView: boolean) => (
    <StaggeredContent
      inView={inView}
      tag={
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00d4aa] mb-6 block">
          Options & Derivatives
        </span>
      }
      title={
        <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-tight text-white mb-6">
          Pricing & Market Making
        </h2>
      }
    >
      <p className="text-xl text-white/70 mb-8 leading-relaxed">
        Software for trading and market making of exchange-traded options.
      </p>
      <Tabs.Root defaultValue="overview" className="w-full">
        <Tabs.List className="flex gap-8 mb-8 border-b border-white/10">
          <Tabs.Trigger
            value="overview"
            className="pb-4 px-1 text-base font-medium text-white/60 data-[state=active]:text-[#00d4aa] data-[state=active]:border-b-2 data-[state=active]:border-[#00d4aa] border-b-2 border-transparent transition-colors"
          >
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger
            value="capabilities"
            className="pb-4 px-1 text-base font-medium text-white/60 data-[state=active]:text-[#00d4aa] data-[state=active]:border-b-2 data-[state=active]:border-[#00d4aa] border-b-2 border-transparent transition-colors"
          >
            Capabilities
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <div className="panel p-6 rounded-xl">
            {dataRows.map((row) => (
              <div
                key={row.label}
                className="flex justify-between py-4 border-b border-white/[0.06] last:border-0 text-base"
              >
                <span className="text-white/80">{row.label}</span>
                <span className="font-mono text-[#00d4aa]">{row.value}</span>
              </div>
            ))}
          </div>
        </Tabs.Content>
        <Tabs.Content value="capabilities">
          <ul className="space-y-3">
            {[
              'Tools for market making of exchange traded options',
              'Tools for pricing of options',
            ].map((item) => (
              <li key={item} className="relative pl-6 text-white/65 text-base">
                <span className="absolute left-0 text-[#00d4aa] font-mono">—</span>
                {item}
              </li>
            ))}
          </ul>
        </Tabs.Content>
      </Tabs.Root>
    </StaggeredContent>
  )

  return (
    <section id="options" className="min-h-[75vh] flex items-center py-20 px-8 lg:px-16">
      <div className="w-full mx-auto">
        <SequentialReveal
          primary={visual}
          secondary={secondary}
          primarySide="right"
          layout="right"
          primaryFrom={{ x: 80, y: 0 }}
          secondaryFrom={{ x: -80, y: 0 }}
        />
      </div>
    </section>
  )
}
