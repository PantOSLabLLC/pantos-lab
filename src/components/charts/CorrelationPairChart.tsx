import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const PAIR_DATA = [
  { x: -1.2, y: -1.1 },
  { x: 0.8, y: 0.7 },
  { x: -0.5, y: -0.6 },
  { x: 1.5, y: 1.4 },
  { x: -0.9, y: -0.8 },
  { x: 0.4, y: 0.5 },
  { x: -1.5, y: -1.4 },
  { x: 2.0, y: 1.9 },
  { x: -0.3, y: -0.2 },
  { x: 1.0, y: 1.1 },
  { x: 0.2, y: 0.3 },
  { x: -1.0, y: -0.9 },
]

const PADDING = { left: 44, right: 24, top: 24, bottom: 40 }
const WIDTH = 280
const HEIGHT = 180
const CHART_W = WIDTH - PADDING.left - PADDING.right
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom

export function CorrelationPairChart() {
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(containerRef, { amount: 0.1 })
  const [hovered, setHovered] = useState<{ x: number; y: number; idx: number } | null>(null)

  const minX = Math.min(...PAIR_DATA.map((d) => d.x))
  const maxX = Math.max(...PAIR_DATA.map((d) => d.x))
  const minY = Math.min(...PAIR_DATA.map((d) => d.y))
  const maxY = Math.max(...PAIR_DATA.map((d) => d.y))
  const padX = (maxX - minX) * 0.15 || 0.5
  const padY = (maxY - minY) * 0.15 || 0.5

  const xScale = (x: number) =>
    PADDING.left + ((x - minX) / (maxX - minX + padX * 2)) * CHART_W
  const yScale = (y: number) =>
    PADDING.top + CHART_H - ((y - minY) / (maxY - minY + padY * 2)) * CHART_H

  const regStart = { x: minX - padX, y: minY - padY }
  const regEnd = { x: maxX + padX, y: maxY + padY }

  useEffect(() => {
    const path = pathRef.current
    if (!path || !inView) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`
    const duration = 1000
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
    const mx = ((e.clientX - rect.left) / rect.width) * WIDTH
    const my = ((e.clientY - rect.top) / rect.height) * HEIGHT

    let closest: { x: number; y: number; idx: number } | null = null
    let minDist = Infinity

    PAIR_DATA.forEach((d, i) => {
      const px = xScale(d.x)
      const py = yScale(d.y)
      const dist = Math.hypot(mx - px, my - py)
      if (dist < minDist && dist < 24) {
        minDist = dist
        closest = { x: d.x, y: d.y, idx: i }
      }
    })

    setHovered(closest)
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div className="panel p-6 rounded-2xl" ref={containerRef}>
      <div className="h-[240px] lg:h-[280px] relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full text-[#00d4aa]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {[1, 2, 3, 4].map((i) => (
            <line
              key={`h-${i}`}
              x1={PADDING.left}
              y1={PADDING.top + (CHART_H * i) / 4}
              x2={PADDING.left + CHART_W}
              y2={PADDING.top + (CHART_H * i) / 4}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
            />
          ))}
          {[1, 2, 3, 4].map((i) => (
            <line
              key={`v-${i}`}
              x1={PADDING.left + (CHART_W * i) / 4}
              y1={PADDING.top}
              x2={PADDING.left + (CHART_W * i) / 4}
              y2={PADDING.top + CHART_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
            />
          ))}
          <path
            ref={pathRef}
            d={`M ${xScale(regStart.x)} ${yScale(regStart.y)} L ${xScale(regEnd.x)} ${yScale(regEnd.y)}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            className="text-[#00d4aa]/40"
          />
          {PAIR_DATA.map((d, i) => (
            <motion.circle
              key={i}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              r={hovered?.idx === i ? 6 : 4}
              className="fill-[#00d4aa]"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                inView
                  ? { opacity: hovered ? (hovered.idx === i ? 1 : 0.4) : 0.85, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.5, delay: i * 0.04 }}
            />
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
          <text x={PADDING.left - 6} y={PADDING.top - 4} textAnchor="end" className="fill-white/40 text-[9px] font-mono">
            Asset B %
          </text>
          <text
            x={PADDING.left + CHART_W / 2}
            y={HEIGHT - 4}
            textAnchor="middle"
            className="fill-white/40 text-[9px] font-mono"
          >
            Asset A %
          </text>
          {hovered && (
            <g>
              <rect
                x={xScale(hovered.x) - 38}
                y={yScale(hovered.y) - 28}
                width={76}
                height={24}
                rx={4}
                className="fill-[#0d0e10] stroke-white/20"
                strokeWidth={1}
              />
              <text
                x={xScale(hovered.x)}
                y={yScale(hovered.y) - 12}
                textAnchor="middle"
                className="fill-[#00d4aa] text-[10px] font-mono font-medium"
              >
                A {hovered.x > 0 ? '+' : ''}{hovered.x.toFixed(1)}% · B {hovered.y > 0 ? '+' : ''}{hovered.y.toFixed(1)}%
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="text-xs font-mono text-white/40 mt-3">Correlation pair · Cointegration</p>
    </div>
  )
}
