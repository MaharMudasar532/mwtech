import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import defaultHeroImg from '../assets/hero.png';
import defaultLogo from '../assets/mw_logo.jpg';

const SiteContext = createContext();

export const useSiteContext = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
    const defaultSettings = {
        logo_url: defaultLogo,
        hero_image_url: defaultHeroImg,
        hero_title: 'Reliable Technical & Electromechanical Services',
        hero_description: 'Delivering professional building maintenance and engineering solutions across electrical, HVAC, plumbing, and electromechanical installations with safety and quality at the forefront.',
        contact_email: 'info@mwtech.com',
        contact_phone: '+971 12 345 6789',
        social_instagram: 'https://instagram.com/',
        social_facebook: 'https://facebook.com/',
        social_linkedin: 'https://linkedin.com/',
        services_list: [
            { id: '1', title: 'Electrical Works', description: 'Professional, timely and compliant execution for electrical works.' },
            { id: '2', title: 'HVAC Systems', description: 'Professional, timely and compliant execution for HVAC systems.' },
            { id: '3', title: 'Plumbing & Sanitary', description: 'Professional, timely and compliant execution for plumbing & sanitary.' },
            { id: '4', title: 'Carpentry & Wood Flooring', description: 'Professional, timely and compliant execution for carpentry & wood flooring.' },
            { id: '5', title: 'Electromechanical Installation', description: 'Professional, timely and compliant execution for electromechanical installations.' }
        ],
        capabilities_list: [
            { id: '1', title: 'Skilled Technicians', desc: 'Certified technicians with deep domain expertise.' },
            { id: '2', title: 'Reliable Service', desc: 'On-time, professional and transparent communication.' },
            { id: '3', title: 'High Quality Work', desc: 'We follow best practices and quality checks.' },
            { id: '4', title: 'Competitive Pricing', desc: 'Value-driven proposals with clear scope.' },
            { id: '5', title: 'Safety & Compliance', desc: 'Strict adherence to safety and regulatory standards.' }
        ],
        work_process: [
            { id: '1', title: 'Consultation' },
            { id: '2', title: 'Planning' },
            { id: '3', title: 'Execution' },
            { id: '4', title: 'Completion' }
        ],
        portfolio_projects: [
            { id: '1', title: 'Commercial Building Refurbishment', img: defaultHeroImg, desc: 'Full electromechanical upgrade for office tower.' },
            { id: '2', title: 'Residential HVAC Installation', img: defaultHeroImg, desc: 'Design and install HVAC systems for apartment complex.' },
            { id: '3', title: 'Retail Fit-out', img: defaultHeroImg, desc: 'Electrical, lighting and interiors fit-out for retail.' }
        ],
        testimonials_list: [
            { id: '1', name: 'Ahmed Khan', role: 'Facilities Manager', quote: 'Excellent workmanship and timely delivery. Very professional team.' },
            { id: '2', name: 'Sara Ali', role: 'Project Lead', quote: 'Highly reliable and responsive. They handled a complex installation flawlessly.' },
            { id: '3', name: 'Michael Chen', role: 'Building Owner', quote: 'Transparent communication and strong quality control throughout the project.' }
        ],
        emergency_title: 'Need Urgent Technical Assistance?',
        emergency_description: 'We offer rapid response support for critical electromechanical issues.',
        emergency_phone: '+971 50 123 4567'
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saveError, setSaveError] = useState(null);

    // Helper: parse JSON fields that come back as strings from Supabase
    const parseJsonFields = (data) => {
        const jsonFields = ['services_list', 'capabilities_list', 'work_process', 'portfolio_projects', 'testimonials_list'];
        const parsed = { ...data };
        for (const field of jsonFields) {
            if (typeof parsed[field] === 'string') {
                try {
                    parsed[field] = JSON.parse(parsed[field]);
                } catch {
                    // keep as-is if not valid JSON
                }
            }
        }
        return parsed;
    };

    // Helper: stringify JSON fields so they can be stored in Supabase text/jsonb columns
    const prepareForSupabase = (data) => {
        const jsonFields = ['services_list', 'capabilities_list', 'work_process', 'portfolio_projects', 'testimonials_list'];
        const prepared = { ...data };
        for (const field of jsonFields) {
            if (Array.isArray(prepared[field]) || typeof prepared[field] === 'object') {
                prepared[field] = JSON.stringify(prepared[field]);
            }
        }
        return prepared;
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*')
                    .limit(1)
                    .maybeSingle();

                if (data && !error) {
                    // Parse JSON fields that come back as strings
                    const parsed = parseJsonFields(data);

                    // Fully override defaults with Supabase data.
                    // Only keep default for fields that are genuinely null/empty in DB.
                    setSettings(prev => {
                        const merged = { ...prev };
                        for (const key of Object.keys(parsed)) {
                            const val = parsed[key];
                            // Override if value is non-null, non-empty string, or non-empty array
                            if (val !== null && val !== undefined) {
                                if (Array.isArray(val)) {
                                    // Always use DB array, even if empty — admin cleared it intentionally
                                    merged[key] = val;
                                } else if (typeof val === 'string' && val.trim() !== '') {
                                    merged[key] = val;
                                } else if (typeof val !== 'string') {
                                    merged[key] = val;
                                }
                                // If string is empty, keep default so UI doesn't break
                            }
                        }
                        return merged;
                    });
                } else if (error) {
                    console.warn('Supabase fetch error:', error.message);
                }
            } catch (err) {
                console.warn('Supabase unavailable, using defaults:', err.message);
            }
            setLoading(false);
        };

        fetchSettings();

        // Real-time subscription: live updates from Supabase
        const settingsSubscription = supabase
            .channel('realtime:site_settings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
                if (payload.new) {
                    const parsed = parseJsonFields(payload.new);
                    setSettings(prev => ({
                        ...prev,
                        ...Object.fromEntries(
                            Object.entries(parsed).filter(([_, v]) => v !== null && v !== undefined)
                        )
                    }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(settingsSubscription);
        };
    }, []);

    /**
     * updateSettings: saves new settings to Supabase permanently.
     * Returns { success: true } or { success: false, error: string }
     */
    const updateSettings = async (newSettings) => {
        try {
            setSaveError(null);

            // Merge with current settings in React state immediately (optimistic update)
            const merged = { ...settings, ...newSettings };
            setSettings(merged);

            // Prepare data for Supabase (stringify JSON arrays)
            const payload = prepareForSupabase(newSettings);

            // Check if a row exists
            const { data: existing, error: selectError } = await supabase
                .from('site_settings')
                .select('id')
                .limit(1)
                .maybeSingle();

            if (selectError) throw selectError;

            if (existing && existing.id) {
                // Update existing row
                const { error: updateError } = await supabase
                    .from('site_settings')
                    .update(payload)
                    .eq('id', existing.id);

                if (updateError) throw updateError;
            } else {
                // Insert first row
                const fullPayload = prepareForSupabase(merged);
                const { error: insertError } = await supabase
                    .from('site_settings')
                    .insert([fullPayload]);

                if (insertError) throw insertError;
            }

            return { success: true };
        } catch (err) {
            console.error('Supabase save error:', err.message || err);
            setSaveError(err.message || 'Unknown error');
            // Rollback optimistic update on failure
            setSettings(prev => ({ ...settings }));
            return { success: false, error: err.message || 'Failed to save to Supabase' };
        }
    };

    return (
        <SiteContext.Provider value={{ settings, updateSettings, loading, saveError }}>
            {children}
        </SiteContext.Provider>
    );
};
