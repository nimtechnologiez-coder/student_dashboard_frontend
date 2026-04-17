'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    CheckCircle2, 
    Users, 
    ArrowRight, 
    LayoutDashboard, 
    Settings, 
    Mail, 
    ShieldCheck,
    Zap,
    Download
} from 'lucide-react';

const TeamWelcomePage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [teamPlan, setTeamPlan] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            
            // Find the most recent Team plan
            const team = parsed.enrolledCourses?.find(e => e.planType === 'Team');
            if (team) setTeamPlan(team);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#A3D861] opacity-10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0395B2] opacity-10 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl space-y-12 animate-in fade-in zoom-in duration-700">
                
                {/* Success Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#A3D861]/20 rounded-full text-[#A3D861] mb-4 shadow-[0_0_50px_rgba(163,216,97,0.2)]">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black italic tracking-tight">
                        YOU'RE <span className="text-[#A3D861]">IN.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Your organization's learning journey begins now. We've activated your team workspace and allocated your seats.
                    </p>
                </div>

                {/* Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0a0f1a] border border-[#A3D861]/30 rounded-[3rem] p-10 space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
                            <Zap size={120} className="text-[#A3D861]" />
                        </div>
                        <div className="inline-flex px-4 py-1.5 bg-[#A3D861]/10 rounded-full text-[#A3D861] text-[10px] font-black uppercase tracking-widest border border-[#A3D861]/20">
                            Active Subscription
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black">{teamPlan?.course?.title || "Team Access"}</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Full Organization Access</p>
                        </div>
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white">{teamPlan?.seatCount || 5}</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Seats</span>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white">Active</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between shadow-xl">
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold flex items-center gap-3">
                                <ShieldCheck className="text-[#0395B2]" size={24} />
                                Admin Dashboard
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                As the organization admin, you can now invite team members, track their progress, and generate compliance reports.
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="mt-8 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-[#A3D861] transition-all"
                        >
                            Open Dashboard <LayoutDashboard size={18} />
                        </button>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-8 pt-12">
                    <h4 className="text-center text-xs font-black uppercase tracking-[0.3em] text-gray-500 italic">Next Steps</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Mail, title: "Check Email", text: "We've sent a detailed welcome guide to your inbox." },
                            { icon: Users, title: "Invite Team", text: "Add your 5 members from the admin panel." },
                            { icon: Download, title: "Get Receipts", text: "Download your tax invoice from billing." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all group">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#A3D861] group-hover:scale-110 transition-transform">
                                    <step.icon size={24} />
                                </div>
                                <h5 className="font-bold">{step.title}</h5>
                                <p className="text-xs text-gray-500 leading-relaxed">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center pt-8">
                    <button 
                        onClick={() => router.push('/')}
                        className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 mx-auto font-bold uppercase tracking-widest text-[10px]"
                    >
                        Back to Home <ArrowRight size={14} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TeamWelcomePage;
