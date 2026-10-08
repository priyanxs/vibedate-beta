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

export default function App() {
  return (
    <DateProvider>
      <div className="bg-blobs" aria-hidden="true" />
      <Navbar />
      <Hero />
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
    </DateProvider>
  )
}
