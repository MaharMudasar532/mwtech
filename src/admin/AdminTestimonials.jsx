import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function AdminTestimonials() {
    const { settings, updateSettings, loading } = useSiteContext();
    const [testimonials, setTestimonials] = useState(settings.testimonials_list || []);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '', role: '', quote: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (settings.testimonials_list) {
            setTestimonials(settings.testimonials_list);
        }
    }, [settings.testimonials_list]);

    const handleAdd = () => {
        setEditingId('new');
        setFormData({ id: Date.now().toString(), name: '', role: '', quote: '' });
    };

    const handleEdit = (testimonial) => {
        setEditingId(testimonial.id);
        setFormData(testimonial);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
        const updated = testimonials.filter(t => t.id !== id);
        setTestimonials(updated);
        await saveTestimonials(updated);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        let updated;
        if (editingId === 'new') {
            updated = [...testimonials, formData];
        } else {
            updated = testimonials.map(t => t.id === editingId ? formData : t);
        }
        
        setTestimonials(updated);
        const success = await saveTestimonials(updated);
        if (success) {
            setEditingId(null);
        }
        setSaving(false);
    };

    const saveTestimonials = async (updated) => {
        setMessage('');
        setIsError(false);
        const result = await updateSettings({ testimonials_list: updated });
        if (result.success) {
            setMessage('✓ Testimonials saved to database successfully!');
            setIsError(false);
            setTimeout(() => setMessage(''), 4000);
            return true;
        } else {
            setMessage(`✗ Failed to save: ${result.error}`);
            setIsError(true);
            return false;
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading testimonials...</div>;

    if (editingId) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {editingId === 'new' ? 'Add New Testimonial' : 'Edit Testimonial'}
                    </h3>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Ahmed Khan"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Role</label>
                            <input
                                type="text"
                                name="role"
                                required
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g., Project Lead"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Testimonial Quote</label>
                        <textarea
                            name="quote"
                            required
                            value={formData.quote}
                            onChange={handleChange}
                            rows="4"
                            placeholder="What did the client say?"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save Testimonial'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-4 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Client Testimonials</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage feedback from your satisfied customers.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Testimonial
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-medium text-sm">{message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((it) => (
                    <div key={it.id} className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col h-full hover:shadow-xl hover:shadow-gray-200/50 hover:border-emerald-200 transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg">
                                {it.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{it.name}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{it.role}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6 italic flex-grow leading-relaxed">“{it.quote}”</p>
                        
                        <div className="flex gap-2 pt-4 border-t border-gray-50">
                            <button
                                onClick={() => handleEdit(it)}
                                className="flex-1 py-1.5 bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-xs font-bold transition-all"
                            >
                                EDIT
                            </button>
                            <button
                                onClick={() => handleDelete(it.id)}
                                className="flex-1 py-1.5 bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-bold transition-all"
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {testimonials.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No testimonials to show.</p>
                </div>
            )}
        </div>
    );
}
