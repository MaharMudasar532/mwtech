import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function AdminPortfolio() {
    const { settings, updateSettings, loading } = useSiteContext();
    const [projects, setProjects] = useState(settings.portfolio_projects || []);
    const [editingId, setEditingId] = useState(null); // 'new' or UUID
    const [formData, setFormData] = useState({ id: '', title: '', desc: '', img: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (settings.portfolio_projects) {
            setProjects(settings.portfolio_projects);
        }
    }, [settings.portfolio_projects]);

    const handleAdd = () => {
        setEditingId('new');
        setFormData({ id: Date.now().toString(), title: '', desc: '', img: '' });
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setFormData({ ...project });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project permanently?")) return;
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        await saveProjects(updated);
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
            updated = [...projects, { ...formData, id: Date.now().toString() }];
        } else {
            updated = projects.map(p => p.id === editingId ? formData : p);
        }
        
        setProjects(updated);
        const success = await saveProjects(updated);
        if (success) {
            setEditingId(null);
            setFormData({ id: '', title: '', desc: '', img: '' });
        }
        setSaving(false);
    };

    const saveProjects = async (updated) => {
        setMessage('');
        setIsError(false);
        const result = await updateSettings({ portfolio_projects: updated });
        if (result.success) {
            setMessage('✓ Portfolio updated successfully in Supabase!');
            setIsError(false);
            setTimeout(() => setMessage(''), 4000);
            return true;
        } else {
            setMessage(`✗ Failed to update: ${result.error}`);
            setIsError(true);
            return false;
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading portfolio data...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-6 px-4">
            {/* Header Area */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Project Portfolio</h3>
                    <p className="text-gray-500 font-medium mt-1">Add, edit or remove projects from your public website.</p>
                </div>
                {!editingId && (
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add New Project
                    </button>
                )}
            </div>

            {/* Edit / Add Form Overlay-style */}
            {editingId && (
                <div className="bg-white rounded-[40px] shadow-2xl border border-blue-100 p-10 mb-12 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                            {editingId === 'new' ? '+' : '✎'}
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">
                            {editingId === 'new' ? 'Create New Project' : 'Update Project Details'}
                        </h4>
                    </div>

                    <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Project Title</label>
                                <input
                                    type="text" name="title" required value={formData.title} onChange={handleChange}
                                    placeholder="e.g. Modern Villa HVAC Installation"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Image URL (Public Link)</label>
                                <input
                                    type="text" name="img" required value={formData.img} onChange={handleChange}
                                    placeholder="https://example.com/project.jpg"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Project Description</label>
                                <textarea
                                    name="desc" required rows="4" value={formData.desc} onChange={handleChange}
                                    placeholder="Describe the scope of work and results..."
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Live Preview</label>
                                <div className="aspect-video w-full bg-gray-100 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-inner group relative">
                                    {formData.img ? (
                                        <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            <p className="text-sm font-bold uppercase tracking-widest">Image Preview will appear here</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h5 className="font-bold text-blue-900 text-lg mb-1">{formData.title || 'Project Title Placeholder'}</h5>
                                    <p className="text-blue-700 text-sm line-clamp-2">{formData.desc || 'Detailed description will show up here as a preview for the website cards.'}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    type="button" onClick={() => setEditingId(null)}
                                    className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" disabled={saving}
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Syncing...' : (editingId === 'new' ? 'Publish Project' : 'Update Project')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Notification Message */}
            {message && (
                <div className={`p-6 mb-8 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 ${isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isError ? 'bg-red-100' : 'bg-green-100'}`}>
                        {isError ? '!' : '✓'}
                    </div>
                    <span className="font-bold text-lg">{message}</span>
                </div>
            )}

            {/* Projects Grid */}
            {!editingId && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {projects.map((it) => (
                        <div key={it.id} className="group bg-white border border-gray-100 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 relative flex flex-col">
                            <div className="relative h-56 overflow-hidden">
                                <img src={it.img} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <span className="text-white font-bold text-sm uppercase tracking-widest leading-none">View Full Details</span>
                                </div>
                            </div>
                            
                            <div className="p-8 flex flex-col flex-1">
                                <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{it.title}</h4>
                                <p className="text-gray-500 font-medium mb-8 line-clamp-3 leading-relaxed">{it.desc}</p>
                                
                                <div className="flex gap-3 mt-auto">
                                    <button
                                        onClick={() => handleEdit(it)}
                                        className="flex-1 py-3.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-2xl text-sm font-black transition-all uppercase tracking-widest"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(it.id)}
                                        className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                                        title="Delete Project"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-32 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100">
                            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">Portfolio is Empty</h4>
                            <p className="text-gray-500 font-medium mt-2">Start showcasing your work by adding your first project.</p>
                            <button onClick={handleAdd} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all">Add Project Now</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
