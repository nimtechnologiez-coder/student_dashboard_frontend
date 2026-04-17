'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, CheckCircle, Shield, Globe, Award, Zap, BarChart3 } from 'lucide-react';

const EnterprisePage = () => {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        size: '50-200',
        goal: 'Skills Transformation',
        mobile: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit inquiry. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('A network error occurred.');
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-[#0395B2]/20 rounded-full flex items-center justify-center border border-[#0395B2]/50 animate-pulse">
                            <CheckCircle size={48} className="text-[#0395B2]" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black bg-gradient-to-r from-[#0395B2] to-[#A3D861] bg-clip-text text-transparent">
                        Proposal Requested
                    </h2>
                    <p className="text-gray-400">
                        Thank you for reaching out. An Enterprise Account Executive will be in touch within 12 hours to discuss your organizational goals.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-3 bg-[#A3D861] text-black rounded-xl font-black transition-all hover:scale-105"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#0395B2]/30">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[10%] left-[-5%] w-[50%] h-[50%] bg-[#0395B2]/10 blur-[130px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-[#A3D861]/5 blur-[130px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="flex justify-between items-center mb-16">
                    <button
                        onClick={() => router.push('/subscription')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Plans</span>
                    </button>
                    <div className="px-5 py-2 bg-[#0395B2]/10 border border-[#0395B2]/20 rounded-full text-[#0395B2] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} /> Enterprise Solutions
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    
                    {/* Left side: Enterprise Value Prop */}
                    <div className="space-y-10 lg:sticky lg:top-12">
                        <div className="space-y-6">
                            <h1 className="text-6xl lg:text-8xl font-black leading-none">
                                Scale <span className="text-[#0395B2]">Genius</span> Globally.
                            </h1>
                            <p className="text-xl text-gray-400 max-w-lg">
                                Power your entire organization with AI-driven learning paths, 
                                custom branding, and actionable skill analytics.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Enterprise Capabilities</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { icon: BarChart3, title: "Advanced Analytics", desc: "Real-time insights into team competency." },
                                    { icon: Globe, title: "Global Collection", desc: "30,000+ courses in 15+ languages." },
                                    { icon: Zap, title: "SSO & Security", desc: "Enterprise-grade auth and data protection." },
                                    { icon: Award, title: "Custom Pathways", desc: "Build paths unique to your company's roles." }
                                ].map((cap, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#0395B2]/50 transition-colors">
                                            <cap.icon size={22} className="text-[#0395B2]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{cap.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{cap.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                            <p className="text-gray-500 text-sm italic">
                                "Nim Academy's enterprise solution helped us upskill 2,000+ engineers in GenAI within 90 days."
                            </p>
                        </div>
                    </div>

                    {/* Right side: Modern Form */}
                    <div className="bg-[#0a0f1a] border border-white/10 p-10 lg:p-14 rounded-[3rem] shadow-2xl relative">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black">Get a Custom Proposal</h2>
                                <p className="text-gray-400">Tell us about your organization's learning needs.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Sarah Chen"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors"
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="sarah@globalcorp.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors"
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Company / Organization</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Global Technologies Inc."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors"
                                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <input 
                                            required
                                            type="tel" 
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors"
                                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Company Size</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors appearance-none"
                                            onChange={(e) => setFormData({...formData, size: e.target.value})}
                                        >
                                            <option value="50-200">50 - 200 employees</option>
                                            <option value="200-1000">200 - 1000 employees</option>
                                            <option value="1000-5000">1000 - 5000 employees</option>
                                            <option value="5000+">5000+ employees</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Primary Goal</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors appearance-none"
                                            onChange={(e) => setFormData({...formData, goal: e.target.value})}
                                        >
                                            <option value="Skills Transformation">Skills Transformation</option>
                                            <option value="Certification Prep">Certification Prep</option>
                                            <option value="Onboarding & Compliance">Onboarding & Compliance</option>
                                            <option value="AI Upskilling">AI Upskilling</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Requirements</label>
                                    <textarea 
                                        rows="4"
                                        placeholder="Tell us about your organization's specific challenges..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0395B2] transition-colors resize-none"
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#0395B2] hover:bg-[#0395B2]/90 text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(3,149,178,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                                >
                                    <span>Submit Request</span>
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EnterprisePage;
