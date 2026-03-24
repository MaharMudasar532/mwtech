import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import AdminLogin from "./admin/AdminLogin.jsx"
import AdminDashboard from "./admin/AdminDashboard.jsx"
import ProtectedRoute from './components/ProtectedRoute.jsx'
import QuotationPage from "./pages/QuotationPage"
import { useSiteContext } from './context/SiteContext'

// Loading screen while Supabase data is being fetched
function SiteLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #1e40af',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
        Loading website content...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Main website — only renders after Supabase data is loaded
function MainSite() {
  const { loading } = useSiteContext();

  if (loading) return <SiteLoader />;

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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Website Route — waits for Supabase before showing any content */}
        <Route path="/" element={<MainSite />} />

        {/* Admin Navigation */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/quotation" element={<QuotationPage />} />
      </Routes>
    </Router>
  )
}

export default App