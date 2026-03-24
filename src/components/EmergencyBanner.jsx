import React from 'react'

export default function EmergencyBanner() {
  return (
    <section className="bg-mw-primary text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Need Urgent Technical Assistance?</h3>
          <p className="mt-1 text-white/90">We offer rapid response support for critical electromechanical issues.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono">+1 (555) 123-4567</div>
          <a href="tel:+15551234567" className="bg-white text-mw-primary px-4 py-2 rounded-md font-semibold">Call Now</a>
        </div>
      </div>
    </section>
  )
}
