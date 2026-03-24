import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusText, setStatusText] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchMessages();
        markAllAsRead();
    }, []);

    const markAllAsRead = async () => {
        await supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('is_read', false);
    };

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setMessages(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (!error) {
            setStatusText({ text: 'Message deleted.', type: 'success' });
            fetchMessages();
            setTimeout(() => setStatusText({ text: '', type: '' }), 3000);
        }
    };

    const toggleRead = async (id, currentStatus) => {
        await supabase.from('contact_messages').update({ is_read: !currentStatus }).eq('id', id);
        fetchMessages();
    };

    if (loading) return <div className="p-10 text-gray-500 font-medium font-sans">Fetching support messages...</div>;

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden max-w-6xl mx-auto mt-4 transition-all font-sans relative">
            <div className="px-10 py-10 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black tracking-tight">Support Messages</h3>
                    <p className="text-blue-100 font-medium mt-2">Incoming general inquiries and messages from Contact Us.</p>
                </div>
                <button onClick={fetchMessages} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all shadow-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
            </div>

            {statusText.text && (
                <div className={`mx-10 mt-6 p-5 rounded-2xl font-bold flex items-center gap-3 animate-pulse border ${statusText.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold">✓</div>
                    {statusText.text}
                </div>
            )}

            <div className="p-10">
                {messages.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded-[48px] border-4 border-dashed border-gray-100">
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">Inbox Empty</h4>
                        <p className="text-gray-500 font-medium mt-2">No incoming messages from the contact page yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((m) => (
                            <div key={m.id} className={`group border rounded-[32px] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 ${m.is_read ? 'bg-white border-gray-100 opacity-80' : 'bg-blue-50/50 border-blue-100 ring-1 ring-blue-50'}`}>
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-2xl font-black text-gray-900">{m.name}</h4>
                                                    {!m.is_read && <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">New</span>}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                                                    <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>{m.email}</span>
                                                    <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>{m.phone}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Received</p>
                                                <p className="text-sm font-bold text-gray-700">{new Date(m.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/80 border border-gray-100 p-8 rounded-[32px] shadow-inner mt-6">
                                            <p className="text-gray-800 font-bold text-lg leading-relaxed italic pr-4 italic">“{m.message}”</p>
                                        </div>
                                        <div className="flex gap-4 pt-6 border-t border-gray-50 items-center justify-between">
                                            <div className="flex gap-4">
                                                <a 
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${m.email}&su=RE: Support Inquiry - MWTech&body=Dear ${m.name},%0D%0A%0D%0ARegarding your message:%0D%0A"${m.message}"%0D%0A%0D%0A---%0D%0AMWTech Admin`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
                                                >
                                                    Reply via Gmail
                                                </a>
                                                <button onClick={() => toggleRead(m.id, m.is_read)} className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${m.is_read ? 'bg-gray-100 text-gray-500 hover:bg-blue-500 hover:text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{m.is_read ? 'Mark as Unread' : 'Mark as Read'}</button>
                                            </div>
                                            <button onClick={() => handleDelete(m.id)} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
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
