import React from 'react'
import { useSiteContext } from '../context/SiteContext'

export default function Footer() {
  const { settings } = useSiteContext()

  return (
    <footer className="bg-gray-50 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-mw-primary font-semibold">MW Technical Services Provider</h3>
          <p className="mt-2 text-gray-600">Trusted technical and electromechanical services for buildings and facilities.</p>
        </div>

        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-2 text-gray-600 space-y-1">
            <li><a href="#services">Services</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Services</h4>
          <ul className="mt-2 text-gray-600 space-y-1">
            <li>Electrical Works</li>
            <li>HVAC Systems</li>
            <li>Plumbing & Sanitary</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2 text-gray-600">{settings.contact_phone}</p>
          <p className="text-gray-600">{settings.contact_email}</p>
          <div className="mt-3 flex items-center gap-3 text-mw-primary">
            <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full bg-white shadow-card hover:bg-gray-100">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6 1.11 6 0 4.88 0 3.5 0 2.12 1.11 1 2.48 1 3.86 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.14V24h-4v-7.8c0-1.86-.04-4.26-2.6-4.26-2.6 0-3 2.03-3 4.12V24h-4V8z" /></svg>
            </a>
            <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full bg-white shadow-card hover:bg-gray-100">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.78-3.9 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.57V12h2.8l-.45 2.89h-2.35v6.99A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-white shadow-card hover:bg-gray-100">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="max-w-7xl mx-auto px-6 text-sm text-gray-500">© {new Date().getFullYear()} MW Technical Services Provider — All rights reserved.</div>
      </div>
    </footer>
  )
}
