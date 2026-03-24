import React from 'react'
import heroImg from '../assets/hero.png'
import logo from '../assets/mw_logo.jpg'

export default function HeroSection() {
  return (
    <header className="relative">
      <div className="absolute inset-0">
        <img src={heroImg} alt="engineering background" className="w-full h-full object-cover filter brightness-75" />
      </div>

      <div className="relative z-10">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MW logo" className="h-10 w-10 object-contain rounded-md bg-white/20" />
            <span className="text-white font-semibold text-lg">MW Technical Services Provider</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-white/90 hover:text-white">Services</a>
            <a href="#portfolio" className="text-white/90 hover:text-white">Portfolio</a>
            <a href="#contact" className="text-white/90 hover:text-white">Contact</a>
            <a href="#contact" className="bg-mw-primary text-white px-4 py-2 rounded-md shadow">Request a Quote</a>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Reliable Technical & Electromechanical Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/90">
            Delivering professional building maintenance and engineering solutions across electrical,
            HVAC, plumbing, and electromechanical installations with safety and quality at the forefront.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a href="#services" className="bg-mw-primary text-white px-6 py-3 rounded-md shadow inline-block">Our Services</a>
            <a href="#contact" className="bg-mw-primary text-white px-6 py-3 rounded-md shadow inline-block">Request a Quote</a>
          </div>
        </div>
      </div>
    </header>
  )
}
