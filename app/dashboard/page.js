'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    BookOpen,
    Award,
    Play,
    LogOut,
    User,
    Settings,
    Bell,
    Mail,
    Phone,
    Shield,
    FileText,
    Printer,
    Clock,
    Sun,
    Moon,
    Radio,
    Calendar,
    Download,
    ArrowLeft,
    Menu,
    X,
    Flame,
    Lock
} from 'lucide-react';

const StudentDashboardContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // User & Data State
    const [user, setUser] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('courses');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Theme State
    const [theme, setTheme] = useState('dark');
    // Gamification State
    const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
    const [achievements, setAchievements] = useState([]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // System Announcement State
    const [systemAnnouncement, setSystemAnnouncement] = useState('');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch System Announcement
                let announcementMessage = '';
                const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/announcement', { headers });
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setSystemAnnouncement(data.message || '');
                    announcementMessage = data.message || '';
                }

                // Fetch User Data
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    router.push('/login`);
                    return;
                }

                const parsedUser = JSON.parse(storedUser);
                const email = parsedUser.email;

                const userRes = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/user?email=${email}`, { headers });
                if (userRes.ok) {
                    const data = await userRes.json();
                    setUser(data);

                    // Fetch Gamification Data
                    try {
                        const statsRes = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/gamification/stats/${email}`, { headers });
                        if (statsRes.ok) {
                            const stats = await statsRes.json();
                            setStreakData({ currentStreak: stats.currentStreak, longestStreak: stats.longestStreak });
                            setAchievements(stats.achievements || []);
                        }

                        // Log daily login activity
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gamification/log-activity', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization`: `Bearer ${token}`
                            },
                            body: JSON.stringify({ email, type: 'login' })
                        });
                    } catch (err) {
                        console.error("Gamification fetch failed:", err);
                    }

                    // Filter out valid enrollments that have course data
                    const validEnrollments = data.enrolledCourses?.filter(enrollment => enrollment.course) || [];
                    setEnrolledCourses(validEnrollments);

                    // Initialize notifications with static/system ones
                    const initialNotifications = [];
                    if (announcementMessage) { // Use the captured announcement message
                        initialNotifications.push({
                            id: 'sys-announcement',
                            title: 'ðŸ“¢ System Announcement',
                            message: announcementMessage,
                            time: 'Just now',
                            type: 'system'
                        });
                    }

                    // Check for expiring courses
                    validEnrollments.forEach(enrollment => {
                        let expiry = enrollment.expiryDate ? new Date(enrollment.expiryDate) : null;
                        const validity = enrollment.course?.validity;

                        if (!expiry && validity && enrollment.enrolledAt) {
                            expiry = new Date(new Date(enrollment.enrolledAt).getTime() + validity * 24 * 60 * 60 * 1000);
                        }

                        if (expiry) {
                            const now = new Date();
                            const diffTime = expiry - now;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays <= 10 && diffDays >= 0) {
                                initialNotifications.push({
                                    id: `expiry-${enrollment.course._id}`,
                                    title: 'Validity Expiring Soon',
                                    message: `Your access to "${enrollment.course.title}" expires in ${diffDays} days!`,
                                    time: 'Action Required',
                                    type: 'warning'
                                });
                            }
                        }
                    });
                    setNotifications(initialNotifications);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        mobile: ''
    });

    const handlePrint = () => {
        window.print();
    };

    const handleEditClick = () => {
        setEditForm({
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/users/${user._id || user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('An error occurred while saving.');
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#02040a] text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A3D861]"></div>
            </div>
        );
    }

    if (!user) return null;

    // --- Tab Content Renderers ---

    const renderMyLearning = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {user.enrolledCourses && Array.isArray(user.enrolledCourses) && user.enrolledCourses.length > 0 ? (
                user.enrolledCourses.map((enrollment, index) => (
                    <DashboardCourseCard key={index} enrollment={enrollment} theme={theme} />
                ))
            ) : (
                <div className={`col-span-full text-center py-20 border rounded-2xl ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/5' : 'bg-white border-gray-200'}`}>
                    <BookOpen size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No courses yet</h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Start your learning journey today.</p>
                    <button
                        onClick={() => router.push('/courses')}
                        className="px-6 py-3 bg-[#A3D861] text-black font-bold rounded-xl hover:bg-[#A3D861]/90 transition-colors"
                    >
                        Browse Courses
                    </button>
                </div>
            )}
        </div>
    );

    const handleRequestCertificate = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/certificate/request', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ userId: user._id || user.id, courseId })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Certificate requested! Admin will approve shortly.`);
                // Refresh user data
                const userRes = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/users/${user._id || user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userRes.ok) {
                    const updatedUser = await userRes.json();
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            } else {
                alert(data.message || 'Request failed');
            }
        } catch (error) {
            console.error("Error requesting certificate:", error);
            alert('Error requesting certificate');
        }
    };

    const renderCertificates = () => {
        const completedCourses = (user.enrolledCourses && Array.isArray(user.enrolledCourses)) ? user.enrolledCourses.filter(e => e.progress === 100) : [];

        return (
            <div className="space-y-6 print:w-full print:absolute print:top-0 print:left-0 print:bg-white print:z-50">
                <h2 className={`text-2xl font-bold mb-4 print:hidden ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Certificates</h2>

                {completedCourses.length === 0 ? (
                    <div className={`p-8 text-center border rounded-2xl ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
                        <Award size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No Certificates Yet</h3>
                        <p>Complete a course to unlock your certificate of achievement.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 print:hidden">
                        {completedCourses.map((enrollment, index) => (
                            <div key={index} className={`p-6 border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${enrollment.certificateStatus === 'Approved' ? 'bg-[#A3D861]/20 text-[#A3D861]' : 'bg-gray-500/20 text-gray-500'}`}>
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{enrollment.course ? enrollment.course.title : 'Course Title'}</h3>
                                        <p className="text-sm text-gray-500">Completed on: {new Date(enrollment.lastAccessed || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    {!enrollment.certificateStatus || enrollment.certificateStatus === 'Not Started' ? (
                                        <button
                                            onClick={() => handleRequestCertificate(enrollment.course._id)}
                                            className="px-6 py-2 bg-[#0395B2] text-white font-bold rounded-lg hover:bg-[#0395B2]/90 transition-colors"
                                        >
                                            Request Certificate
                                        </button>
                                    ) : enrollment.certificateStatus === 'Pending' ? (
                                        <span className="px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg font-bold text-sm">
                                            Pending Approval
                                        </span>
                                    ) : enrollment.certificateStatus === 'Rejected' ? (
                                        <span className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-bold text-sm">
                                            Request Rejected
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                // Open print view (toggle simple state for now or scroll to view)
                                                const certView = document.getElementById(`cert-view-${index}`);
                                                if (certView) certView.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="px-6 py-2 bg-[#A3D861] text-black font-bold rounded-lg hover:bg-[#A3D861]/90 transition-colors flex items-center gap-2"
                                        >
                                            <Printer size={16} /> View & Print
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actual Certificate Views (Hidden unless approved) */}
                {completedCourses.map((enrollment, index) => (
                    enrollment.certificateStatus === 'Approved' && (
                        <div key={`cert-${index}`} id={`cert-view-${index}`} className={`mt-12 border rounded-2xl p-8 text-center print:border-none print:p-0 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>

                            {enrollment.certificateUrl ? (
                                // 1. Show Uploaded Certificate
                                <div className="space-y-6">
                                    <div className="w-20 h-20 mx-auto bg-[#A3D861]/20 rounded-full flex items-center justify-center text-[#A3D861] mb-4">
                                        <Award size={40} />
                                    </div>
                                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Your Certificate is Ready!
                                    </h3>
                                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        You have successfully completed <strong>{enrollment.course ? enrollment.course.title : 'the course'}</strong>.
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                                        <a
                                            href={enrollment.certificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-8 py-4 bg-[#A3D861] text-black font-bold rounded-xl hover:bg-[#A3D861]/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#A3D861]/20"
                                        >
                                            <Download size={20} /> Download Certificate
                                        </a>
                                    </div>

                                    {/* Optional: Preview if it's an image */}
                                    {enrollment.certificateUrl.match(/\.(jpeg|jpg|gif|png)$/i) && (
                                        <div className="mt-8 border-4 border-white/10 rounded-xl overflow-hidden max-w-2xl mx-auto shadow-2xl">
                                            <img src={enrollment.certificateUrl} alt="Certificate Preview" className="w-full" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // 2. Fallback to Generic HTML Certificate (Legacy)
                                <div>
                                    <div className="relative max-w-3xl mx-auto border-[10px] border-[#A3D861]/20 bg-white text-black p-10 font-serif shadow-2xl print:shadow-none">
                                        {/* Watermark */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-gray-200 -rotate-45 pointer-events-none select-none opacity-50">
                                            CERTIFIED
                                        </div>

                                        <div className="absolute top-0 left-0 w-full h-full border-2 border-[#A3D861] m-2 pointer-events-none"></div>

                                        <div className="text-center space-y-6 relative z-10">
                                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#0395B2] to-[#A3D861] rounded-full flex items-center justify-center text-white">
                                                <Award size={32} />
                                            </div>
                                            <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900">Certificate of Completion</h1>
                                            <p className="text-lg text-gray-600">This is to certify that</p>

                                            <p className="text-3xl font-bold text-[#0395B2] border-b-2 border-gray-300 inline-block px-10 pb-2">
                                                {user.fullName}
                                            </p>

                                            <p className="text-lg text-gray-600">has successfully completed the course</p>
                                            <p className="text-2xl font-bold text-gray-900">{enrollment.course ? enrollment.course.title : 'Course'}</p>
                                            <div className="flex justify-between items-end mt-12 px-10">
                                                <div className="text-center">
                                                    <div className="w-32 border-b border-gray-400 mb-2"></div>
                                                    <p className="text-sm font-bold text-gray-600">Sign of Instructor</p>
                                                </div>
                                                <div className="w-20 h-20">
                                                    <div className="w-full h-full rounded-full border-4 border-[#A3D861] flex items-center justify-center text-[#A3D861] font-bold text-xs rotate-[-15deg]">
                                                        NIM ACADEMY
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-mono text-sm mb-2">{new Date().toLocaleDateString()}</p>
                                                    <div className="w-32 border-b border-gray-400 mb-2"></div>
                                                    <p className="text-sm font-bold text-gray-600">Date</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 print:hidden">
                                        <button
                                            onClick={handlePrint}
                                            className="px-6 py-3 bg-[#0395B2] text-white font-bold rounded-xl hover:bg-[#0395B2]/90 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <Printer size={20} /> Print Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ))
                }
            </div>
        );
    };

    const renderProfile = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Profile</h2>
            <div className={`border rounded-2xl p-6 lg:p-8 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] p-[3px] mb-4">
                        <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt="Profile" className={`rounded-full w-full h-full object-cover border-4 ${theme === 'dark' ? 'border-[#0a0f1a]' : 'border-white'}`} />
                    </div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.fullName}</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                </div>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="group">
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
                        <div className={`flex items-center gap-3 border rounded-xl p-3 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                            <User size={18} className="text-[#A3D861]" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    className={`bg-transparent border-none outline-none w-full placeholder-gray-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                />
                            ) : (
                                <span>{user.fullName}</span>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
                        <div className={`flex items-center gap-3 border rounded-xl p-3 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                            <Mail size={18} className="text-[#A3D861]" />
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className={`bg-transparent border-none outline-none w-full placeholder-gray-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                />
                            ) : (
                                <span>{user.email}</span>
                            )}
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="group">
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Mobile Number</label>
                        <div className={`flex items-center gap-3 border rounded-xl p-3 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                            <Phone size={18} className="text-[#A3D861]" />
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editForm.mobile}
                                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                    className={`bg-transparent border-none outline-none w-full placeholder-gray-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                />
                            ) : (
                                <span>{user.mobile}</span>
                            )}
                        </div>
                    </div>

                    {/* Member Since (Non-editable) */}
                    <div className="group">
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</label>
                        <div className={`flex items-center gap-3 border rounded-xl p-3 opacity-60 cursor-not-allowed ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                            <Clock size={18} className="text-[#A3D861]" />
                            <span>{new Date(user.registeredAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        {isEditing && <p className="text-xs text-gray-500 mt-1 ml-1">* Cannot be edited</p>}
                    </div>
                </div>

                <div className={`mt-8 pt-6 border-t flex gap-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 py-3 bg-[#A3D861] text-black font-bold rounded-xl hover:bg-[#A3D861]/90 transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className={`flex-1 py-3 font-bold rounded-xl transition-colors border ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10 border-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200'}`}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            className={`w-full py-3 font-bold rounded-xl transition-colors border ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10 border-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200'}`}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Account Settings</h2>

            <div className={`border rounded-2xl overflow-hidden divide-y ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10 divide-white/5' : 'bg-white border-gray-200 divide-gray-100 shadow-sm'}`}>

                {/* Theme Switcher */}
                <div className={`p-6 flex items-center justify-between transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                            <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Appearance
                            </h4>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Switch between Light and Dark mode</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                    >
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                </div>

                <div className={`p-6 flex items-center justify-between transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Shield size={20} /></div>
                        <div>
                            <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Change Password</h4>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Update your account password</p>
                        </div>
                    </div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Coming Soon</div>
                </div>

                <div className={`p-6 flex items-center justify-between transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><Bell size={20} /></div>
                        <div>
                            <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h4>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Manage email alerts</p>
                        </div>
                    </div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>On</div>
                </div>

                <div className={`p-6 flex items-center justify-between transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500/20 p-2 rounded-lg text-red-400"><LogOut size={20} /></div>
                        <div>
                            <h4 className="font-bold text-red-400">Delete Account</h4>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Permanently remove your data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'recorded':
                return renderMyLearning();
            case 'certificates':
                return renderCertificates();
            case 'profile':
                return renderProfile();
            case 'settings':
                return renderSettings();
            default:
                return renderMyLearning();
        }
    };


    return (
        <div className={`min-h-screen font-sans selection:bg-[#A3D861] selection:text-black flex transition-colors duration-300 ${theme === 'dark' ? 'bg-[#02040a] text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* --- SIDEBAR BACKDROP (Mobile) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- SIDEBAR --- */}
            <aside className={`
                w-64 border-r flex flex-col fixed h-full z-40 transition-all duration-300 print:hidden
                ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/5' : 'bg-white border-gray-200'}
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A3D861] to-[#0395B2]">
                        Nim Academy
                    </h1>
                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem
                        icon={<BookOpen size={20} />}
                        label="My Learning"
                        active={activeTab === 'recorded'}
                        onClick={() => { setActiveTab('recorded'); setSidebarOpen(false); }}
                        theme={theme}
                    />
                    <NavItem
                        icon={<Award size={20} />}
                        label="Certificates"
                        active={activeTab === 'certificates'}
                        onClick={() => { setActiveTab('certificates'); setSidebarOpen(false); }}
                        theme={theme}
                    />
                    <NavItem
                        icon={<User size={20} />}
                        label="Profile"
                        active={activeTab === 'profile'}
                        onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                        theme={theme}
                    />
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                        theme={theme}
                    />
                </nav>

                <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                    <button
                        onClick={() => router.push('/')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full mb-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            router.push('/');
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 print:m-0 print:p-0">



                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Mobile Toggle Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={`lg:hidden p-2.5 border rounded-xl transition-colors ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10 text-gray-400 hover:bg-white/5 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Welcome back, {user.fullName.split(' ')[0]}! ðŸ‘‹</h2>
                            {activeTab === 'learning' && (
                                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>You have {user.enrolledCourses?.length || 0} active courses.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2.5 border rounded-full transition-colors relative ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10 text-gray-400 hover:bg-white/5 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <Bell size={20} />
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0f1a]"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl overflow-hidden z-50 border animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                    <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} flex justify-between items-center`}>
                                        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                                        <span className="text-xs font-medium px-2 py-1 bg-[#A3D861]/20 text-[#A3D861] rounded-full">3 New</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className={`p-4 border-b last:border-0 transition-colors cursor-pointer ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}>
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'info' ? 'bg-blue-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-[#A3D861]'}`}></div>
                                                    <div>
                                                        <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{notif.title}</p>
                                                        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{notif.message}</p>
                                                        <p className="text-[10px] text-gray-500">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`p-3 text-center border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                        <button className="text-sm text-[#A3D861] hover:underline">Mark all as read</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            onClick={() => setActiveTab('profile')}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] p-[2px] cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt="Profile" className="rounded-full w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                {/* Gamification Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 overflow-hidden">
                    {/* Streak Card */}
                    <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'} relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/4 -translate-y-1/4 rotate-12">
                            <Flame size={180} fill="#A3D861" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#A3D861]/20 rounded-2xl flex items-center justify-center text-[#A3D861] shadow-lg shadow-[#A3D861]/10">
                                    <Flame size={28} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Learning Streak</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{streakData.currentStreak}</span>
                                        <span className="text-sm font-bold text-[#A3D861]">DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter">
                                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Next Goal: 7 Days</span>
                                    <span className="text-[#A3D861]">{Math.round(Math.min(100, (streakData.currentStreak / 7) * 100))}%</span>
                                </div>
                                <div className={`w-full h-2.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                    <div
                                        className="h-full bg-gradient-to-r from-[#A3D861] via-[#8BC34A] to-[#A3D861] bg-[length:200%_auto] animate-gradient transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (streakData.currentStreak / 7) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} italic`}>
                                    {streakData.currentStreak > 0 ? "You're on fire! Keep it up." : "Start learning today to begin your streak!"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Achievements Summary */}
                    <div className={`lg:col-span-2 p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                                    <Award size={22} />
                                </div>
                                <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Achievements</h3>
                            </div>
                            <span className="text-xs font-black bg-[#A3D861]/10 text-[#A3D861] px-4 py-1.5 rounded-full border border-[#A3D861]/20 shadow-sm">
                                {achievements.length} UNLOCKED
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.length > 0 ? achievements.map((ach, idx) => (
                                <div key={idx} className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] cursor-default active:scale-95 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-[#A3D861]/30' : 'bg-gray-50 border-gray-100 hover:border-[#0395B2]/30'} flex items-center gap-4`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${theme === 'dark' ? 'bg-black/40 text-[#A3D861]' : 'bg-white text-[#0395B2]'}`}>
                                        <Award size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-black truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{ach.title}</p>
                                        <p className={`text-[10px] font-medium line-clamp-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{ach.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className={`col-span-full py-10 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-2">
                                        <Lock size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-500">No achievements earned yet</p>
                                    <p className="text-[10px] text-gray-400">Complete your first lesson to earn a badge!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {renderContent()}
                </div>

            </main>
        </div>
    );
};

// --- Sub-Components (Internal for now) ---

const NavItem = ({ icon, label, active, onClick, theme }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all ${active ? 'bg-[#A3D861] text-black font-bold' : (theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900')}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const DashboardCourseCard = ({ enrollment, theme }) => {
    const router = useRouter();
    const course = enrollment.course;

    // Handle cases where course data might be missing (deleted course)
    if (!course) return null;

    const progress = enrollment.progress || 0;

    return (
        <div className={`border rounded-2xl overflow-hidden transition-all group ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10 hover:border-[#A3D861]/30' : 'bg-white border-gray-200 hover:border-[#A3D861] shadow-sm'}`}>
            {/* Image Area */}
            <div className="relative h-40 bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0395B2]/20 to-[#A3D861]/20"></div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                    {course.level || 'All Levels'}
                </div>
            </div>

            <div className="p-5">
                <h3 className={`text-lg font-bold mb-2 line-clamp-1 transition-colors ${theme === 'dark' ? 'text-white group-hover:text-[#A3D861]' : 'text-gray-900 group-hover:text-[#0395B2]'}`}>
                    {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                    {course.instructorImage && (
                        <img
                            src={course.instructorImage}
                            alt={course.instructor}
                            className="w-6 h-6 rounded-full object-cover border border-white/10"
                        />
                    )}
                    <p className={`text-sm line-clamp-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {course.instructor}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{progress}% Complete</span>
                        <span className="text-[#A3D861]">{progress === 100 ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <div className={`w-full rounded-full h-2 overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <div
                            className="bg-[#A3D861] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Validity / Expiry Display */}
                {(() => {
                    let expiry = enrollment.expiryDate ? new Date(enrollment.expiryDate) : null;
                    const validity = enrollment.course?.validity;

                    if (!expiry && validity && enrollment.enrolledAt) {
                        expiry = new Date(new Date(enrollment.enrolledAt).getTime() + validity * 24 * 60 * 60 * 1000);
                    }

                    if (expiry) {
                        const now = new Date();
                        const diffTime = expiry - now;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        return (
                            <div className="mb-4">
                                {diffDays < 0 ? (
                                    <span className="text-red-500 text-xs font-bold">Expired</span>
                                ) : (
                                    <span className={`text-xs ${diffDays < 30 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                        {diffDays} Days Remaining
                                    </span>
                                )}
                            </div>
                        );
                    }
                    return null;
                })()}

                <button
                    onClick={() => router.push(`/classroom?courseId=${course._id}`)}
                    className={`w-full py-3 rounded-xl border transition-all font-bold flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-[#A3D861] hover:text-black hover:border-[#A3D861]' : 'bg-gray-50 border-gray-200 hover:bg-[#A3D861] hover:text-black hover:border-[#A3D861]'}`}
                >
                    {progress > 0 ? 'Continue Learning' : 'Start Course'} <Play size={16} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">Loading...</div>}>
            <StudentDashboardContent />
        </React.Suspense>
    );
};

export default StudentDashboard;




