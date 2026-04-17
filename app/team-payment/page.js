'use client';

import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, 
    CreditCard, 
    Smartphone, 
    Globe, 
    ArrowRight, 
    CheckCircle, 
    Lock, 
    Users, 
    ChevronLeft, 
    Zap, 
    User,
    BookOpen
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const TeamPaymentPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedCourseId = searchParams.get('courseId');

    const [seats, setSeats] = useState(5);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [hasActiveTeamSubscription, setHasActiveTeamSubscription] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const PRICE_PER_USER = selectedCourse ? (selectedCourse.livePrice || 2000) : 2000;
    const totalAmount = seats * PRICE_PER_USER;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setCurrentUser(parsed);
                
                // Fetch latest user status to check for existing subscription
                const token = localStorage.getItem('token');
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user?email=${parsed.email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.enrolledCourses?.some(e => e.planType === 'Team')) {
                        setHasActiveTeamSubscription(true);
                    }
                });
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                    
                    if (preSelectedCourseId) {
                        const found = data.find(c => c._id === preSelectedCourseId);
                        if (found) setSelectedCourse(found);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, [preSelectedCourseId]);

    const handlePayment = async () => {
        if (!currentUser) {
            alert('You must be logged in to start a team subscription.');
            router.push('/login');
            return;
        }

        if (!selectedCourse) {
            alert('Please select a course for your team first.');
            return;
        }

        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: currentUser.id || currentUser._id,
                    courseId: selectedCourse._id,
                    planType: 'Team',
                    seatCount: seats,
                    amountPaid: totalAmount,
                    isSubscription: true,
                    contactDetails: formData
                })
            });

            if (res.ok) {
                alert(`Team Subscription Successful! ${seats} seats for "${selectedCourse.title}" have been activated.`);
                router.push('/team-welcome');
            } else {
                const errData = await res.json();
                alert(`Subscription Failed: ${errData.message}`);
            }
        } catch (error) {
            console.error("Subscription error", error);
            alert('An error occurred during checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (hasActiveTeamSubscription) {
        return (
            <div className="min-h-screen bg-[#02040a] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#0a0f1a] border border-white/10 rounded-[3rem] p-10 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-[#A3D861]/20 rounded-full flex items-center justify-center text-[#A3D861] mx-auto">
                        <CheckCircle size={40} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">Subscription Active</h2>
                        <p className="text-gray-400">You have already activated a Team Plan with your current email. No further action is required.</p>
                    </div>
                    <button 
                        onClick={() => router.push('/team-welcome')}
                        className="w-full py-4 bg-[#A3D861] text-black font-black rounded-2xl hover:scale-105 transition-all"
                    >
                        Go to Next Step
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black flex flex-col items-center py-12 px-4 relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#0395B2] opacity-10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#A3D861] opacity-5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <button
                        onClick={() => router.push('/team-plan')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Team Plans</span>
                    </button>
                    <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} /> Team Plan Checkout
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Left: Configuration & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Course Selection */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <BookOpen className="text-[#A3D861]" size={24} />
                                1. Select Target Course
                            </h2>
                            
                            {loadingCourses ? (
                                <div className="h-40 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#A3D861]"></div>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {courses.map(course => (
                                        <button
                                            key={course._id}
                                            onClick={() => setSelectedCourse(course)}
                                            className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${selectedCourse?._id === course._id ? 'bg-[#A3D861]/10 border-[#A3D861]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                                                <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold truncate">{course.title}</div>
                                                <div className="text-xs text-gray-500">{course.category}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-[#A3D861]">₹{(course.livePrice || 2000).toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">per seat</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Seat Selection */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                <Users className="text-[#A3D861]" size={24} />
                                2. Configure Your Team
                            </h2>
                            <p className="text-gray-400 mb-8">How many learners will be joining?</p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <div className="space-y-1">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Number of Seats</span>
                                        <div className="text-2xl font-black">{seats} Users</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setSeats(Math.max(2, seats - 1))}
                                            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-colors"
                                        >-</button>
                                        <input 
                                            type="range" 
                                            min="2" 
                                            max="50" 
                                            value={seats} 
                                            onChange={(e) => setSeats(parseInt(e.target.value))}
                                            className="w-32 lg:w-48 accent-[#A3D861]"
                                        />
                                        <button 
                                            onClick={() => setSeats(Math.min(50, seats + 1))}
                                            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-colors"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 3. Contact Information */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <User className="text-[#A3D861]" size={24} />
                                3. Contact Information
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#A3D861] transition-all" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="you@company.com" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#A3D861] transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            placeholder="+91 00000 00000" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#A3D861] transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Payment Method */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Lock className="text-[#A3D861]" size={24} />
                                4. Payment Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {[
                                    { id: 'card', icon: CreditCard, label: 'Card', sub: 'Credit/Debit' },
                                    { id: 'upi', icon: Smartphone, label: 'UPI', sub: 'Scan/Pay' },
                                    { id: 'net', icon: Globe, label: 'Net Banking', sub: 'Direct' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-6 rounded-2xl border transition-all text-left group ${selectedMethod === method.id ? 'bg-[#A3D861]/10 border-[#A3D861]' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                                    >
                                        <method.icon size={24} className={`mb-3 ${selectedMethod === method.id ? 'text-[#A3D861]' : 'text-gray-500'}`} />
                                        <div className="font-bold">{method.label}</div>
                                        <div className="text-xs text-gray-500">{method.sub}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl sticky top-8 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                                
                                {selectedCourse ? (
                                    <div className="mb-6 p-4 bg-[#A3D861]/10 rounded-2xl border border-[#A3D861]/20 animate-in slide-in-from-top duration-300">
                                        <p className="text-xs font-bold text-[#A3D861] uppercase tracking-wider mb-2">Target Course</p>
                                        <p className="text-sm font-bold text-white">{selectedCourse.title}</p>
                                    </div>
                                ) : (
                                    <div className="mb-6 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        Please select a course
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Seats ({seats} users)</span>
                                        <span>₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Course Price</span>
                                        <span>₹{(PRICE_PER_USER).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[#A3D861] text-sm font-bold">
                                        <span>Bulk Discount</span>
                                        <span>-₹0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                        <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Total</div>
                                        <div className="text-3xl font-black text-white">₹{totalAmount.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !selectedCourse}
                                className="w-full bg-[#A3D861] hover:bg-[#A3D861]/90 text-black font-black text-lg py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(163,216,97,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isProcessing ? "Activating..." : <>Activate Team Plan <ArrowRight size={20} /></>}
                            </button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-xs text-gray-400 border border-white/5">
                                    <ShieldCheck className="text-[#A3D861]" size={20} />
                                    <span>Encrypted with 256-bit SSL. Safe & Secure.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(163,216,97,0.3);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default TeamPaymentPage;
