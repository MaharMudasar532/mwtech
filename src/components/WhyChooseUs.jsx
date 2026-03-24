import React from 'react'

const items = [
  { title: 'Skilled Technicians', desc: 'Certified technicians with deep domain expertise.' },
  { title: 'Reliable Service', desc: 'On-time, professional and transparent communication.' },
  { title: 'High Quality Work', desc: 'We follow best practices and quality checks.' },
  { title: 'Competitive Pricing', desc: 'Value-driven proposals with clear scope.' },
  { title: 'Safety & Compliance', desc: 'Strict adherence to safety and regulatory standards.' },
]

function Badge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9 8 12 2z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Why Choose Us</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Reasoned capabilities that make us a trusted partner for clients.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {items.map((it) => (
          <div key={it.title} className="card flex flex-col items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-mw-accent/10 text-mw-accent flex items-center justify-center">
              <Badge />
            </div>
            <h3 className="font-semibold text-gray-900">{it.title}</h3>
            <p className="text-sm text-gray-600">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
