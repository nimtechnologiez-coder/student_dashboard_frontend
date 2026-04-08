'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, CheckCircle, Video, Users, Building, Globe } from 'lucide-react';

const DemoPage = () => {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        size: '1-10',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would send data to the backend
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-[#A3D861]/20 rounded-full flex items-center justify-center border border-[#A3D861]/50 animate-pulse">
                            <CheckCircle size={40} className="text-[#A3D861]" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0395B2] to-[#A3D861] bg-clip-text text-transparent">
                        Demo Request Received!
                    </h2>
                    <p className="text-gray-400">
                        Thank you for your interest in Nim Academy. Our team will contact you within 24 hours to schedule your personalized walkthrough.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all font-bold"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#A3D861]/30">
            {/* Background Glow */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0395B2]/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A3D861]/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="flex justify-between items-center mb-16">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </button>
                    <div className="h-8 w-auto">
                        <img src="/Nim Academy.png" alt="Nim Academy" className="h-full invert brightness-0" />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                                Experience the <span className="bg-gradient-to-r from-[#0395B2] to-[#A3D861] bg-clip-text text-transparent">Future</span> of Learning
                            </h1>
                            <p className="text-xl text-gray-400 max-w-lg">
                                See how Nim Academy can transform your organization with AI-powered personalized learning and industry-expert content.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                            {[
                                { icon: Video, title: "Interactive Walkthrough", desc: "See the platform in action with a live guide." },
                                { icon: Users, title: "Scalable for Teams", desc: "Custom features for groups of any size." },
                                { icon: Building, title: "Enterprise Ready", desc: "Advanced security and analytics for your org." },
                                { icon: Globe, title: "Global Content", desc: "Access the latest tech skills from anywhere." }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-[#A3D861]/30 transition-all">
                                    <item.icon className="text-[#A3D861] mb-3" size={24} />
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white/5 border border-white/10 p-8 lg:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        {/* Subtle decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A3D861]/20 to-transparent blur-2xl"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Request a Personalized Demo</h2>
                                <p className="text-gray-400 text-sm">Fill out the form below and we'll be in touch.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@company.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Company / Organization</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="TechCorp Inc."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors"
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Company Size</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors appearance-none"
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    >
                                        <option value="1-10">1 - 10 employees</option>
                                        <option value="11-50">11 - 50 employees</option>
                                        <option value="51-200">51 - 200 employees</option>
                                        <option value="201-500">201 - 500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">How can we help?</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Tell us about your team's learning goals..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors resize-none"
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#0395B2] to-[#A3D861] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,216,97,0.3)]"
                                >
                                    <span>Send Demo Request</span>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <footer className="mt-32 text-center pb-12">
                    <p className="text-gray-500 text-sm max-w-sm mx-auto italic">
                        "Nim Academy has completely changed how our engineering team stays ahead of the curve."
                    </p>
                    <div className="mt-4 font-bold text-gray-400">Trusted by 500+ companies globally</div>
                </footer>
            </div>
        </div>
    );
};

export default DemoPage;




