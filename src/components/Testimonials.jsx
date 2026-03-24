import React, { useRef } from 'react'
import { useSiteContext } from '../context/SiteContext'

export default function Testimonials() {
  const { settings } = useSiteContext();
  const testimonials = settings.testimonials_list || [];
  const ref = useRef(null)

  const scroll = (dir = 'next') => {
    if (!ref.current) return
    const offset = ref.current.clientWidth
    ref.current.scrollBy({ left: dir === 'next' ? offset : -offset, behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="testimonials">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Testimonials</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">What our clients say about working with us.</p>
      </div>

      <div className="mt-8 relative">
        <div ref={ref} className="flex gap-4 overflow-x-auto pb-4">
          {testimonials.map((t) => (
            <div key={t.id || t.name} className="min-w-[280px] card">
              <p className="text-gray-800">“{t.quote}”</p>
              <div className="mt-4 text-sm text-gray-600">— {t.name}, {t.role}</div>
            </div>
          ))}
        </div>
        
        {testimonials.length > 0 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button onClick={() => scroll('prev')} className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors">‹</button>
            <button onClick={() => scroll('next')} className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors">›</button>
            </div>
        )}
      </div>
      
      {testimonials.length === 0 && (
          <p className="text-center text-gray-400 mt-8">Recent client reviews coming soon...</p>
      )}
    </section>
  )
}
