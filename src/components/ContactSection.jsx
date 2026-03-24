import React, { useState } from 'react'
import { useSiteContext } from '../context/SiteContext'
import { supabase } from '../supabaseClient'

export default function ContactSection() {
  const { settings } = useSiteContext()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([formData])
        
      if (dbError) throw dbError
      setSubmitted(true)
      setFormData({ name: '', phone: '', email: '', message: '' }) // Reset form
    } catch (err) {
      console.error('Error sending message:', err.message)
      setError('Could not send message. Please check table/connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-mw-primary">Contact Us</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto font-medium">Get in touch for project enquiries or emergency assistance.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 flex flex-col gap-5">
          {submitted ? (
            <div className="text-center py-12 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-2xl">✓</div>
                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600">Thanks for contacting us — we will reply shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-mw-primary font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <>
              {error && <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 tracking-widest uppercase ml-1">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mw-primary outline-none font-medium" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 tracking-widest uppercase ml-1">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+971..." required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mw-primary outline-none font-medium" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 tracking-widest uppercase ml-1">Email Address</label>
                <input name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" type="email" required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mw-primary outline-none font-medium" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 tracking-widest uppercase ml-1">Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your project details or service inquiry..." rows="5" required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mw-primary outline-none font-medium resize-none" />
              </div>
              
              <button disabled={loading} type="submit" className="bg-mw-primary text-white p-5 rounded-2xl font-bold text-lg shadow-xl shadow-mw-primary/20 hover:shadow-mw-primary/40 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 mt-2">
                {loading ? 'Sending Request...' : 'Send Message Now'}
              </button>
            </>
          )}
        </form>

        <div className="bg-gradient-to-br from-mw-primary to-blue-900 p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>
          </div>
          
          <h3 className="text-3xl font-black mb-8 leading-tight">Get in touch <br/>with our Experts</h3>
          
          <div className="space-y-8">
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl">📞</div>
                  <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Call Support</p>
                      <p className="text-xl font-bold">{settings.contact_phone}</p>
                  </div>
              </div>
              
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl">✉️</div>
                  <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Email us</p>
                      <p className="text-xl font-bold">{settings.contact_email}</p>
                  </div>
              </div>
              
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl">🏢</div>
                  <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Main Office</p>
                      <p className="text-lg font-bold">123 Engineering Ave, Suite 400</p>
                  </div>
              </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <h4 className="font-bold text-white/70 text-sm uppercase tracking-widest mb-3">Service Hours</h4>
            <p className="font-bold">Mon - Sat: 8:00 AM - 6:00 PM</p>
            <p className="text-sm text-white/50">Sunday: Closed (Emergency only)</p>
          </div>
        </div>
      </div>
    </section>
  )
}
