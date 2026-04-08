'use client';

import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Globe, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseIdFromUrl = searchParams.get('courseId');

    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    // New State for Course Selection
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch Courses and User
    React.useEffect(() => {
        // Get User from LocalStorage
        const storedUser = localStorage.getItem('user'); // Assuming login stores 'user' object
        console.log("PaymentPage: storedUser from localStorage:", storedUser);
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                console.log("PaymentPage: parsed user:", parsed);
                setCurrentUser(parsed);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        } else {
            console.warn("PaymentPage: No user found in localStorage");
        }

        // Fetch Courses
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);

                    // Pre-select course from URL if available
                    if (courseIdFromUrl) {
                        const preSelected = data.find(c => c._id === courseIdFromUrl);
                        if (preSelected) {
                            setSelectedCourse(preSelected);
                        } else if (data.length > 0) {
                            setSelectedCourse(data[0]);
                        }
                    } else if (data.length > 0) {
                        setSelectedCourse(data[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        };
        fetchCourses();
    }, [courseIdFromUrl]);

    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        // Remove '$' and commas, then parse
        const num = parseFloat(priceString.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    const coursePrice = selectedCourse ? parsePrice(selectedCourse.price) : 0;

    const defaultDiscount = 0; // Removing hardcoded discount for clarity, or adjust logic if needed
    const totalAmount = Math.max(0, coursePrice - couponDiscount);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: couponCode, orderAmount: coursePrice })
            });
            const data = await res.json();
            if (res.ok && data.isValid) {
                setCouponDiscount(data.discountAmount);
                setAppliedCoupon(data.coupon);
                setCouponError('');
            } else {
                setCouponError(data.message || 'Invalid coupon');
                setCouponDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error(error);
            setCouponError('Error applying coupon');
        }
    };

    const handlePayment = async () => {
        if (!selectedCourse) {
            alert('Please select a course to pay for.');
            return;
        }
        if (!currentUser) {
            alert('You must be logged in to make a payment.');
            router.push('/login'); // Redirect if not logged in
            return;
        }

        setIsProcessing(true);

        // 1. Simulate Payment Processing Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Call Enroll API
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: currentUser.id || currentUser._id, // Handle both formats
                    courseId: selectedCourse._id,
                    amountPaid: totalAmount
                })
            });

            if (res.ok) {
                alert(`Payment Successful! You are now enrolled in "${selectedCourse.title}".\nPlease log in to access your course.`);
                localStorage.removeItem('user'); // Force re-login
                router.push('/login');
            } else {
                const errData = await res.json();
                alert(`Payment Failed: ${errData.message}`);
            }
        } catch (error) {
            console.error("Enrollment error", error);
            alert('An error occurred during enrollment.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black flex flex-col items-center justify-center p-4">

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0395B2] opacity-10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#A3D861] opacity-5 rounded-full blur-[100px]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Payment Methods & Course Selection */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Course Selection Card */}
                    <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <CheckCircle className="text-[#A3D861]" size={24} />
                            Select Course
                        </h2>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Choose the course you want to enroll in:</label>
                            <select
                                className="w-full bg-[#050a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                onChange={(e) => {
                                    const courseId = e.target.value;
                                    const course = courses.find(c => c._id === courseId);
                                    setSelectedCourse(course);
                                }}
                                value={selectedCourse ? selectedCourse._id : ''}
                            >
                                <option value="" disabled>-- Select a Course --</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.title} (â‚¹{course.price})
                                    </option>
                                ))}
                            </select>
                            {selectedCourse && (
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 mt-2 hidden">
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Lock className="text-[#A3D861]" size={24} />
                            Secure Checkout
                        </h2>

                        <div className="space-y-4">
                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'card' ? 'bg-white/10 border-[#A3D861]' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                                onClick={() => setSelectedMethod('card')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-[#A3D861]' : 'border-gray-500'}`}>
                                    {selectedMethod === 'card' && <div className="w-2.5 h-2.5 bg-[#A3D861] rounded-full"></div>}
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg"><CreditCard size={24} className="text-white" /></div>
                                <div>
                                    <h3 className="font-semibold text-white">Credit / Debit Card</h3>
                                    <p className="text-xs text-gray-400">Visa, Mastercard, Amex</p>
                                </div>
                            </label>

                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'upi' ? 'bg-white/10 border-[#A3D861]' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                                onClick={() => setSelectedMethod('upi')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-[#A3D861]' : 'border-gray-500'}`}>
                                    {selectedMethod === 'upi' && <div className="w-2.5 h-2.5 bg-[#A3D861] rounded-full"></div>}
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg"><Smartphone size={24} className="text-white" /></div>
                                <div>
                                    <h3 className="font-semibold text-white">UPI / QR Code</h3>
                                    <p className="text-xs text-gray-400">Google Pay, PhonePe, Paytm</p>
                                </div>
                            </label>

                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'netbanking' ? 'bg-white/10 border-[#A3D861]' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                                onClick={() => setSelectedMethod('netbanking')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'netbanking' ? 'border-[#A3D861]' : 'border-gray-500'}`}>
                                    {selectedMethod === 'netbanking' && <div className="w-2.5 h-2.5 bg-[#A3D861] rounded-full"></div>}
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg"><Globe size={24} className="text-white" /></div>
                                <div>
                                    <h3 className="font-semibold text-white">Net Banking</h3>
                                    <p className="text-xs text-gray-400">All major banks supported</p>
                                </div>
                            </label>
                        </div>

                        {selectedMethod === 'card' && (
                            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors text-white placeholder:text-gray-600" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors text-white placeholder:text-gray-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">CVC</label>
                                        <input type="text" placeholder="123" className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors text-white placeholder:text-gray-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Cardholder Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#A3D861] transition-colors text-white placeholder:text-gray-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-8">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                        {/* Student Details */}
                        {currentUser && (
                            <div className="mb-6 pb-6 border-b border-white/10 space-y-2">
                                <p className="text-sm text-gray-400">Student Name</p>
                                <p className="font-semibold text-white">{currentUser.fullName}</p>
                                <p className="text-sm text-gray-400 mt-2">Email</p>
                                <p className="font-semibold text-white">{currentUser.email}</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 text-sm">Course Fee</span>
                                <span className="font-semibold">â‚¹{coursePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 text-sm">Processing Fee</span>
                                <span className="font-semibold">â‚¹0.00</span>
                            </div>
                            <div className="flex justify-between items-start text-[#A3D861]">
                                <span className="text-sm">Welcome Offer</span>
                                <span className="font-semibold">-â‚¹{defaultDiscount.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-start text-[#A3D861]">
                                    <span className="text-sm">Coupon ({appliedCoupon.code})</span>
                                    <span className="font-semibold">-â‚¹{couponDiscount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Coupon Input */}
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <label className="text-sm font-medium text-gray-400 mb-2 block">Have a coupon?</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Code"
                                    className="flex-1 bg-[#050a14] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#A3D861] uppercase placeholder-gray-600 outline-none"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-white/10"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                            {appliedCoupon && <p className="text-[#A3D861] text-xs mt-2 flex items-center gap-1"><CheckCircle size={12} /> Coupon Applied!</p>}
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-black text-white">â‚¹{totalAmount.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || !selectedCourse}
                            className="w-full bg-[#A3D861] hover:bg-[#A3D861]/90 text-black font-black text-lg py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(163,216,97,0.39)] hover:shadow-[0_6px_20px_rgba(163,216,97,0.23)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>Processing...</>
                            ) : (
                                <>Pay Now <ArrowRight size={20} /></>
                            )}
                        </button>

                        <div className="mt-6 flex justify-center gap-4 text-gray-500">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-medium">256-bit SSL Secure Payment</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const PaymentPage = () => {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">Loading...</div>}>
            <PaymentContent />
        </React.Suspense>
    );
};

export default PaymentPage;




