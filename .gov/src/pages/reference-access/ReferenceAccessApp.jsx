import './styles.css'
import Header from './components/Header.jsx'
import LeftHeroPanel from './components/LeftHeroPanel.jsx'
import RequestAccessCard from './components/RequestAccessCard.jsx'
import RightSidebar from './components/RightSidebar.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="reference-access">
      <div className="app">
      <Header />
      <div className="page">
        <LeftHeroPanel />
        <RequestAccessCard />
        <RightSidebar />
      </div>
      <Footer />
      </div>
    </div>
  )
}
