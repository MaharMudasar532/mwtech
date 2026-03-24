import React from 'react'
import heroImg from '../assets/hero.png'

const projects = [
  { title: 'Commercial Building Refurbishment', img: heroImg, desc: 'Full electromechanical upgrade for office tower.' },
  { title: 'Residential HVAC Installation', img: heroImg, desc: 'Design and install HVAC systems for apartment complex.' },
  { title: 'Retail Fit-out', img: heroImg, desc: 'Electrical, lighting and interiors fit-out for retail.' },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Completed Work</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Selected projects showcasing our multidisciplinary capabilities.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.title} className="card">
            <img src={p.img} alt={p.title} className="w-full h-44 object-cover rounded-md" />
            <h3 className="mt-4 font-semibold text-gray-900">{p.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
