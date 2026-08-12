import Header from './components/Header'
import Hero from './components/Hero'
import Apoio from './components/Apoio'
import PurchaseBlock from './components/PurchaseBlock'
import HowItWorks from './components/HowItWorks'
import Vsl from './components/Vsl'
import SocialProof from './components/SocialProof'
import ClosingFaq from './components/ClosingFaq'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-white font-sans text-ink antialiased">
      <Header />
      <main>
        <Hero />
        <Apoio />
        <PurchaseBlock />
        <HowItWorks />
        <Vsl />
        <SocialProof />
        <ClosingFaq />
      </main>
      <Footer />
    </div>
  )
}

export default App
