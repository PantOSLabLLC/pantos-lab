import { Header } from './components/Header'
import { ScrollIndicator } from './components/ScrollIndicator'
import { AuroraBackground } from './components/AuroraBackground'
import { Hero } from './components/Hero'
import { SoftwareBlocks } from './components/SoftwareBlocks'
import { AboutPillars } from './components/AboutPillars'
import { StrategyPhilosophy } from './components/StrategyPhilosophy'

function App() {
  return (
    <main className="min-h-screen bg-[#08090a]">
      <AuroraBackground />
      <div className="fixed inset-0 bg-gradient-to-b from-[#08090a] via-[#0d0e10]/70 to-[#08090a] pointer-events-none z-0" />
      <Header />
      <ScrollIndicator />

      <div className="relative z-10">
        <Hero />
        <SoftwareBlocks />
        <AboutPillars />
        <StrategyPhilosophy />
      </div>
    </main>
  )
}

export default App
