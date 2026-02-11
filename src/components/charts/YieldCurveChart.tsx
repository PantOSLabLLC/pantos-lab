import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

const YIELD_DATA = [
  { tenor: '1M', months: 1, yield: 4.2 },
  { tenor: '3M', months: 3, yield: 4.35 },
  { tenor: '6M', months: 6, yield: 4.5 },
  { tenor: '1Y', months: 12, yield: 4.55 },
  { tenor: '2Y', months: 24, yield: 4.45 },
  { tenor: '5Y', months: 60, yield: 4.35 },
  { tenor: '10Y', months: 120, yield: 4.5 },
  { tenor: '30Y', months: 360, yield: 4.7 },
]

const PADDING = { left: 48, right: 24, top: 24, bottom: 36 }
const WIDTH = 360
const HEIGHT = 200
const CHART_W = WIDTH - PADDING.left - PADDING.right
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom

export function YieldCurveChart() {
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(containerRef, { amount: 0.1 })
  const [hovered, setHovered] = useState<{ tenor: string; yield: number; x: number; y: number } | null>(null)

  const minY = Math.min(...YIELD_DATA.map((d) => d.yield)) - 0.2
  const maxY = Math.max(...YIELD_DATA.map((d) => d.yield)) + 0.2

  const xScale = (i: number) => PADDING.left + (i / (YIELD_DATA.length - 1)) * CHART_W
  const yScale = (y: number) => PADDING.top + CHART_H - ((y - minY) / (maxY - minY)) * CHART_H

  const pathD = YIELD_DATA.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.yield)}`
  ).join(' ')

  useEffect(() => {
    const path = pathRef.current
    if (!path || !inView) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`
    const duration = 1200
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      path.style.strokeDashoffset = `${len * (1 - t)}`
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView])

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH
    const y = ((e.clientY - rect.top) / rect.height) * HEIGHT

    let closest: { tenor: string; yield: number; x: number; y: number } | null = null
    let minDist = Infinity

    YIELD_DATA.forEach((d, i) => {
      const px = xScale(i)
      const py = yScale(d.yield)
      const dist = Math.hypot(x - px, y - py)
      if (dist < minDist && dist < 40) {
        minDist = dist
        closest = { tenor: d.tenor, yield: d.yield, x: px, y: py }
      }
    })

    setHovered(closest)
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div className="panel p-6 rounded-2xl" ref={containerRef}>
      <div className="h-[260px] lg:h-[300px] relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full text-[#00d4aa]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <line
              key={`hy-${i}`}
              x1={PADDING.left}
              y1={PADDING.top + (CHART_H * i) / 5}
              x2={PADDING.left + CHART_W}
              y2={PADDING.top + (CHART_H * i) / 5}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
            />
          ))}
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={`vx-${i}`}
              x1={PADDING.left + (CHART_W * i) / 7}
              y1={PADDING.top}
              x2={PADDING.left + (CHART_W * i) / 7}
              y2={PADDING.top + CHART_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
            />
          ))}
          {[minY, (minY + maxY) / 2, maxY].map((y, idx) => (
            <text
              key={idx}
              x={PADDING.left - 8}
              y={yScale(y)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-white/40 text-[10px] font-mono"
            >
              {y.toFixed(1)}%
            </text>
          ))}
          {YIELD_DATA.map((d, i) => (
            <text
              key={d.tenor}
              x={xScale(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-white/40 text-[10px] font-mono"
            >
              {d.tenor}
            </text>
          ))}
          <line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={PADDING.top + CHART_H}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
          <line
            x1={PADDING.left}
            y1={PADDING.top + CHART_H}
            x2={PADDING.left + CHART_W}
            y2={PADDING.top + CHART_H}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {YIELD_DATA.map((d, i) => (
            <circle
              key={d.tenor}
              cx={xScale(i)}
              cy={yScale(d.yield)}
              r={hovered?.tenor === d.tenor ? 5 : 3}
              className="fill-[#00d4aa]"
              style={{ opacity: hovered ? (hovered.tenor === d.tenor ? 1 : 0.3) : 0.8 }}
            />
          ))}
          {hovered && (
            <g>
              <rect
                x={hovered.x - 32}
                y={hovered.y - 28}
                width={64}
                height={24}
                rx={4}
                className="fill-[#0d0e10] stroke-white/20"
                strokeWidth={1}
              />
              <text
                x={hovered.x}
                y={hovered.y - 12}
                textAnchor="middle"
                className="fill-[#00d4aa] text-[11px] font-mono font-medium"
              >
                {hovered.tenor} {hovered.yield.toFixed(2)}%
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="text-xs font-mono text-white/40 mt-3">Yield curve (bps)</p>
    </div>
  )
}
