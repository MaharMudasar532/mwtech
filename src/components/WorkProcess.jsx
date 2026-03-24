import React from 'react'
import { useSiteContext } from '../context/SiteContext'

export default function WorkProcess() {
  const { settings } = useSiteContext();
  const steps = settings.work_process || [];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50" id="work-process">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Our Work Process</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">A simple four-step workflow to keep projects predictable and on schedule.</p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {steps.map((s, i) => (
          <div key={s.id || s.title} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-mw-primary text-white flex items-center justify-center font-semibold">{i + 1}</div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{s.title}</h3>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden sm:block mx-4 text-gray-300">→</div>
            )}
          </div>
        ))}
      </div>
      
      {steps.length === 0 && (
          <p className="text-center text-gray-400 mt-8">Process steps details coming soon...</p>
      )}
    </section>
  )
}
