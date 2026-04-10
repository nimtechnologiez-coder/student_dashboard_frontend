'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Zap, Shield, Sparkles } from 'lucide-react';

const SubscriptionPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#A3D861]/30">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-[#0395B2]/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#A3D861]/10 blur-[150px] rounded-full"></div>
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

                <div className="text-center space-y-4 mb-20">
                    <h1 className="text-5xl lg:text-7xl font-black">
                        Choose the <span className="bg-gradient-to-r from-[#0395B2] to-[#A3D861] bg-clip-text text-transparent">Scale</span> for You
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Whether you're a small team or a global enterprise, we have a plan built for your growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {/* Team Plan */}
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 lg:p-12 flex flex-col relative group transition-transform hover:scale-[1.01]">
                        <div className="absolute top-0 right-0 p-8">
                            <Zap className="text-purple-400 opacity-50" size={32} />
                        </div>

                        <div className="space-y-4 mb-8">
                            <h2 className="text-3xl font-bold">Team Plan</h2>
                            <p className="text-gray-400">For teams of 2 to 50 learners wanting to level up together.</p>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-black text-white">₹2,000</span>
                            <span className="text-gray-500 font-bold">/ month / user</span>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="h-px bg-white/10"></div>
                            <ul className="space-y-4">
                                {[
                                    "Access to 13,000+ top courses",
                                    "Certification preparation",
                                    "Goal-focused recommendations",
                                    "AI-powered coaching",
                                    "Basic analytics and reports",
                                    "Billed annually, cancel anytime"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-purple-500/20 rounded-full p-1 border border-purple-500/50">
                                            <Check size={14} className="text-purple-400" />
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            className="mt-12 w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-[#A3D861] transition-all hover:shadow-[0_0_30px_rgba(163,216,97,0.4)]"
                            onClick={() => router.push('/payment')}
                        >
                            Start Team Subscription
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#0395B2]/10 border border-[#0395B2]/30 rounded-[3rem] p-10 lg:p-12 flex flex-col relative group transition-transform hover:scale-[1.01] overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                        <div className="absolute top-0 right-0 p-8">
                            <Shield className="text-[#A3D861] opacity-50" size={32} />
                        </div>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="bg-[#A3D861]/20 text-[#A3D861] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block border border-[#A3D861]/30">
                                Most Powerful
                            </div>
                            <h2 className="text-3xl font-bold">Enterprise</h2>
                            <p className="text-gray-400">For organizations with 20+ learners needing advanced power.</p>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8 relative z-10">
                            <span className="text-5xl font-black text-white">Custom</span>
                            <span className="text-gray-500 font-bold">/ organization</span>
                        </div>

                        <div className="space-y-6 flex-1 relative z-10">
                            <div className="h-px bg-white/10"></div>
                            <ul className="space-y-4">
                                {[
                                    "Everything in Team +",
                                    "Custom course creation tools",
                                    "Advanced admin & security",
                                    "Dedicated customer success manager",
                                    "Custom subdomains & branding",
                                    "Flexible payment options"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-[#A3D861]/20 rounded-full p-1 border border-[#A3D861]/50">
                                            <Check size={14} className="text-[#A3D861]" />
                                        </div>
                                        <span className="text-gray-300 text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            className="mt-12 w-full py-4 bg-gradient-to-r from-[#0395B2] to-[#A3D861] text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(3,149,178,0.3)] relative z-10"
                            onClick={() => router.push('/demo')}
                        >
                            Request Enterprise Demo
                        </button>
                    </div>
                </div>

                {/* Features Highlight */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                            <Sparkles className="text-[#A3D861]" />
                        </div>
                        <h3 className="text-xl font-bold">AI Coaching</h3>
                        <p className="text-gray-400 text-sm">Personalized AI feedback for every learner, available 24/7.</p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                            <Zap className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold">Rapid Up-skilling</h3>
                        <p className="text-gray-400 text-sm">Targeted learning paths to get your team productive in weeks, not months.</p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                            <Shield className="text-[#0395B2]" />
                        </div>
                        <h3 className="text-xl font-bold">Secure Infrastructure</h3>
                        <p className="text-gray-400 text-sm">SOC 2 Type II compliant platform and advanced data protection.</p>
                    </div>
                </div>

                {/* FAQ Link or Contact */}
                <div className="mt-40 text-center space-y-4 pb-20">
                    <p className="text-gray-400">Not sure which plan is right for you?</p>
                    <button
                        onClick={() => router.push('/demo')}
                        className="text-[#A3D861] font-bold hover:underline"
                    >
                        Talk to an expert →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;




