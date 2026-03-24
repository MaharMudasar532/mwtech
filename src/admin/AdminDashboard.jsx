import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SiteSettings from './SiteSettings';
import AdminServices from './AdminServices';
import AdminCapabilities from './AdminCapabilities';
import AdminWorkProcess from './AdminWorkProcess';
import AdminPortfolio from './AdminPortfolio';
import AdminTestimonials from './AdminTestimonials';
import AdminQuotations from './AdminQuotations';
import AdminMessages from './AdminMessages';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [counts, setCounts] = useState({
        quotations: 0,
        services: 0,
        projects: 0,
        messages: 0,
        newQuotations: 0,
        newMessages: 0
    });

    React.useEffect(() => {
        const fetchCounts = async () => {
            const { count: qCount } = await supabase.from('quotations').select('*', { count: 'exact', head: true });
            const { count: nqCount } = await supabase.from('quotations').select('*', { count: 'exact', head: true }).eq('is_read', false);
            const { count: mCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
            const { count: nmCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

            // Note: For JSON lists we have to parse them
            const { data } = await supabase.from('site_settings').select('services_list, portfolio_projects').limit(1).maybeSingle();

            setCounts({
                quotations: qCount || 0,
                newQuotations: nqCount || 0,
                messages: mCount || 0,
                newMessages: nmCount || 0,
                services: data?.services_list ? (typeof data.services_list === 'string' ? JSON.parse(data.services_list).length : data.services_list.length) : 0,
                projects: data?.portfolio_projects ? (typeof data.portfolio_projects === 'string' ? JSON.parse(data.portfolio_projects).length : data.portfolio_projects.length) : 0
            });
        };
        fetchCounts();

        // Real-time subscriptions for counts
        const quoteSubscription = supabase
            .channel('realtime:quotations_counts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'quotations' }, () => fetchCounts())
            .subscribe();

        const messageSubscription = supabase
            .channel('realtime:messages_counts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => fetchCounts())
            .subscribe();

        return () => {
            supabase.removeChannel(quoteSubscription);
            supabase.removeChannel(messageSubscription);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans antialiased text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col hidden md:flex">
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                        MWTech Admin
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab('services')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'services' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Services
                    </button>
                    <button onClick={() => setActiveTab('capabilities')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'capabilities' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                        Capabilities
                    </button>
                    <button onClick={() => setActiveTab('work-process')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'work-process' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Work Process
                    </button>
                    <button onClick={() => setActiveTab('portfolio')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'portfolio' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Portfolio
                    </button>
                    <button onClick={() => setActiveTab('testimonials')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'testimonials' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 0-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                        Testimonials
                    </button>
                    <button onClick={() => setActiveTab('quotations')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'quotations' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Quotations
                        </div>
                        {counts.newQuotations > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New {counts.newQuotations}</span>
                        )}
                    </button>
                    <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'messages' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            Messages
                        </div>
                        {counts.newMessages > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New {counts.newMessages}</span>
                        )}
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        Users
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Settings
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {activeTab === 'overview' ? 'Overview' :
                            activeTab === 'services' ? 'Services' :
                                activeTab === 'capabilities' ? 'Capabilities' :
                                    activeTab === 'work-process' ? 'Work Process' :
                                        activeTab === 'portfolio' ? 'Portfolio' :
                                            activeTab === 'testimonials' ? 'Testimonials' :
                                                activeTab === 'quotations' ? 'New Quotations' :
                                                    activeTab === 'messages' ? 'Support Inbox' :
                                                        'Site Settings'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                            A
                        </div>
                        <span className="font-medium text-gray-700 hidden sm:block">Admin User</span>
                    </div>
                </header>

                {/* Dashboard Cards */}
                <div className="p-8">
                    {activeTab === 'overview' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                                    <div className="p-4 rounded-full bg-blue-50 text-blue-500 mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Quotations {counts.newQuotations > 0 && <span className="text-red-500 font-bold ml-1">(New {counts.newQuotations})</span>}</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{counts.quotations} <span className="text-sm font-normal text-gray-400">total</span></h3>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                                    <div className="p-4 rounded-full bg-orange-50 text-orange-500 mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Messages {counts.newMessages > 0 && <span className="text-red-500 font-bold ml-1">(New {counts.newMessages})</span>}</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{counts.messages} <span className="text-sm font-normal text-gray-400">total</span></h3>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                                    <div className="p-4 rounded-full bg-green-50 text-green-500 mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Live Services</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{counts.services}</h3>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
                                    <div className="p-4 rounded-full bg-purple-50 text-purple-500 mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Portfolio Projects</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{counts.projects}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                                    <button className="text-sm text-purple-600 font-medium hover:text-purple-700">View all</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-sm">
                                                <th className="px-6 py-3 font-medium">User</th>
                                                <th className="px-6 py-3 font-medium">Action</th>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            <tr className="border-t border-gray-50 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-800">John Doe</td>
                                                <td className="px-6 py-4 text-gray-600">Logged in</td>
                                                <td className="px-6 py-4 text-gray-500">2 mins ago</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Success</span></td>
                                            </tr>
                                            <tr className="border-t border-gray-50 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-800">Jane Smith</td>
                                                <td className="px-6 py-4 text-gray-600">Updated profile</td>
                                                <td className="px-6 py-4 text-gray-500">1 hour ago</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Success</span></td>
                                            </tr>
                                            <tr className="border-t border-gray-50 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-800">Admin User</td>
                                                <td className="px-6 py-4 text-gray-600">Failed login attempt</td>
                                                <td className="px-6 py-4 text-gray-500">3 hours ago</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Failed</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : activeTab === 'services' ? (
                        <AdminServices />
                    ) : activeTab === 'capabilities' ? (
                        <AdminCapabilities />
                    ) : activeTab === 'work-process' ? (
                        <AdminWorkProcess />
                    ) : activeTab === 'portfolio' ? (
                        <AdminPortfolio />
                    ) : activeTab === 'testimonials' ? (
                        <AdminTestimonials />
                    ) : activeTab === 'quotations' ? (
                        <AdminQuotations />
                    ) : activeTab === 'messages' ? (
                        <AdminMessages />
                    ) : (
                        <SiteSettings />
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
