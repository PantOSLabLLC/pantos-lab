# PantOS Lab LLC / Financial Racers

Premium dark-themed landing page for a quantitative trading and investment technology company.

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Styles** | Tailwind CSS 4 |
| **Animation** | Framer Motion, GSAP |
| **Components** | Radix UI (Tabs, Accordion, Tooltip) |
| **Carousel** | Embla Carousel |

## Features

- **Hero** — Animated data lines (canvas), metrics, staggered entrance
- **Strategy Philosophy** — Embla carousel with drag-to-scroll, dot indicators
- **Macro Models** — Yield curve SVG draw animation on scroll
- **Options** — Radix Tabs for Overview / Capabilities
- **Stat Arb** — Correlation lines scale-in animation
- **FX** — Heatmap gradient
- **Advisory** — Radix Accordion for expandable items
- **Leadership** — Fedor Naumov
- **CTA** — Radix Tooltips on action buttons

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── components/
│   ├── Hero.tsx
│   ├── StrategyPhilosophy.tsx  # Embla carousel
│   ├── MacroModels.tsx
│   ├── OptionsPricing.tsx      # Radix Tabs
│   ├── StatArb.tsx
│   ├── FXModels.tsx
│   ├── Advisory.tsx            # Radix Accordion
│   ├── Leadership.tsx
│   └── CTA.tsx                 # Radix Tooltips
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```
