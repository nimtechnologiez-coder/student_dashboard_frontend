'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import UserTable from '../../components/admin/UserTable';
import AddCourseModal from '../../components/admin/AddCourseModal';
import EditUserModal from '../../components/admin/EditUserModal';
import CouponManager from '../../components/admin/CouponManager';

import CertificateManager from '../../components/admin/CertificateManager';
import { Users, BookOpen, Activity, Plus, Settings, GraduationCap, Pencil, Download, FileText, User } from 'lucide-react';
// Recharts unused after removing dashboards

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState(null);

    // User Edit State
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Announcement State
    const [announcement, setAnnouncement] = useState('');
    // Hero Image State
    const [heroImage, setHeroImage] = useState('');

    // Instructor State
    const [instructors, setInstructors] = useState([]);
    const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] = useState(false);
    const [instructorForm, setInstructorForm] = useState({ name: '', email: '', bio: '', expertise: '', image: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, coursesRes, settingsRes, instructorsRes, heroRes] = await Promise.all([
                    fetch('http://localhost:5000/api/users'),
                    fetch('http://localhost:5000/api/courses'),
                    fetch('http://localhost:5000/api/settings/announcement'),
                    fetch('http://localhost:5000/api/instructors'),
                    fetch('http://localhost:5000/api/settings/hero-image')
                ]);

                if (usersRes.ok) {
                    const data = await usersRes.json();
                    setUsers(Array.isArray(data) ? data : []);
                }
                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    setCourses(Array.isArray(data) ? data : []);
                }
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    setAnnouncement(settingsData.message || '');
                }
                if (instructorsRes.ok) {
                    const data = await instructorsRes.json();
                    setInstructors(Array.isArray(data) ? data : []);
                }
                if (heroRes.ok) {
                    const heroData = await heroRes.json();
                    setHeroImage(heroData.url || '');
                }

            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBroadcast = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/settings/announcement', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: announcement })
            });

            if (res.ok) {
                alert('Announcement updated successfully!');
            } else {
                alert('Failed to update announcement.');
            }
        } catch (error) {
            console.error("Error broadcasting announcement:", error);
            alert('Error updating announcement.');
        }
    };

    const handleHeroImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optimistic UI or Loading state could be added here
        const originalText = e.target.nextElementSibling?.innerText;
        if (e.target.nextElementSibling) e.target.nextElementSibling.innerText = "Uploading...";

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload File
            const uploadRes = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (uploadRes.ok) {
                const data = await uploadRes.json();
                const imageUrl = data.url;

                // 2. Update Setting
                const settingRes = await fetch('http://localhost:5000/api/settings/hero-image', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: imageUrl })
                });

                if (settingRes.ok) {
                    setHeroImage(imageUrl);
                    alert('Hero background updated successfully!');
                } else {
                    alert('Failed to save hero image setting.');
                }
            } else {
                alert('Image upload failed.');
            }
        } catch (error) {
            console.error("Error uploading hero image:", error);
            alert('Error updating hero image.');
        }

        if (e.target.nextElementSibling && originalText) e.target.nextElementSibling.innerText = originalText;
    };

    const handleCourseAdded = (savedCourse) => {
        if (courseToEdit) {
            setCourses(prev => prev.map(c => c._id === savedCourse._id ? savedCourse : c));
        } else {
            setCourses(prev => [...prev, savedCourse]);
        }
    };

    const handleEditClick = (course) => {
        setCourseToEdit(course);
        setIsAddCourseModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddCourseModalOpen(false);
        setCourseToEdit(null);
    };

    // User Edit Handlers
    const handleEditUserClick = (user) => {
        setUserToEdit(user);
        setIsEditUserModalOpen(true);
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
        setUserToEdit(null);
        setIsEditUserModalOpen(false);
    };

    const handleCloseUserModal = () => {
        setIsEditUserModalOpen(false);
        setUserToEdit(null);
    };

    // Instructor Handlers
    const [instructorToEdit, setInstructorToEdit] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                return data.url;
            } else {
                console.error('Upload failed');
                return null;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleAddInstructor = async (e) => {
        e.preventDefault();
        try {
            const url = instructorToEdit
                ? `http://localhost:5000/api/instructors/${instructorToEdit._id}`
                : 'http://localhost:5000/api/instructors';

            const method = instructorToEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(instructorForm)
            });

            if (res.ok) {
                const savedInstructor = await res.json();
                if (instructorToEdit) {
                    setInstructors(prev => prev.map(i => i._id === savedInstructor._id ? savedInstructor : i));
                    alert('Instructor updated successfully!');
                } else {
                    setInstructors(prev => [savedInstructor, ...prev]);
                    alert('Instructor added successfully!');
                }
                setIsAddInstructorModalOpen(false);
                setInstructorForm({ name: '', email: '', bio: '', expertise: '', image: '' });
                setInstructorToEdit(null);
            } else {
                alert('Failed to save instructor');
            }
        } catch (error) {
            console.error("Error saving instructor:", error);
        }
    };

    const handleEditInstructorClick = (instructor) => {
        setInstructorToEdit(instructor);
        setInstructorForm({
            name: instructor.name,
            email: instructor.email,
            bio: instructor.bio,
            expertise: instructor.expertise,
            image: instructor.image || ''
        });
        setIsAddInstructorModalOpen(true);
    };

    const handleDeleteInstructor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this instructor?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/instructors/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setInstructors(prev => prev.filter(i => i._id !== id));
            } else {
                alert('Failed to delete instructor');
            }
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A3D861]"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'dashboard':
                // ... (dashboard content remains same)
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsCard title="Total Users" value={users.length} icon={Users} color="blue" />
                            <StatsCard title="Total Courses" value={courses.length} icon={BookOpen} color="green" />
                            <StatsCard title="Active Sessions" value="24" icon={Activity} color="purple" />
                        </div>



                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Recent Registrations</h3>
                                <div className="space-y-4">
                                    {users.slice(0, 5).map(user => (
                                        <div key={user._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] flex items-center justify-center text-xs font-bold text-black">
                                                    {user.fullName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{user.fullName}</p>
                                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(user.registeredAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Popular Courses</h3>
                                <div className="space-y-4">
                                    {courses.slice(0, 3).map(course => (
                                        <div key={course._id} className="group p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-white font-medium group-hover:text-[#A3D861] transition-colors">{course.title}</h4>
                                                <span className="bg-[#A3D861]/20 text-[#A3D861] text-xs px-2 py-0.5 rounded font-bold">{course.rating}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span>{course.instructor}</span>
                                                <span>{course.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return <UserTable users={users} onEditUser={handleEditUserClick} />;
            case 'instructors':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Instructor Management</h2>
                            <button
                                onClick={() => {
                                    setInstructorToEdit(null);
                                    setInstructorForm({ name: '', email: '', bio: '', expertise: '', image: '' });
                                    setIsAddInstructorModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-[#A3D861] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#A3D861]/90 transition-colors"
                            >
                                <Plus size={18} /> Add Instructor
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {instructors.map(instructor => (
                                <div key={instructor._id} className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#A3D861]/50 transition-all group relative">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditInstructorClick(instructor)}
                                            className="text-gray-500 hover:text-[#A3D861] transition-colors"
                                            title="Edit Instructor"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteInstructor(instructor._id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                            title="Delete Instructor"
                                        >
                                            <div className="w-4 h-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] p-1 mb-4">
                                        <img
                                            src={instructor.image || `https://ui-avatars.com/api/?name=${instructor.name}&background=random`}
                                            alt={instructor.name}
                                            className="w-full h-full rounded-full object-cover border-4 border-[#0a0f1a]"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{instructor.name}</h3>
                                    <p className="text-[#A3D861] text-sm font-bold mb-2">{instructor.expertise}</p>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{instructor.bio}</p>
                                    <div className="mt-auto w-full pt-4 border-t border-white/10 flex justify-between text-xs text-gray-500">
                                        <span>{instructor.email}</span>
                                        <span>Joined {new Date(instructor.joinedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'students':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Student Activity</h2>
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-white/5 text-white uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Last Login</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Enrolled Courses</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] flex items-center justify-center text-xs font-bold text-black">
                                                    {user.fullName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.fullName}</p>
                                                    <p className="text-xs">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.lastLogin && (new Date() - new Date(user.lastLogin)) < (24 * 60 * 60 * 1000) ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                    {user.lastLogin && (new Date() - new Date(user.lastLogin)) < (24 * 60 * 60 * 1000) ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.enrolledCourses?.length || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'certificates':
                return <CertificateManager />;
            case 'reports':
                // Calculate stats
                // Flatten all enrollments to get transactions
                const transactions = users.flatMap(user =>
                    user.enrolledCourses.map(enrollment => ({
                        id: `${user._id}-${enrollment.course?._id || Math.random()}`,
                        user: user.fullName,
                        email: user.email,
                        course: enrollment.course ? enrollment.course.title : 'Unknown Course',
                        amount: enrollment.amountPaid || 0,
                        date: new Date(enrollment.enrolledAt).toLocaleDateString()
                    }))
                ).sort((a, b) => new Date(b.date) - new Date(a.date));

                const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
                const avgOrderValue = transactions.length > 0 ? (totalRevenue / transactions.length).toFixed(2) : 0;

                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Financial Reports</h2>
                            <div className="flex gap-3">
                                <button onClick={() => alert('Exporting CSV...')} className="flex items-center gap-2 bg-[#0a0f1a] border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <FileText size={16} /> Export CSV
                                </button>
                                <button onClick={() => alert('Exporting PDF...')} className="flex items-center gap-2 bg-[#A3D861] text-black px-4 py-2 rounded-lg hover:bg-[#A3D861]/90 font-bold transition-colors">
                                    <Download size={16} /> Export PDF
                                </button>
                            </div>
                        </div>

                        {/* Top Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
                                <h3 className="text-3xl font-black text-white">{transactions.length}</h3>
                            </div>
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <p className="text-gray-400 text-sm mb-1">Avg. Order Value</p>
                                <h3 className="text-3xl font-black text-white">₹{avgOrderValue}</h3>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                            </div>
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-white/5 text-white uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">{t.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{t.user}</div>
                                                <div className="text-xs">{t.email}</div>
                                            </td>
                                            <td className="px-6 py-4">{t.course}</td>
                                            <td className="px-6 py-4 text-right font-mono text-white">
                                                ₹{t.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No transactions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'coupons':
                return <CouponManager />;
            case 'courses':
                const COURSE_CATEGORIES = [
                    { title: "Full Stack Development", keywords: ["Python Full Stack", "Java Full Stack", "MERN Full Stack"] },
                    { title: "Data & Analysis", keywords: ["Data Analyst", "Business Analyst", "Digital Marketing"] },
                    { title: "Design And Branding", keywords: ["Data Science", "UI/UX Design Masterclass", "Product Design"] },
                    { title: "Cloud And Digital", keywords: ["AI & ML Engineer", "Cybersecurity Essentials", "AWS DevOps"] }
                ];

                const sections = [];
                const usedCourseIds = new Set();
                const publishedCourses = courses; // Using all courses (drafts + published) for admin

                // 1. Map Categories
                COURSE_CATEGORIES.forEach(category => {
                    const categoryCourses = publishedCourses.filter(c => {
                        // Priority 1: Explicit Category check
                        if (c.category && c.category === category.title) {
                            return true;
                        }
                        // Priority 2: Keyword Fallback
                        if ((!c.category || c.category === 'Other') && category.keywords) {
                            return category.keywords.some(k => c.title.toLowerCase().includes(k.toLowerCase()));
                        }
                        return false;
                    });

                    if (categoryCourses.length > 0) {
                        categoryCourses.forEach(c => usedCourseIds.add(c._id));
                        // Remove duplicates
                        const uniqueCourses = Array.from(new Set(categoryCourses.map(c => c._id)))
                            .map(id => categoryCourses.find(c => c._id === id));
                        sections.push({ title: category.title, courses: uniqueCourses });
                    }
                });

                // 2. Catch-all for others
                const otherCourses = publishedCourses.filter(c => !usedCourseIds.has(c._id));
                if (otherCourses.length > 0) {
                    sections.push({ title: "Uncategorized / Other", courses: otherCourses });
                }

                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Course Management</h2>
                            <button
                                onClick={() => {
                                    setCourseToEdit(null);
                                    setIsAddCourseModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-[#A3D861] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#A3D861]/90 transition-colors"
                            >
                                <Plus size={18} /> Add Course
                            </button>
                        </div>

                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-4">
                                <h3 className="text-xl font-bold text-[#A3D861] border-b border-white/10 pb-2">
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {section.courses.map(course => (
                                        <div key={course._id} className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden hover:border-[#A3D861]/50 transition-colors group relative">
                                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(course);
                                                    }}
                                                    className="p-2 bg-[#0a0f1a] border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-[#A3D861] transition-all shadow-lg"
                                                    title="Edit Course"
                                                >
                                                    <div className="w-4 h-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-[#0395B2]/10 text-[#0395B2] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                                        {course.level}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${course.status === 'Published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                            {course.status || 'Draft'}
                                                        </span>
                                                        <div className="text-white font-bold">₹{course.price}</div>
                                                    </div>
                                                </div>
                                                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#A3D861] transition-colors">
                                                    {course.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                                    {course.subtitle}
                                                </p>
                                                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-gray-500">
                                                    <span>{course.students?.toLocaleString()} students</span>
                                                    <span>{course.rating} ★</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Platform Settings</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* System Preferences */}
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Settings size={20} className="text-[#A3D861]" /> System Preferences
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-medium">Maintenance Mode</h4>
                                            <p className="text-gray-400 text-sm">Disable access for all non-admin users</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A3D861]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-medium">User Registration</h4>
                                            <p className="text-gray-400 text-sm">Allow new users to create accounts</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0395B2]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-medium">Email Notifications</h4>
                                            <p className="text-gray-400 text-sm">Send automated emails for course enrollment</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0395B2]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Data Management */}
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-[#0395B2]" /> Data Management
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Export Users</h4>
                                                <p className="text-gray-400 text-xs">Download CSV of all registered users</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const headers = ['ID,Name,Email,Join Date,Enrolled Courses\n'];
                                                const csvRows = users.map(user =>
                                                    `${user._id},"${user.fullName}","${user.email}",${user.registeredAt},"${user.enrolledCourses?.length || 0}"`
                                                );
                                                const csvData = headers.concat(csvRows).join('\n');
                                                const blob = new Blob([csvData], { type: 'text/csv' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.setAttribute('hidden', '');
                                                a.setAttribute('href', url);
                                                a.setAttribute('download', 'users_export.csv');
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                            }}
                                            className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
                                        >
                                            Download
                                        </button>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Course Report</h4>
                                                <p className="text-gray-400 text-xs">Performance and enrollment stats</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/50 rounded-lg text-sm hover:bg-green-500/20 transition-colors">
                                            Download
                                        </button>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-500/20 p-2 rounded-lg text-red-400 flex items-center justify-center h-9 w-9">
                                                <span className="font-bold text-lg">₹</span>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Revenue Report</h4>
                                                <p className="text-gray-400 text-xs">Monthly financial breakdown</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg text-sm hover:bg-red-500/20 transition-colors">
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Announcements */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">System Announcement</h3>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={announcement}
                                    onChange={(e) => setAnnouncement(e.target.value)}
                                    placeholder="Type an alert message for all users..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                />
                                <button
                                    onClick={handleBroadcast}
                                    className="px-6 py-3 bg-[#0395B2] text-white font-bold rounded-xl hover:bg-[#0395B2]/90 transition-colors"
                                >
                                    Broadcast
                                </button>
                            </div>
                        </div>

                        {/* Hero Section Background */}
                        <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6 mb-8 hover:border-[#A3D861]/30 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">Hero Section Background</h2>
                                    <p className="text-gray-400 text-sm">Update the background image for the main "Unlock Your Potential" section.</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative w-32 h-20 bg-black/50 rounded-lg overflow-hidden border border-white/10">
                                        {heroImage ? (
                                            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-600 text-xs text-center p-2">No Image Set</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            id="heroUpload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleHeroImageUpload}
                                        />
                                        <label
                                            htmlFor="heroUpload"
                                            className="inline-flex items-center gap-2 bg-[#A3D861] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#A3D861]/90 transition-colors cursor-pointer"
                                        >
                                            <Plus size={18} /> Upload Image
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className="text-white">Select a tab</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] font-sans selection:bg-[#A3D861] selection:text-black">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="ml-64 p-8">
                {/* Top Bar */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Welcome back, Admin</h1>
                        <p className="text-gray-400 text-sm">Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
                            AD
                        </div>
                    </div>
                </header>

                {renderContent()}

                <AddCourseModal
                    isOpen={isAddCourseModalOpen}
                    onClose={handleCloseModal}
                    onCourseAdded={handleCourseAdded}
                    courseToEdit={courseToEdit}
                />

                <EditUserModal
                    isOpen={isEditUserModalOpen}
                    onClose={handleCloseUserModal}
                    userToEdit={userToEdit}
                    onUserUpdated={handleUserUpdated}
                />

                {/* Add Instructor Modal - Inline for simplicity */}
                {isAddInstructorModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#0a0f1a] border border-white/10 w-full max-w-lg rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {instructorToEdit ? 'Edit Instructor' : 'Add New Instructor'}
                            </h2>
                            <form onSubmit={handleAddInstructor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={instructorForm.name}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                                        className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={instructorForm.email}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                                        className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Expertise</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Web Development"
                                        value={instructorForm.expertise}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, expertise: e.target.value })}
                                        className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                                    <textarea
                                        rows="3"
                                        value={instructorForm.bio}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                                        className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                                            {instructorForm.image ? (
                                                <img src={instructorForm.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <User size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            {uploadingImage ? (
                                                <div className="text-[#A3D861] text-sm animate-pulse">Uploading...</div>
                                            ) : (
                                                <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer transition-colors w-fit">
                                                    <Download size={16} /> {/* Using Download icon as Upload for consistency with existing imports */}
                                                    <span>Upload Photo</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;

                                                            setUploadingImage(true);
                                                            const url = await handleFileUpload(file);
                                                            setUploadingImage(false);

                                                            if (url) {
                                                                setInstructorForm(prev => ({ ...prev, image: url }));
                                                            } else {
                                                                alert('Image upload failed');
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1">Recommended: Square image, max 2MB</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddInstructorModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-xl font-bold bg-[#A3D861] text-black hover:bg-[#A3D861]/90"
                                    >
                                        {instructorToEdit ? 'Update Instructor' : 'Add Instructor'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
