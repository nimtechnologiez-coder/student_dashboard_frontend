'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, CheckCircle, Play, Star } from 'lucide-react';

const Learnmores = () => {
    // User State
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black">

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#0395B2] opacity-10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#A3D861] opacity-5 rounded-full blur-[100px]"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A3D861] to-[#0395B2]">
                        Nim Academy
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/courses" className="text-gray-300 hover:text-white transition-colors font-medium hidden md:block">
                            Browse Courses
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-white font-medium">Welcome, {user.fullName.split(' ')[0]}</span>
                                <Link
                                    href="/dashboard"
                                    className="px-6 py-2.5 bg-[#A3D861] border border-[#A3D861] rounded-xl hover:bg-[#b5e675] transition-all font-bold text-black shadow-[0_0_20px_-5px_rgba(163,216,97,0.3)]"
                                >
                                    My Dashboard
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-medium hidden md:block">
                                    Login
                                </Link>
                                <Link href="/register">
                                    <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-white backdrop-blur-sm">
                                        Get Started
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-[#A3D861] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3D861] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3D861]"></span>
                        </span>
                        New Courses Available
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3D861] via-[#ffffff] to-[#0395B2]">
                            Future Skills
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Join thousands of learners unlocking their potential with our premium, expert-led courses. Start your journey to mastery today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 bg-[#A3D861] text-black text-lg font-bold rounded-xl hover:bg-[#b5e675] transition-all flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(163,216,97,0.3)] hover:shadow-[0_0_60px_-10px_rgba(163,216,97,0.4)]"
                            >
                                Go to Dashboard <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link href="/courses">
                                    <button className="px-8 py-4 bg-[#A3D861] text-black text-lg font-bold rounded-xl hover:bg-[#b5e675] transition-all flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(163,216,97,0.3)] hover:shadow-[0_0_60px_-10px_rgba(163,216,97,0.4)]">
                                        Browse All Courses <ArrowRight size={20} />
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="px-8 py-4 bg-[#0a0f1a] border border-white/10 text-white text-lg font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                                        Create Free Account
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-10 animate-in fade-in duration-1000 delay-500">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">10k+</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Students</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">50+</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Courses</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">100+</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Instructors</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">4.9</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEATURES SECTION --- */}
            <div className="py-24 bg-[#050a14] relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-[#0a0f1a] border border-white/5 hover:border-[#A3D861]/30 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-[#A3D861]/10 flex items-center justify-center text-[#A3D861] mb-6 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Expert Instructors</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Learn from industry veterans who have worked at top tech companies. Real-world experience, not just theory.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-[#0a0f1a] border border-white/5 hover:border-[#0395B2]/30 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-[#0395B2]/10 flex items-center justify-center text-[#0395B2] mb-6 group-hover:scale-110 transition-transform">
                                <Play size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Interactive Learning</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Don't just watch. Code along with our interactive assignments, quizzes, and real-time feedback systems.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-[#0a0f1a] border border-white/5 hover:border-[#A3D861]/30 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A3D861]/10 to-[#0395B2]/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <Award size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Certified Growth</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Earn recognized certificates upon completion. Showcase your skills to employers and grow your career.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CTA SECTION --- */}
            <div className="py-24 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to start your journey?
                    </h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join our community of lifelong learners and take the first step towards mastering your dream skills.
                    </p>
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="inline-block px-10 py-5 bg-white text-black text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link href="/register">
                            <button className="px-10 py-5 bg-white text-black text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 active:scale-95">
                                Get Started Now
                            </button>
                        </Link>
                    )}
                </div>

                {/* Decorative BG */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#A3D861]/10 to-[#0395B2]/10 rounded-full blur-[100px] -z-10"></div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="border-t border-white/5 bg-[#050a14] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Nim Academy
                    </Link>
                    <div className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Nim Academy. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Learnmores;
