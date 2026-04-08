'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status === 'error') setStatus('idle');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                // Store user data in localStorage (User session)
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                // Set cookie for Next.js middleware
                document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=2592000`; // 30 days

                setTimeout(() => {
                    router.push('/'); // Redirect to Home/Dashboard
                }, 1000);
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Login failed.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0395B2] opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#A3D861] opacity-5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue your learning journey</p>
                </div>

                <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Error Message */}
                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
                                <AlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#A3D861] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="w-full bg-[#050a14] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-[#A3D861] focus:ring-1 focus:ring-[#A3D861] transition-all text-white placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-[#0395B2] hover:text-[#A3D861] transition-colors">Forgot Password?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#A3D861] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                        className="w-full bg-[#050a14] border border-white/10 rounded-xl pl-10 pr-12 py-3.5 focus:outline-none focus:border-[#A3D861] focus:ring-1 focus:ring-[#A3D861] transition-all text-white placeholder:text-gray-600"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full bg-[#A3D861] hover:bg-[#A3D861]/90 text-black font-black text-lg py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(163,216,97,0.39)] hover:shadow-[0_6px_20px_rgba(163,216,97,0.23)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : status === 'success' ? (
                                <>Success! Redirecting...</>
                            ) : (
                                <>Sign In <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-[#0395B2] hover:text-[#A3D861] font-semibold transition-colors">
                        Create an account
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;




