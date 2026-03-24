import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function AdminWorkProcess() {
    const { settings, updateSettings, loading } = useSiteContext();
    const [steps, setSteps] = useState(settings.work_process || []);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', title: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (settings.work_process) {
            setSteps(settings.work_process);
        }
    }, [settings.work_process]);

    const handleAdd = () => {
        setEditingId('new');
        setFormData({ id: Date.now().toString(), title: '' });
    };

    const handleEdit = (step) => {
        setEditingId(step.id);
        setFormData(step);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this step?")) return;
        const updated = steps.filter(s => s.id !== id);
        setSteps(updated);
        await saveSteps(updated);
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
            updated = [...steps, formData];
        } else {
            updated = steps.map(s => s.id === editingId ? formData : s);
        }
        
        setSteps(updated);
        const success = await saveSteps(updated);
        if (success) {
            setEditingId(null);
        }
        setSaving(false);
    };

    const saveSteps = async (updated) => {
        setMessage('');
        setIsError(false);
        const result = await updateSettings({ work_process: updated });
        if (result.success) {
            setMessage('✓ Work process saved to database successfully!');
            setIsError(false);
            setTimeout(() => setMessage(''), 4000);
            return true;
        } else {
            setMessage(`✗ Failed to save: ${result.error}`);
            setIsError(true);
            return false;
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading work process...</div>;

    if (editingId) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {editingId === 'new' ? 'Add New Step' : 'Edit Step'}
                    </h3>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Step Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Consultation"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
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
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save Step'}
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
                    <h3 className="text-2xl font-bold text-gray-900">Project Work Process</h3>
                    <p className="text-sm text-gray-500 mt-1">Define the steps your team takes to complete a project.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    New Step
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-medium text-sm">{message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((it, idx) => (
                    <div key={it.id} className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col h-full hover:shadow-xl hover:shadow-gray-200/50 hover:border-blue-200 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                {idx + 1}
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-6">{it.title}</h4>
                        
                        <div className="flex gap-2 pt-4 border-t border-gray-50 mt-auto">
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
            
            {steps.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No work process steps defined.</p>
                </div>
            )}
        </div>
    );
}
