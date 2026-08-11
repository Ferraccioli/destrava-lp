import Header from './components/Header'
import Hero from './components/Hero'
import Apoio from './components/Apoio'
import PurchaseBlock from './components/PurchaseBlock'
import HowItWorks from './components/HowItWorks'
import Vsl from './components/Vsl'
import SocialProof from './components/SocialProof'
import ClosingFaq from './components/ClosingFaq'
import Footer from './components/Footer'

/*
 * DESTRAVA PAIS · TESTE A/B — VARIANTE A
 * Ordem das seções: Hero → Bloco de compra → Como funciona → VSL → Prova social → Fechamento + FAQ
 * A variável do teste é a posição do bloco de compra (aqui: seção 2, logo após o hero).
 */
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
