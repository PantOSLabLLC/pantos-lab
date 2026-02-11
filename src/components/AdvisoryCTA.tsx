import * as Accordion from '@radix-ui/react-accordion'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { RequestModal } from './RequestModal'

const accordionItems = [
  {
    trigger: 'Hedge Fund Consulting',
    content: 'Structured engagement models for institutional clients. Portfolio construction, risk frameworks, and strategy validation.',
  },
  {
    trigger: 'Executive Training',
    content: 'Quantitative methodology workshops for senior leadership. Macro, derivatives, and systematic investing fundamentals.',
  },
  {
    trigger: 'Technical Advisory',
    content: 'Model review, architecture assessment, and implementation support for quantitative trading systems.',
  },
]

const actions = [
  { label: 'Request Strategy Demo', primary: false },
  { label: 'Request Performance Report', primary: false },
  { label: 'Schedule Quant Briefing', primary: false },
  { label: 'Request Institutional Access', primary: true },
]

interface AdvisoryCTAProps {
  embedded?: boolean
}

export function AdvisoryCTA({ embedded }: AdvisoryCTAProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.1, once: true })
  const [modalOpen, setModalOpen] = useState(false)
  const [modalRequestType, setModalRequestType] = useState('')

  const openModal = (requestType: string) => {
    setModalRequestType(requestType)
    setModalOpen(true)
  }

  return (
    <>
      <section
        ref={ref}
        className={`flex items-center ${embedded ? 'py-12 lg:py-16' : 'min-h-[75vh] py-20'} px-0 lg:px-0`}
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start gap-16 lg:gap-20"
        >
          {/* Left: Institutional Consulting & Education */}
          <div id="advisory" className="lg:flex-1 lg:min-w-0">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00d4aa] mb-6 block">
              Advisory
            </span>
            <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-tight text-white mb-6">
              Institutional Consulting & Education
            </h2>
            <p className="text-xl text-white/70 mb-12 leading-relaxed">
              Hedge fund consulting. Executive training. Quantitative methodology workshops.
            </p>

            <Accordion.Root type="single" collapsible className="space-y-3">
              {accordionItems.map((item) => (
                <Accordion.Item
                  key={item.trigger}
                  value={item.trigger}
                  className="panel rounded-xl overflow-hidden"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between py-5 px-6 text-left text-base font-medium text-white hover:bg-white/[0.02] transition-colors data-[state=open]:border-b data-[state=open]:border-white/[0.06] group">
                      {item.trigger}
                      <span className="text-[#00d4aa] text-xl transition-transform duration-300 group-data-[state=open]:rotate-45">
                        +
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-6 py-5 text-base text-white/65 leading-relaxed">
                    {item.content}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>

          {/* Right: Institutional Access */}
          <div id="cta" className="lg:flex-1 lg:min-w-0 lg:pt-16">
            <h2 className="font-heading text-[clamp(1.75rem,3vw,2.25rem)] font-medium text-white mb-6">
              Institutional Access
            </h2>
            <div className="flex flex-col gap-4">
              {actions.map((action, i) => (
                <motion.button
                  key={action.label}
                  type="button"
                  onClick={() => openModal(action.label)}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32, y: 16 }}
                  animate={
                    inView
                      ? { opacity: 1, x: 0, y: 0 }
                      : { opacity: 0, x: i % 2 === 0 ? -32 : 32, y: 16 }
                  }
                  transition={{
                    duration: 0.9,
                    delay: 0.08 * i,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left py-5 px-6 text-base font-medium rounded-xl transition-colors duration-300 panel hover:border-white/15 flex items-center justify-between gap-4 ${
                    action.primary
                      ? 'border-[#00d4aa]/40 text-[#00d4aa] hover:border-[#00d4aa] hover:bg-[#00d4aa]/5'
                      : 'text-white/85 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {action.label}
                  <span
                    className={`shrink-0 text-lg opacity-60 ${
                      action.primary ? 'text-[#00d4aa]' : 'text-white/50'
                    }`}
                  >
                    →
                  </span>
                </motion.button>
              ))}
            </div>
            <p className="text-xs tracking-[0.2em] text-white/40 mt-12">
              PantOS Lab LLC · Financial Racers
            </p>
          </div>
        </motion.div>
      </section>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        requestType={modalRequestType}
      />
    </>
  )
}
