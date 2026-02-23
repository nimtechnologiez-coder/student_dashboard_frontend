'use client';

import React, { useState } from 'react';
import { Mail, Key, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const PasswordGeneratorPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        setGeneratedPassword('');

        try {
            const response = await fetch('http://localhost:5000/api/admin/generate-password', {
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
                    setGeneratedPassword(data.simulatedPassword);
                }
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to generate password.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0f1a] border border-white/10 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-[#A3D861]">Admin Control</h1>
                    <p className="text-gray-400">Generate password for registered users</p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">User Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter user registered email"
                                className="w-full bg-[#050a14] border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#A3D861] transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-[#0395B2] hover:bg-[#0395B2]/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : <Key size={20} />}
                        Generate & Send Password
                    </button>
                </form>

                {status === 'success' && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                        <div className="flex justify-center mb-2 text-green-500"><CheckCircle /></div>
                        <p className="text-green-400 text-sm font-medium">{message}</p>
                        {generatedPassword && (
                            <div className="mt-3 p-3 bg-black/30 rounded border border-white/5">
                                <p className="text-xs text-gray-500 mb-1">Simulated Password (since no SMTP):</p>
                                <p className="font-mono text-lg tracking-wider text-[#A3D861]">{generatedPassword}</p>
                            </div>
                        )}
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <p className="text-sm">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordGeneratorPage;
