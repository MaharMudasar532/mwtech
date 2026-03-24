import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function SiteSettings() {
    const { settings, updateSettings, loading } = useSiteContext();
    const [formData, setFormData] = useState(settings);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setIsError(false);

        const result = await updateSettings(formData);
        if (result.success) {
            setMessage('✓ Website content updated successfully!');
            setIsError(false);
            setTimeout(() => setMessage(''), 4000);
        } else {
            setMessage(`✗ Error: ${result.error || 'Check database connection.'}`);
            setIsError(true);
        }

        setSaving(false);
    };

    if (loading) return <div className="p-10 text-gray-500 font-medium tracking-wide">Loading system settings...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-6 px-4 pb-20">
            {/* Header */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">General Site Settings</h3>
                <p className="text-gray-500 font-medium mt-1">Manage core branding, contact details, and global banners.</p>
            </div>

            {message && (
                <div className={`p-6 mb-8 rounded-[24px] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 ${isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {isError ? '!' : '✓'}
                    </div>
                    <span className="font-bold text-lg">{message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Branding Section */}
                <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
                        Logo & Branding
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company Logo URL</label>
                                <input
                                    type="text" name="logo_url" value={formData.logo_url || ''} onChange={handleChange}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hero Image Background URL</label>
                                <input
                                    type="text" name="hero_image_url" value={formData.hero_image_url || ''} onChange={handleChange}
                                    placeholder="https://example.com/background.jpg"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Visual Previews</label>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                                    <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">Logo</p>
                                    {formData.logo_url ? <img src={formData.logo_url} className="h-12 mx-auto object-contain" /> : <div className="h-12 flex items-center justify-center text-gray-300">N/A</div>}
                                </div>
                                <div className="flex-[2] bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center relative overflow-hidden">
                                     <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">Hero Image</p>
                                     {formData.hero_image_url ? <img src={formData.hero_image_url} className="h-12 w-full object-cover rounded-lg" /> : <div className="h-12 flex items-center justify-center text-gray-300">N/A</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Content Section */}
                <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">2</span>
                        Main Hero Content
                    </h4>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Main Heading (Hero Title)</label>
                            <input
                                type="text" name="hero_title" value={formData.hero_title || ''} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sub-heading (Hero Description)</label>
                            <textarea
                                name="hero_description" value={formData.hero_description || ''} onChange={handleChange} rows="3"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Section - THE ONE YOU ASKED FOR */}
                <div className="bg-gradient-to-br from-red-500 to-rose-700 rounded-[32px] p-10 shadow-xl shadow-red-200 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 17a1 1 0 110-2 1 1 0 010 2zm1-4h-2v-4h2v4z"/></svg>
                    </div>
                    
                    <h4 className="text-xl font-black mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">3</span>
                        Emergency Assistance Banner
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Banner Headline</label>
                            <input
                                type="text" name="emergency_title" value={formData.emergency_title || ''} onChange={handleChange}
                                className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all font-bold placeholder-white/50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Banner Sub-text</label>
                            <input
                                type="text" name="emergency_description" value={formData.emergency_description || ''} onChange={handleChange}
                                className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all font-medium placeholder-white/50"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Emergency Contact Number</label>
                            <input
                                type="text" name="emergency_phone" value={formData.emergency_phone || ''} onChange={handleChange}
                                className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all font-black text-lg tracking-widest placeholder-white/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">4</span>
                        Global Contact Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Main Support Email</label>
                            <input
                                type="email" name="contact_email" value={formData.contact_email || ''} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Main Support Phone</label>
                            <input
                                type="text" name="contact_phone" value={formData.contact_phone || ''} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">5</span>
                        Social Presence
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Instagram URL</label>
                            <input
                                type="text" name="social_instagram" value={formData.social_instagram || ''} onChange={handleChange}
                                placeholder="https://instagram.com/yourpage"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Facebook URL</label>
                            <input
                                type="text" name="social_facebook" value={formData.social_facebook || ''} onChange={handleChange}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">LinkedIn URL</label>
                            <input
                                type="text" name="social_linkedin" value={formData.social_linkedin || ''} onChange={handleChange}
                                placeholder="https://linkedin.com/company/yourpage"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit" disabled={saving}
                    className="w-full py-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black text-xl rounded-[28px] shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                    {saving ? 'Syncing with Supabase...' : 'Save All Website Changes'}
                </button>
            </form>
        </div>
    );
}
