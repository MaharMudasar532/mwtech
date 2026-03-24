import React from 'react'
import { useSiteContext } from '../context/SiteContext'

export default function Portfolio() {
  const { settings } = useSiteContext();
  const projects = settings.portfolio_projects || [];

  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Completed Work</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Selected projects showcasing our multidisciplinary capabilities.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id || p.title} className="card">
            <img src={p.img} alt={p.title} className="w-full h-44 object-cover rounded-md" />
            <h3 className="mt-4 font-semibold text-gray-900">{p.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
          <p className="text-center text-gray-400 mt-8">Recent projects showcase coming soon...</p>
      )}
    </section>
  )
}
