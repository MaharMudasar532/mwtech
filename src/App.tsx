
import './index.css'
import HeroSection from './components/HeroSection.jsx'
import ServicesSection from './components/ServicesSection.jsx'
import WhyChooseUs from './components/WhyChooseUs.jsx'
import WorkProcess from './components/WorkProcess.jsx'
import CompletedWork from './components/CompletedWork.jsx'
import Testimonials from './components/Testimonials.jsx'
import EmergencyBanner from './components/EmergencyBanner.jsx'
import ContactSection from './components/ContactSection.jsx'
import Footer from './components/Footer.jsx'

const App = () => {
  return (
    <div className="antialiased text-gray-800">
      <HeroSection />
      <main>
        <ServicesSection />
        <WhyChooseUs />
        <WorkProcess />
        <CompletedWork />
        <Testimonials />
        <EmergencyBanner />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default App