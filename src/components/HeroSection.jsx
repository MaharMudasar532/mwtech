import { useSiteContext } from '../context/SiteContext'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  const { settings } = useSiteContext();
  return (
    <header className="relative">
      <div className="absolute inset-0">
        <img src={settings.hero_image_url} alt="engineering background" className="w-full h-full object-cover filter brightness-75" />
      </div>

      <div className="relative z-10">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={settings.logo_url} alt="MW logo" className="h-10 w-10 object-contain rounded-md bg-white/20" />
            <span className="text-white font-semibold text-lg">MW Technical Services Provider</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-white/90 hover:text-white font-medium">Services</a>
            <a href="#portfolio" className="text-white/90 hover:text-white font-medium">Portfolio</a>
            <Link to="/quotation" className="bg-mw-primary text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-mw-primary/30 transition-all font-bold">Request a Quote</Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {settings.hero_title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/90">
            {settings.hero_description}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <a href="#services" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl shadow-xl hover:bg-white/20 transition-all font-bold inline-block">Our Services</a>
            <Link to="/quotation" className="bg-mw-primary text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-mw-primary/40 transition-all font-bold inline-block">Request a Quote</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
