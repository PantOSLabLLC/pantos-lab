import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'

const actions = [
  { label: 'Request Strategy Demo', primary: false },
  { label: 'View Performance Summary', primary: false },
  { label: 'Schedule Quant Briefing', primary: false },
  { label: 'Request Institutional Access', primary: true },
]

export function CTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.1, once: false })

  return (
    <Tooltip.Provider delayDuration={300}>
      <section id="cta" ref={ref} className="min-h-[75vh] flex items-center py-20 px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-xl mx-auto text-center lg:ml-auto lg:mr-[15%]"
        >
          <h2 className="font-heading text-[clamp(1.75rem,3vw,2.25rem)] font-medium text-white mb-14">
            Institutional Access
          </h2>
          <div className="space-y-4 mb-14">
            {actions.map((action, i) => (
              <motion.a
                key={action.label}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`block py-5 px-6 text-base font-medium rounded-xl transition-all duration-300 panel hover:border-white/10 ${
                  action.primary
                    ? 'border-[#00d4aa]/40 text-[#00d4aa] hover:border-[#00d4aa]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span>{action.label}</span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      sideOffset={8}
                      className="px-4 py-2 text-sm panel rounded-lg"
                    >
                      Contact for institutional access
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </motion.a>
            ))}
          </div>
          <p className="text-xs tracking-[0.2em] text-white/40">
            PantOS Lab LLC · Financial Racers
          </p>
        </motion.div>
      </section>
    </Tooltip.Provider>
  )
}
