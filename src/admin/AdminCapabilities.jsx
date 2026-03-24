import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function AdminCapabilities() {
    const { settings, updateSettings, loading } = useSiteContext();
    const [capabilities, setCapabilities] = useState(settings.capabilities_list || []);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', title: '', desc: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (settings.capabilities_list) {
            setCapabilities(settings.capabilities_list);
        }
    }, [settings.capabilities_list]);

    const handleAdd = () => {
        setEditingId('new');
        setFormData({ id: Date.now().toString(), title: '', desc: '' });
    };

    const handleEdit = (capability) => {
        setEditingId(capability.id);
        setFormData(capability);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this capability?")) return;
        const updated = capabilities.filter(c => c.id !== id);
        setCapabilities(updated);
        await saveCapabilities(updated);
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
            updated = [...capabilities, formData];
        } else {
            updated = capabilities.map(c => c.id === editingId ? formData : c);
        }
        
        setCapabilities(updated);
        const success = await saveCapabilities(updated);
        if (success) {
            setEditingId(null);
        }
        setSaving(false);
    };

    const saveCapabilities = async (updated) => {
        setMessage('');
        setIsError(false);
        const result = await updateSettings({ capabilities_list: updated });
        if (result.success) {
            setMessage('✓ Capabilities saved to database successfully!');
            setIsError(false);
            setTimeout(() => setMessage(''), 4000);
            return true;
        } else {
            setMessage(`✗ Failed to save: ${result.error}`);
            setIsError(true);
            return false;
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading capabilities...</div>;

    if (editingId) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {editingId === 'new' ? 'Add New Capability' : 'Edit Capability'}
                    </h3>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Capability Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., 24/7 Support"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="desc"
                            required
                            value={formData.desc}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe this capability..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
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
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Save Capability
                                </>
                            )}
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
                    <h3 className="text-2xl font-bold text-gray-900">Why Choose Us</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage the core capabilities that build trust with your clients.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="py-2.5 px-5 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    New Capability
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-medium text-sm">{message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {capabilities.map((it) => (
                    <div key={it.id} className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col h-full hover:shadow-xl hover:shadow-gray-200/50 hover:border-purple-200 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9 8 12 2z"></path></svg>
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{it.title}</h4>
                        <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{it.desc}</p>
                        
                        <div className="flex gap-2 pt-4 border-t border-gray-50">
                            <button
                                onClick={() => handleEdit(it)}
                                className="flex-1 py-2 bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                EDIT
                            </button>
                            <button
                                onClick={() => handleDelete(it.id)}
                                className="flex-1 py-2 bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {capabilities.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">No Capabilities Found</h4>
                    <p className="text-gray-500 max-w-xs mx-auto">Add some capabilities to show your clients why they should choose you.</p>
                </div>
            )}
        </div>
    );
}
