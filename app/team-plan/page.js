'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Users, 
    Check, 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    Sparkles, 
    Award, 
    BarChart3, 
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';

const TeamPlanLandingPage = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubscriber, setIsSubscriber] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };

        const checkSubscription = () => {
            const user = localStorage.getItem('user');
            if (user) {
                const parsed = JSON.parse(user);
                if (parsed.enrolledCourses?.some(e => e.planType === 'Team')) {
                    setIsSubscriber(true);
                }
            }
        };

        fetchCourses();
        checkSubscription();
    }, []);

    const filteredCourses = courses.filter(c => 
        c.status === 'Published' && 
        (c.planType === 'Team' || c.planType === 'Both') && (
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black scroll-smooth">
            
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-[#0395B2]/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-[#A3D861]/10 blur-[150px] rounded-full"></div>
                <div className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10">
                
                {/* Navbar Simple */}
                <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <img src="/Nim Academy.png" alt="Nim Academy" className="h-8 invert brightness-0" />
                    </div>
                    {isSubscriber ? (
                        <button 
                            onClick={() => router.push('/team-welcome')}
                            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            View My Team <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button 
                            onClick={() => router.push('/subscription')}
                            className="px-6 py-2.5 bg-[#A3D861] text-black rounded-full text-sm font-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,216,97,0.3)]"
                        >
                            View All Plans
                        </button>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black uppercase tracking-widest">
                            <Zap size={14} /> Team Subscription Plans
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                            Level Up <br />
                            <span className="bg-gradient-to-r from-[#A3D861] via-[#0395B2] to-[#A3D861] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">As a Team.</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                            Empower your workforce with access to world-class learning. 
                            From AI and Cloud to Leadership and Design, we have everything your team needs to succeed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('courses-shelf');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-[#A3D861] transition-all flex items-center justify-center gap-3 group"
                            >
                                Start Team Subscription <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex flex-col justify-center px-6">
                                <span className="text-2xl font-black text-white">₹2,000</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Starting price / user</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#02040a] bg-gray-800 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=U${i}&background=random`} alt="Avatar" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-500">Trusted by <span className="text-white font-bold">500+</span> organizations worldwide</p>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative z-10 bg-[#0a0f1a] border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-20">
                               <Sparkles size={100} className="text-[#A3D861]" />
                           </div>
                           <h3 className="text-2xl font-bold mb-8">What's Included:</h3>
                           <ul className="space-y-6">
                               {[
                                   { icon: Zap, text: "Access to 13,000+ top courses", sub: "Curated for industry relevance" },
                                   { icon: Award, text: "Certification preparation", sub: "Prep for AWS, Google, and more" },
                                   { icon: Sparkles, text: "AI-powered coaching", sub: "Personalized feedback for every learner" },
                                   { icon: BarChart3, text: "Analytics and adoption reports", sub: "Track your team's progress in real-time" },
                                   { icon: ShieldCheck, text: "2 to 50 people - For your team", sub: "Scalable organization management" }
                               ].map((feat, i) => (
                                   <li key={i} className="flex gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A3D861] shrink-0">
                                           <feat.icon size={20} />
                                       </div>
                                       <div>
                                           <p className="font-bold text-white">{feat.text}</p>
                                           <p className="text-xs text-gray-500">{feat.sub}</p>
                                       </div>
                                   </li>
                               ))}
                           </ul>
                           <div className="mt-10 pt-10 border-t border-white/5">
                               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Billed annually. Cancel anytime.</p>
                           </div>
                        </div>
                        {/* Decorative cards behind */}
                        <div className="absolute top-10 -right-10 w-full h-full bg-[#0395B2]/20 border border-white/5 rounded-[3rem] -z-10 rotate-3"></div>
                        <div className="absolute top-20 -left-10 w-full h-full bg-[#A3D861]/10 border border-white/5 rounded-[3rem] -z-20 -rotate-3"></div>
                    </div>
                </section>

                {/* Course Shelf Section */}
                <section id="courses-shelf" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black">Choose a Course for Your Team</h2>
                            <p className="text-gray-400 max-w-xl">Select a target course to activate seats for your organization. You'll get bulk pricing and full admin visibility.</p>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search courses..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-[#A3D861] transition-all"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A3D861]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <div key={course._id} className="bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-[#A3D861]/30 transition-all flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#A3D861]">
                                            {course.category}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => <Sparkles key={i} size={12} fill={i < Math.floor(course.rating || 4.5) ? "currentColor" : "none"} />)}
                                            </div>
                                            <span className="text-xs text-gray-500">({course.students || 1200} learners)</span>
                                        </div>
                                        
                                        <div className="mt-auto space-y-6">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Per User Cost</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-black text-white">₹{(course.livePrice || 2000).toLocaleString()}</span>
                                                        <span className="text-xs text-gray-500 line-through">₹{(course.originalPrice || course.livePrice * 2).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-[#A3D861] font-black uppercase tracking-widest">Team Savings</p>
                                                    <p className="text-xs font-bold text-gray-400">Up to 40% Off</p>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => router.push(`/team-payment?courseId=${course._id}`)}
                                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-[#A3D861] hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(163,216,97,0.2)]"
                                            >
                                                Buy for Team <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Footer Section */}
                <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-sm mb-4">&copy; 2026 Nim Academy. All Rights Reserved.</p>
                    <div className="flex justify-center gap-8">
                        <span className="text-xs text-gray-600 hover:text-white cursor-pointer px-4">Privacy Policy</span>
                        <span className="text-xs text-gray-600 hover:text-white cursor-pointer px-4 border-l border-white/5">Terms of Service</span>
                        <span className="text-xs text-gray-600 hover:text-white cursor-pointer px-4 border-l border-white/5">Contact Sales</span>
                    </div>
                </footer>
            </div>
            
            <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default TeamPlanLandingPage;
