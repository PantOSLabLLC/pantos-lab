import * as Accordion from '@radix-ui/react-accordion'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const items = [
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

export function Advisory() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.1, once: false })

  return (
    <section id="advisory" ref={ref} className="min-h-[75vh] flex items-center py-20 px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-3xl mx-auto lg:ml-[8%] lg:mr-[15%]"
      >
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
          {items.map((item) => (
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
      </motion.div>
    </section>
  )
}
