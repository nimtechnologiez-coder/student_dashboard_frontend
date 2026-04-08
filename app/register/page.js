'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
// emailjs is not installed in this project, so we might need to install it or mock it.
// For now, I'll comment out emailjs imports and logic to ensure build success, 
// and we can add it back if the user wants it.
import emailjs from '@emailjs/browser';

const RegisterPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Details, 2: Email OTP, 3: Phone OTP, 4: Success
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        emailOtp: '',
        mobileOtp: ''
    });
    const [generatedEmailOtp, setGeneratedEmailOtp] = useState('');
    // const [generatedMobileOtp, setGeneratedMobileOtp] = useState(''); // Unused for now

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendEmailOtp = () => {
        const otp = generateOTP();
        setGeneratedEmailOtp(otp);

        // --- EMAILJS INTEGRATION (Pending Installation) ---
        // To enable this, run: npm install @emailjs/browser

        const serviceId = 'service_zoy1mq4';
        const templateId = 'template_5gmflbk';
        const publicKey = 'EbOEYm_p9mJDEE5nK';

        const templateParams = {
            to_name: formData.fullName,
            to_email: formData.email,
            otp: otp,
        };

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert(`OTP sent to ${formData.email}`);
                setStep(2);
            }, (error) => {
                console.error('FAILED...', error);
                alert(`Failed to send OTP. Error: ${error.text || JSON.stringify(error)}. check console for details.`);
            });

    };

    const handleNextStep = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (formData.fullName && formData.email && formData.mobile && formData.password && formData.confirmPassword) {
                if (formData.password !== formData.confirmPassword) {
                    alert("Passwords do not match!");
                    return;
                }
                sendEmailOtp();
            } else {
                alert("Please fill in all details.");
            }
        } else if (step === 2) {
            if (formData.emailOtp === generatedEmailOtp) {
                // Register immediately after Email verification
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            fullName: formData.fullName,
                            email: formData.email,
                            mobile: formData.mobile,
                            password: formData.password,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Registration Successful:', data);

                        // AUTO-LOGIN: Save user data and token to localStorage
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('token', data.token);

                        setStep(3); // Move to Success directly (skipping Phone OTP)
                    } else {
                        // Attempt to parse error message
                        let errorMessage = "Failed to register.";
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) { }

                        console.error('Registration Failed:', response.statusText);
                        alert(errorMessage);
                    }
                } catch (error) {
                    console.error("Error registering:", error);
                    alert("An error occurred connecting to the server. Please try again.");
                }
            } else {
                alert("Invalid Email OTP. Please try again.");
            }
        }
    };

    const renderStep1 = () => (
        <div className="form-step">
            <h2>Student Registration</h2>
            <p className="step-desc">Enter your details to begin.</p>
            <div className="form-group">
                <label><User size={16} /> Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />
            </div>
            <div className="form-group">
                <label><Mail size={16} /> Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                />
            </div>
            <div className="form-group">
                <label><Smartphone size={16} /> Mobile Number</label>
                <div className="mobile-input">
                    <span className="flag">Ã°Å¸â€¡Â®Ã°Å¸â€¡Â³ +91</span>
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="9876543210"
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                />
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                />
            </div>
            <button onClick={handleNextStep} className="submit-btn" type="button">
                Next <ArrowRight size={18} />
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h2>Verify Email</h2>
            <p className="step-desc">Enter the OTP sent to <strong>{formData.email}</strong></p>
            <div className="form-group">
                <label>Email OTP</label>
                <input
                    type="text"
                    name="emailOtp"
                    value={formData.emailOtp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                />
            </div>
            <button onClick={handleNextStep} className="submit-btn" disabled={formData.emailOtp.length !== 6} type="button">
                Verify Email <ArrowRight size={18} />
            </button>
            <button className="link-btn" onClick={() => setStep(1)} type="button">Change Email</button>
        </div>
    );

    const renderStep4 = () => (
        <div className="form-step success-step">
            <CheckCircle size={64} color="#a855f7" />
            <h2>Account Created!</h2>
            <p>Your student portal account has been successfully verified and created.</p>
            <button className="submit-btn" onClick={() => router.push('/payment')} type="button">
                Proceed to Payment <ArrowRight size={18} />
            </button>
        </div>
    );

    return (
        <div className="register-container bg-[#f1f5f9] min-h-screen">
            <div className="register-card bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <div className="card-header text-center mb-8">
                    <div className="app-branding flex items-center justify-center gap-3 mb-3">
                        <div className="logo-icon w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md"></div>
                        <h1 className="text-2xl font-bold text-slate-900 m-0">Student Portal</h1>
                    </div>
                    <p className="card-subtitle text-slate-500 m-0">Create your account to get started</p>
                </div>

                <div className="step-indicator flex items-center justify-between mb-10 relative px-2">
                    <div className={`step-item flex flex-col items-center gap-2 z-10 bg-white ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className={`step-circle w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${step >= 1 ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-100 text-slate-400 bg-slate-100'} ${step > 1 ? 'bg-blue-600 border-blue-600 text-white' : ''}`}>
                            {step > 1 ? <CheckCircle size={14} /> : 1}
                        </div>
                        <span className={`text-xs font-medium tracking-wider uppercase ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>Details</span>
                    </div>
                    <div className="step-connector absolute top-4 left-10 right-10 h-0.5 bg-slate-100 z-0"></div>
                    <div className={`step-item flex flex-col items-center gap-2 z-10 bg-white ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className={`step-circle w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${step >= 2 ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-100 text-slate-400 bg-slate-100'} ${step > 2 ? 'bg-blue-600 border-blue-600 text-white' : ''}`}>
                            {step > 2 ? <CheckCircle size={14} /> : 2}
                        </div>
                        <span className={`text-xs font-medium tracking-wider uppercase ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>Email</span>
                    </div>
                    <div className="step-connector absolute top-4 left-10 right-10 h-0.5 bg-slate-100 z-0"></div>
                    <div className={`step-item flex flex-col items-center gap-2 z-10 bg-white ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                        <div className={`step-circle w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${step >= 3 ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-100 text-slate-400 bg-slate-100'} ${step > 3 ? 'bg-blue-600 border-blue-600 text-white' : ''}`}>
                            {step > 3 ? <CheckCircle size={14} /> : 3}
                        </div>
                        <span className={`text-xs font-medium tracking-wider uppercase ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>Success</span>
                    </div>
                </div>

                <div className="form-content">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep4()}
                    </form>
                </div>
            </div>

            <div className="register-footer text-center mt-6">
                <p className="text-slate-400 text-xs mb-3">&copy; 2024 Student Portal. All rights reserved.</p>
                <div className="footer-links flex gap-5 justify-center">
                    <a href="#" className="text-slate-500 hover:text-slate-900 text-xs font-medium no-underline transition-colors">Privacy</a>
                    <a href="#" className="text-slate-500 hover:text-slate-900 text-xs font-medium no-underline transition-colors">Terms</a>
                    <a href="#" className="text-slate-500 hover:text-slate-900 text-xs font-medium no-underline transition-colors">Help</a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;




