import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function AdminServices() {
    const { settings, updateSettings } = useSiteContext();
    const [services, setServices] = useState(settings.services_list || []);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', title: '', description: '', icon: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (settings.services_list) {
            setServices(settings.services_list);
        }
    }, [settings.services_list]);

    const handleAdd = () => {
        setEditingId('new');
        setFormData({ id: Date.now().toString(), title: '', description: '', icon: '' });
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData(service);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        const updatedServices = services.filter(s => s.id !== id);
        setServices(updatedServices);
        await saveServices(updatedServices);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        let updatedServices;
        if (editingId === 'new') {
            updatedServices = [...services, formData];
        } else {
            updatedServices = services.map(s => s.id === editingId ? formData : s);
        }

        setServices(updatedServices);
        const ok = await saveServices(updatedServices);
        if (ok) setEditingId(null);
        setSaving(false);
    };

    const saveServices = async (updatedServices) => {
        setMessage('');
        setIsError(false);
        const result = await updateSettings({ services_list: updatedServices });
        if (result.success) {
            setMessage('✓ Services saved to database successfully!');
            setIsError(false);
            setTimeout(() => setMessage(''), 4000);
            return true;
        } else {
            setMessage(`✗ Failed to save: ${result.error}`);
            setIsError(true);
            return false;
        }
    };

    if (editingId) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {editingId === 'new' ? 'Add New Service' : 'Edit Service'}
                </h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL (Optional)</label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                            placeholder="https://example.com/icon.svg"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving to Supabase...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Manage Services</h3>
                <button
                    onClick={handleAdd}
                    className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Service
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-md flex items-center gap-2 ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    <span className="text-sm font-medium">{message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h4>
                        <p className="text-sm text-gray-600 mb-4 flex-grow">{service.description}</p>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(service)}
                                className="flex-1 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="flex-1 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No services found. Add one to get started.</p>
                </div>
            )}
        </div>
    );
}
