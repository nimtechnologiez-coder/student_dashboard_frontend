'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [simulatedPassword, setSimulatedPassword] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        setSimulatedPassword('');

        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                if (data.simulatedPassword) {
                    setSimulatedPassword(data.simulatedPassword);
                }
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#A3D861] opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#0395B2] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                    <p className="text-gray-400">Enter your email to receive a new password.</p>
                </div>

                <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                    {status === 'success' ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Email Sent!</h3>
                                <p className="text-gray-400 text-sm">{message}</p>
                                {simulatedPassword && (
                                    <div className="mt-4 p-3 bg-black/30 rounded border border-white/5 text-left">
                                        <p className="text-xs text-gray-500 mb-1">Simulated Password (Copy this):</p>
                                        <p className="font-mono text-lg text-[#A3D861] tracking-wider select-all">{simulatedPassword}</p>
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center w-full bg-[#A3D861] text-black font-bold py-3 rounded-xl hover:bg-[#A3D861]/90 transition-all"
                            >
                                Back to Login <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{message}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-[#050a14] border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#A3D861] transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-[#A3D861] hover:bg-[#A3D861]/90 text-black font-black text-lg py-3.5 rounded-xl transition-all shadow-lg shadow-[#A3D861]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Remember your password? <span className="text-[#0395B2]">Log in</span>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
