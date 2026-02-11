import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type WidgetType = 'line' | 'donut' | 'metric'
type WidgetSize = 'sm' | 'md' | 'lg'

type ChartStyle = 'withAxes' | 'minimal' | 'withGrid' | 'area' | 'bar'

interface Widget {
  id: string
  label: string
  type: WidgetType
  size: WidgetSize
  path?: string
  chartStyle?: ChartStyle
  barData?: number[]
  donutData?: number[]
  metricValue?: string
  metricLabel?: string
}

const WIDGETS: Widget[] = [
  { id: '1', label: 'Yield Curve', type: 'line', size: 'md', path: 'M 0 40 L 30 30 L 60 35 L 90 25 L 120 20', chartStyle: 'withAxes' },
  { id: '2', label: 'IV Surface', type: 'line', size: 'sm', path: 'M 0 30 L 40 25 L 80 35 L 120 28', chartStyle: 'withGrid' },
  { id: '3', label: 'Pairs Correlation', type: 'line', size: 'sm', path: 'M 0 60 L 60 20 L 120 50', chartStyle: 'minimal' },
  { id: '4', label: 'FX Nominal/Real', type: 'line', size: 'sm', path: 'M 0 35 L 60 40 L 120 32', chartStyle: 'area' },
  { id: '5', label: 'Macro Volatility', type: 'line', size: 'md', path: 'M 0 50 L 30 30 L 60 45 L 90 35 L 120 40', chartStyle: 'withAxes' },
  { id: '6', label: 'Options Greeks', type: 'line', size: 'sm', barData: [22, 18, 35, 28, 42], chartStyle: 'bar' },
  { id: '7', label: 'Asset Allocation', type: 'donut', size: 'lg', donutData: [35, 25, 20, 12, 8] },
  { id: '8', label: 'Exposure by Asset', type: 'donut', size: 'md', donutData: [45, 30, 25] },
  { id: '9', label: 'Strategy Split', type: 'donut', size: 'sm', donutData: [60, 40] },
  { id: '10', label: 'PnL YTD', type: 'metric', size: 'sm', metricValue: '+12.4%', metricLabel: 'Year to date' },
  { id: '11', label: 'VaR 95%', type: 'metric', size: 'sm', metricValue: '2.1%', metricLabel: 'Daily' },
  { id: '12', label: 'Sharpe Ratio', type: 'metric', size: 'sm', metricValue: '1.82', metricLabel: 'Ann. gross' },
  { id: '13', label: 'Correlation', type: 'metric', size: 'md', metricValue: '0.73', metricLabel: 'Portfolio avg' },
]

const DONUT_COLORS = ['#00d4aa', '#00d4aa', 'rgba(0,212,170,0.7)', 'rgba(0,212,170,0.5)', 'rgba(0,212,170,0.3)']

function DonutChart({ data, size }: { data: number[]; size: WidgetSize }) {
  const total = data.reduce((a, b) => a + b, 0)
  const r = size === 'lg' ? 42 : size === 'md' ? 34 : 24
  const innerR = size === 'lg' ? 28 : size === 'md' ? 22 : 16

  const segments = data.map((val) => (val / total) * 360)
  let startAngle = -90

  const paths = segments.map((deg, i) => {
    const endAngle = startAngle + deg
    const rad1 = (startAngle * Math.PI) / 180
    const rad2 = (endAngle * Math.PI) / 180
    const x1 = 60 + r * Math.cos(rad1)
    const y1 = 60 + r * Math.sin(rad1)
    const x2 = 60 + r * Math.cos(rad2)
    const y2 = 60 + r * Math.sin(rad2)
    const xi1 = 60 + innerR * Math.cos(rad1)
    const yi1 = 60 + innerR * Math.sin(rad1)
    const xi2 = 60 + innerR * Math.cos(rad2)
    const yi2 = 60 + innerR * Math.sin(rad2)
    const large = deg > 180 ? 1 : 0
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`
    startAngle = endAngle
    return { d, color: DONUT_COLORS[i % DONUT_COLORS.length] }
  })

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" style={{ maxHeight: size === 'lg' ? 160 : size === 'md' ? 120 : 90 }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.9 - i * 0.1} />
      ))}
    </svg>
  )
}

const P = { left: 32, right: 8, top: 4, bottom: 18 }
const W = 120
const H = 80
const CHART_W = W - P.left - P.right
const CHART_H = H - P.top - P.bottom

function LineChart({ path, style }: { path: string; style: ChartStyle }) {
  const showAxes = style === 'withAxes'
  const showGrid = style === 'withGrid' || style === 'withAxes'
  const isArea = style === 'area'

  const transform = `translate(${P.left},${P.top}) scale(${CHART_W / 120},${CHART_H / 80})`
  const areaPath = path + ` L 120 80 L 0 80 Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full text-[#00d4aa] opacity-70 group-hover:opacity-95 transition-opacity">
      {showGrid && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <line key={`h-${i}`} x1={P.left} y1={P.top + (CHART_H * i) / 4} x2={W - P.right} y2={P.top + (CHART_H * i) / 4} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          ))}
          {[1, 2, 3, 4, 5].map((i) => (
            <line key={`v-${i}`} x1={P.left + (CHART_W * i) / 5} y1={P.top} x2={P.left + (CHART_W * i) / 5} y2={H - P.bottom} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          ))}
        </>
      )}
      {showAxes && (
        <>
          <line x1={P.left} y1={P.top} x2={P.left} y2={H - P.bottom} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <line x1={P.left} y1={H - P.bottom} x2={W - P.right} y2={H - P.bottom} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <text x={P.left - 2} y={P.top + 3} textAnchor="end" className="fill-white/50 text-[7px] font-mono">Y</text>
          <text x={W - P.right} y={H - 4} textAnchor="start" className="fill-white/50 text-[7px] font-mono">X</text>
        </>
      )}
      {isArea && (
        <path d={areaPath} fill="rgba(0,212,170,0.12)" stroke="none" transform={transform} />
      )}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={isArea ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={(showAxes || showGrid || isArea) ? transform : undefined}
      />
    </svg>
  )
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const barW = (CHART_W - (data.length - 1) * 4) / data.length

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full text-[#00d4aa]">
      <line x1={P.left} y1={P.top} x2={P.left} y2={H - P.bottom} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1={P.left} y1={H - P.bottom} x2={W - P.right} y2={H - P.bottom} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {data.map((val, i) => {
        const h = (val / max) * CHART_H
        const x = P.left + i * (barW + 4)
        return (
          <rect
            key={i}
            x={x}
            y={H - P.bottom - h}
            width={barW}
            height={h}
            rx={2}
            fill="rgba(0,212,170,0.5)"
            className="group-hover:fill-[#00d4aa]/70 transition-colors"
          />
        )
      })}
    </svg>
  )
}

function DraggableWidget({
  widget,
  onDragStart,
  onDragEnd,
}: {
  widget: Widget
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}) {
  const sizeClasses = {
    sm: 'min-h-[100px]',
    md: 'min-h-[140px] sm:col-span-2',
    lg: 'min-h-[180px] sm:col-span-2 sm:row-span-2',
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`panel rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-[#00d4aa]/30 transition-colors group flex flex-col ${sizeClasses[widget.size]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm text-white/80">{widget.label}</span>
        <span className="text-white/30 text-xs">⋮⋮</span>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        {widget.type === 'line' && widget.chartStyle === 'bar' && widget.barData && (
          <div className="h-16 lg:h-20 w-full rounded-lg bg-white/[0.03] overflow-hidden">
            <BarChart data={widget.barData} />
          </div>
        )}
        {widget.type === 'line' && widget.path && widget.chartStyle !== 'bar' && (
          <div className="h-16 lg:h-20 w-full rounded-lg bg-white/[0.03] overflow-hidden">
            <LineChart path={widget.path} style={widget.chartStyle ?? 'minimal'} />
          </div>
        )}
        {widget.type === 'donut' && widget.donutData && (
          <div className="flex items-center justify-center w-full h-full py-2">
            <DonutChart data={widget.donutData} size={widget.size} />
          </div>
        )}
        {widget.type === 'metric' && (
          <div className="flex flex-col items-center justify-center gap-1 w-full">
            <span className="font-mono text-2xl lg:text-3xl font-medium text-[#00d4aa]">
              {widget.metricValue}
            </span>
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
              {widget.metricLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfigurableDashboard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15, once: true })
  const [widgets, setWidgets] = useState(WIDGETS)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (targetId) setDropTargetId(targetId)
  }

  const handleDragLeave = () => setDropTargetId(null)

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    setDropTargetId(null)
    const sourceId = e.dataTransfer.getData('text/plain')
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null)
      return
    }
    setWidgets((prev) => {
      const ids = prev.map((w) => w.id)
      const si = ids.indexOf(sourceId)
      const ti = ids.indexOf(targetId)
      if (si === -1 || ti === -1) return prev
      const next = [...prev]
      const [removed] = next.splice(si, 1)
      next.splice(ti, 0, removed)
      return next
    })
    setDraggedId(null)
  }

  return (
    <div ref={ref} className="mt-20 lg:mt-28">
      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mb-12"
      >
        <h3 className="font-heading text-xl lg:text-2xl font-medium text-white mb-6">
          Configurable dashboard
        </h3>
        <p className="text-base lg:text-lg text-white/70 leading-relaxed">
          We provide a configurable dashboard with the ability to add the listed tools and their
          configurability and adaptation to specific business requirements and challenges.
        </p>
      </motion.div>

      {/* Drag-and-drop grid */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="panel rounded-2xl p-6 lg:p-8"
      >
        <p className="font-mono text-xs tracking-[0.2em] text-[#00d4aa] mb-6 uppercase">
          Drag to rearrange · Charts & analytics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 auto-rows-fr">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              onDrop={(e) => handleDrop(e, widget.id)}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDragLeave={handleDragLeave}
              className={`rounded-xl transition-all duration-200 ${
                widget.size === 'md' ? 'sm:col-span-2' : widget.size === 'lg' ? 'sm:col-span-2 sm:row-span-2' : ''
              } ${
                draggedId === widget.id ? 'opacity-50 scale-95' : 'opacity-100'
              } ${dropTargetId === widget.id && draggedId !== widget.id ? 'ring-2 ring-[#00d4aa]/50' : ''}`}
            >
              <DraggableWidget
                widget={widget}
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragEnd={() => {
                  setDraggedId(null)
                  setDropTargetId(null)
                }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
