'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Send, 
    ArrowLeft, 
    Github, 
    Twitter, 
    Linkedin,
    CheckCircle2,
    MessageSquare,
    ChevronRight,
    Sparkles
} from 'lucide-react';

const ContactUsPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsSuccess(true);
                setFormData({ name: '', email: '', organization: '', message: '' });
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to send message');
            }
        } catch (err) {
            console.error('Submission error:', err);
            alert('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black">
            
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-[#A3D861]/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-[#0395B2]/10 blur-[150px] rounded-full"></div>
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                
                {/* Navbar */}
                <nav className="flex justify-between items-center mb-20">
                    <button 
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </button>
                    <div className="h-8 w-auto">
                         <img src="/Nim Academy.png" alt="Nim Academy" className="h-full invert brightness-0" />
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    
                    {/* Left: Content */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#A3D861]/10 border border-[#A3D861]/20 rounded-full text-[#A3D861] text-xs font-black uppercase tracking-widest">
                                <MessageSquare size={14} /> Contact Our Team
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black leading-tight italic">
                                LET'S <br />
                                <span className="text-[#A3D861]">TALK.</span>
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-md">
                                Have questions about our Team Plan, courses, or enterprise solutions? We're here to help you scale your learning.
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: 'Email Us', value: 'hello@nimacademy.com', sub: 'We respond within 24 hours' },
                                { icon: Phone, label: 'Call Us', value: '+91 98765 43210', sub: 'Mon-Fri, 9am - 6pm' },
                                { icon: MapPin, label: 'Visit Us', value: 'Tech Park, Bangalore', sub: 'Innovation Hub, Sector 5' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A3D861] group-hover:bg-[#A3D861] group-hover:text-black transition-all">
                                        <item.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-lg font-bold text-white">{item.value}</p>
                                        <p className="text-xs text-gray-600">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="pt-8 flex gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#A3D861] hover:border-[#A3D861]/30 transition-all">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="relative">
                        {isSuccess ? (
                            <div className="bg-[#0a0f1a] border border-[#A3D861]/30 rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in duration-500 shadow-[0_0_50px_rgba(163,216,97,0.1)]">
                                <div className="w-20 h-20 bg-[#A3D861]/20 rounded-full flex items-center justify-center text-[#A3D861] mx-auto">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold">Message Sent!</h2>
                                    <p className="text-gray-400">Thank you for reaching out. A learning consultant from our team will contact you shortly.</p>
                                </div>
                                <button 
                                    onClick={() => setIsSuccess(false)}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-[3rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                     <Sparkles size={80} className="text-[#A3D861]" />
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Full Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#A3D861] transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Email Address</label>
                                            <input 
                                                required
                                                type="email" 
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#A3D861] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Organization (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Company Name"
                                            value={formData.organization}
                                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#A3D861] transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Your Message</label>
                                        <textarea 
                                            required
                                            rows="4" 
                                            placeholder="Tell us what you're looking for..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#A3D861] transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-[#A3D861] text-black font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(163,216,97,0.3)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Sending...' : <>Send Message <Send size={20} /></>}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Decorative background cards */}
                        <div className="absolute top-10 -right-10 w-full h-full bg-[#0395B2]/20 border border-white/5 rounded-[3rem] -z-10 rotate-3"></div>
                    </div>
                </div>

                {/* FAQ Quick Links */}
                <div className="mt-32 pt-20 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-2xl font-bold">Frequently Asked Questions</h4>
                            <p className="text-gray-500">Quick answers to common inquiries.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Pricing', 'Curriculum', 'Certification', 'Support'].map((link, i) => (
                                <button key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                                    {link} <ChevronRight size={16} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUsPage;
