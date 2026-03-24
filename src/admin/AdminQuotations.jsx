import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminQuotations() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchQuotations();
        markAllAsRead();
    }, []);

    const markAllAsRead = async () => {
        await supabase.from('quotations').update({ is_read: true }).eq('is_read', false);
    };

    const fetchQuotations = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('quotations')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setQuotations(data);
        setLoading(false);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const { error } = await supabase.from('quotations').update({ status: newStatus }).eq('id', id);
        if (!error) {
            setStatusMessage({ text: 'Status updated successfully!', type: 'success' });
            fetchQuotations();
            setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const { error } = await supabase.from('quotations').delete().eq('id', id);
        if (!error) {
            setStatusMessage({ text: 'Record deleted.', type: 'success' });
            fetchQuotations();
            setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
        }
    };

    if (loading) return <div className="p-8 text-gray-500 font-medium font-sans">Fetching quotations...</div>;

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden max-w-6xl mx-auto mt-4 transition-all font-sans relative">
            <div className="px-10 py-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-bold">New Quotations</h3>
                    <p className="text-blue-200 mt-2 font-medium">Manage user project requests and inquiries.</p>
                </div>
                <button onClick={fetchQuotations} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
            </div>

            {statusMessage.text && (
                <div className={`mx-10 mt-6 p-4 rounded-2xl font-bold flex items-center gap-3 border ${statusMessage.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {statusMessage.text}
                </div>
            )}

            <div className="p-10">
                {quotations.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">No Quotations Yet</h4>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {quotations.map((q) => (
                            <div key={q.id} className={`group border rounded-[32px] p-8 transition-all bg-white relative ${!q.is_read ? 'border-blue-200 shadow-lg shadow-blue-500/5' : 'border-gray-100'}`}>
                                <span className={`absolute top-8 right-8 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${q.status === 'Pending' ? 'bg-orange-100 text-orange-600' : q.status === 'Responded' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {q.status}
                                </span>
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Customer Info</p>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-xl font-bold text-gray-900">{q.full_name}</h4>
                                                {!q.is_read && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase">New</span>}
                                            </div>
                                            <p className="text-gray-600 font-medium">{q.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Service</p>
                                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm">{q.service_type || 'General'}</span>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium bg-gray-50 p-6 rounded-2xl italic border border-gray-100">“{q.message}”</p>
                                        <div className="flex flex-wrap items-center gap-4 pt-4">
                                            <select value={q.status} onChange={(e) => handleStatusUpdate(q.id, e.target.value)} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                                <option value="Pending">Pending</option>
                                                <option value="Responded">Responded</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <a 
                                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${q.email}&su=RE: Quotation for ${q.service_type || 'Services'} - MWTech&body=Dear ${q.full_name},%0D%0A%0D%0ARegarding your quotation request for ${q.service_type}:%0D%0A"${q.message}"%0D%0A%0D%0A---%0D%0AMWTech Sales Teams`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-md"
                                            >
                                                Reply via Gmail
                                            </a>
                                            <button onClick={() => handleDelete(q.id)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-all">Delete</button>
                                            <span className="text-xs text-gray-400 ml-auto font-medium">Submitted: {new Date(q.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
