import React from 'react'
import { useSiteContext } from '../context/SiteContext'

export default function EmergencyBanner() {
  const { settings } = useSiteContext();

  return (
    <section className="bg-mw-primary text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{settings.emergency_title}</h3>
          <p className="mt-1 text-white/90">{settings.emergency_description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono">{settings.emergency_phone}</div>
          <a href={`tel:${settings.emergency_phone}`} className="bg-white text-mw-primary px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">Call Now</a>
        </div>
      </div>
    </section>
  )
}
