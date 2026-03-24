import React from 'react'

const services = [
  'Electrical Works',
  'HVAC Systems',
  'Plumbing & Sanitary',
  'Carpentry & Wood Flooring',
  'False Ceiling & Partitions',
  'Plaster Works',
  'Floor & Wall Tiling',
  'Building Cleaning',
  'Electromechanical Installation',
]

function Icon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 11h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Our Services</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Comprehensive technical & electromechanical services for residential and commercial projects.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s} className="card flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-mw-secondary/10 text-mw-primary flex items-center justify-center">
              <Icon />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{s}</h3>
              <p className="text-sm text-gray-600 mt-1">Professional, timely and compliant execution for {s.toLowerCase()}.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
