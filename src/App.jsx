import { DateProvider } from './context/DateContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import VenueExplorer from './components/VenueExplorer.jsx'
import GiftSuggester from './components/GiftSuggester.jsx'
import Itinerary from './components/Itinerary.jsx'
import OutfitCoordinator from './components/OutfitCoordinator.jsx'
import MessageWriter from './components/MessageWriter.jsx'
import ConversationDeck from './components/ConversationDeck.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'
import MobileSummaryBar from './components/MobileSummaryBar.jsx'
import WingmanChat from './components/WingmanChat.jsx'
import Footer from './components/Footer.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import CityRing from './components/CityRing.jsx'
import BackToTop from './components/BackToTop.jsx'
import IntroSplash from './components/IntroSplash.jsx'
import BackgroundMusic from './components/BackgroundMusic.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Marquee from './components/Marquee.jsx'
import { usePointerFx } from './utils/fx'

export default function App() {
  usePointerFx()

  return (
    <DateProvider>
      <ToastProvider>
      <IntroSplash />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <span className="blob blob--a" />
        <span className="blob blob--b" />
        <span className="blob blob--c" />
      </div>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <div className="container">
        <CityRing />
        <HowItWorks />
      </div>
      <div className="container layout">
        <main className="layout__main">
          <VenueExplorer />
          <GiftSuggester />
          <Itinerary />
          <OutfitCoordinator />
          <MessageWriter />
          <ConversationDeck />
        </main>
        <aside className="layout__aside" aria-label="Date plan summary">
          <SummaryPanel />
        </aside>
      </div>
      <Footer />
      <MobileSummaryBar />
      <WingmanChat />
      <BackToTop />
      <BackgroundMusic />
      </ToastProvider>
    </DateProvider>
  )
}
