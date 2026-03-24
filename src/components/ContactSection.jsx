import React, { useState } from 'react'

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-mw-primary">Contact Us</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Get in touch for project enquiries or emergency assistance.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="card">
          {submitted ? (
            <div className="text-center text-mw-primary font-semibold">Thanks — we will contact you shortly.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Name" required className="border p-3 rounded-md" />
                <input name="phone" placeholder="Phone" required className="border p-3 rounded-md" />
              </div>
              <input name="email" placeholder="Email" type="email" required className="border p-3 rounded-md mt-4 w-full" />
              <textarea name="message" placeholder="Message" rows="5" required className="border p-3 rounded-md mt-4 w-full" />
              <div className="mt-4">
                <button type="submit" className="bg-mw-primary text-white px-6 py-2 rounded-md">Send Message</button>
              </div>
            </>
          )}
        </form>

        <div className="card">
          <h3 className="font-semibold text-gray-900">Contact Info</h3>
          <p className="mt-2 text-gray-600">Phone: +1 (555) 123-4567</p>
          <p className="mt-1 text-gray-600">Email: info@mwtech.example</p>
          <p className="mt-1 text-gray-600">Office: 123 Engineering Ave, Suite 400</p>

          <div className="mt-6">
            <h4 className="font-semibold">Working Hours</h4>
            <p className="text-gray-600">Mon - Sat: 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  )
}
