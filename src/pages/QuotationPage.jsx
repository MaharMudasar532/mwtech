import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useSiteContext } from '../context/SiteContext';

export default function QuotationPage() {
    const navigate = useNavigate();
    const { settings } = useSiteContext();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        service_type: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { error } = await supabase
                .from('quotations')
                .insert([formData]);
                
            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            alert("Error submitting quotation: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-8">Your quotation request has been sent successfully. Our team will contact you shortly.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
            <div className="max-w-4xl w-full grid md:grid-cols-5 gap-8 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                {/* Left Side: Info */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-700 to-indigo-900 p-10 text-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Get a Custom Quote</h2>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                            Describe your project requirements and our engineering experts will provide a detailed proposal.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Email us</p>
                                    <p className="font-semibold">{settings.contact_email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Call Support</p>
                                    <p className="font-semibold">{settings.contact_phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:col-span-3 p-10 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input 
                                    name="full_name" required value={formData.full_name} onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input 
                                    name="email" type="email" required value={formData.email} onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input 
                                    name="phone" value={formData.phone} onChange={handleChange}
                                    placeholder="+971 00 000 0000"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Required</label>
                                <select 
                                    name="service_type" value={formData.service_type} onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                >
                                    <option value="">Select a Service</option>
                                    {settings.services_list?.map(s => (
                                        <option key={s.id} value={s.title}>{s.title}</option>
                                    ))}
                                    <option value="Other">Other / General Inquiry</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Project Details</label>
                            <textarea 
                                name="message" required rows="4" value={formData.message} onChange={handleChange}
                                placeholder="Describe your technical requirements..."
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : (
                                <>
                                    <span>Request Quotation</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <button onClick={() => navigate('/')} className="mt-8 text-gray-500 hover:text-blue-600 font-medium transition-colors">
                ← Return to Homepage
            </button>
        </div>
    );
}
