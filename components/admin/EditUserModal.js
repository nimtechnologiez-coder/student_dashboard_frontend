'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, userToEdit, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                fullName: userToEdit.fullName,
                email: userToEdit.email,
                mobile: userToEdit.mobile,
                password: userToEdit.password || '' // Pre-fill password (User Request)
            });
        }

        // Fetch all courses for the dropdown
        const fetchCourses = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/courses');
                if (res.ok) {
                    const data = await res.json();
                    setAvailableCourses(data);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            }
        };
        fetchCourses();
    }, [userToEdit]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEnrollUser = async () => {
        if (!selectedCourseId) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userToEdit._id, courseId: selectedCourseId })
            });
            if (res.ok) {
                const data = await res.json();
                // Refresh user data in parent
                const updatedUser = { ...userToEdit, enrolledCourses: data.enrolledCourses };
                onUserUpdated(updatedUser);
                setSelectedCourseId('');
            } else {
                const err = await res.json();
                alert(err.message || 'Enrollment failed');
            }
        } catch (error) {
            console.error(error);
            alert('Enrollment error');
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async (courseId) => {
        if (!confirm('Are you sure you want to remove this course?')) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/unenroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userToEdit._id, courseId })
            });
            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...userToEdit, enrolledCourses: data.enrolledCourses };
                onUserUpdated(updatedUser);
            } else {
                alert('Unenrollment failed');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                onUserUpdated(updatedUser); // Update parent state with new details
                onClose();
            } else {
                alert('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#0a0f1a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl max-h-[85vh] flex flex-col">
                <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white">Edit User</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mobile Number</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Set New Password <span className="text-xs text-gray-500 font-normal">(Leave blank to keep current)</span></label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Course Management Section */}
                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Enrolled (Paid) Courses</h3>

                        <div className="space-y-4 mb-4">
                            {userToEdit && userToEdit.enrolledCourses && userToEdit.enrolledCourses.length > 0 ? (
                                userToEdit.enrolledCourses.map((enrollment, idx) => {
                                    // Handle both populated object and flat ID (fallback)
                                    const course = enrollment.course;
                                    const courseTitle = course ? course.title : 'Unknown Course';
                                    const progress = enrollment.progress || 0;

                                    // Curriculum Data (if available)
                                    const curriculum = course && course.curriculum ? course.curriculum : [];

                                    return (
                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                            <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{courseTitle}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-[#A3D861] border border-[#A3D861]/30 px-1.5 py-0.5 rounded">Paid</span>
                                                        <span className="text-[10px] text-gray-400">{progress}% Completed</span>
                                                    </div>
                                                </div>
                                                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#A3D861] rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Curriculum / Lectures View */}
                                            <div className="p-3 bg-[#0a0f1a]">
                                                <details className="group">
                                                    <summary className="flex items-center justify-between cursor-pointer text-xs font-medium text-gray-400 hover:text-white transition-colors">
                                                        <span>View Course Modules & Lectures</span>
                                                        <span className="group-open:rotate-180 transition-transform">▼</span>
                                                    </summary>
                                                    <div className="mt-3 space-y-3 pl-2 border-l border-white/10">
                                                        {curriculum.length > 0 ? (
                                                            curriculum.map((module, mIdx) => (
                                                                <div key={mIdx}>
                                                                    <div className="text-xs font-bold text-white mb-1.5 flex justify-between">
                                                                        <span>{module.title}</span>
                                                                        <span className="text-gray-500 font-normal">{module.duration}</span>
                                                                    </div>
                                                                    <ul className="space-y-2">
                                                                        {module.lectures?.map((lecture, lIdx) => (
                                                                            <li key={lIdx} className="bg-white/5 p-2 rounded border border-white/5">
                                                                                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span>{lecture.type === 'video' ? '▶' : '📄'}</span>
                                                                                        <span className="text-white">{lecture.title}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="text-gray-600">{lecture.time}</span>
                                                                                        {/* Since user is enrolled, all content is unlocked for them */}
                                                                                        <span className="text-[#A3D861] flex items-center gap-1">
                                                                                            <Lock size={12} className="text-[#A3D861]" /> Unlocked
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Video URL Input */}
                                                                                <div className="flex gap-2">
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Video URL (YouTube/Vimeo)"
                                                                                        defaultValue={lecture.videoUrl || ''}
                                                                                        className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#A3D861]"
                                                                                        id={`video-input-${course._id}-${mIdx}-${lIdx}`}
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={async () => {
                                                                                            const input = document.getElementById(`video-input-${course._id}-${mIdx}-${lIdx}`);
                                                                                            const newUrl = input.value;

                                                                                            // Optimistic UI update or simple alert for now
                                                                                            const confirmUpdate = confirm(`Update video URL for "${lecture.title}"? This will affect ALL users enrolled in this course.`);
                                                                                            if (!confirmUpdate) return;

                                                                                            try {
                                                                                                // Construct new curriculum
                                                                                                const updatedCurriculum = [...curriculum];
                                                                                                updatedCurriculum[mIdx].lectures[lIdx].videoUrl = newUrl;

                                                                                                // API Call to Update Course
                                                                                                const res = await fetch(`http://localhost:5000/api/courses/${course._id}`, {
                                                                                                    method: 'PUT',
                                                                                                    headers: { 'Content-Type': 'application/json' },
                                                                                                    body: JSON.stringify({ curriculum: updatedCurriculum })
                                                                                                });

                                                                                                if (res.ok) {
                                                                                                    alert('Video URL updated successfully!');
                                                                                                    // Ideally trigger a refresh here
                                                                                                } else {
                                                                                                    alert('Failed to update video URL');
                                                                                                }
                                                                                            } catch (err) {
                                                                                                console.error(err);
                                                                                                alert('Error updating video URL');
                                                                                            }
                                                                                        }}
                                                                                        className="bg-[#A3D861] text-black text-xs font-bold px-2 py-1 rounded hover:bg-[#A3D861]/80 transition-colors"
                                                                                    >
                                                                                        Save
                                                                                    </button>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-gray-500">No curriculum data available.</div>
                                                        )}
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-gray-500 text-sm text-center py-2">No active enrollments</div>
                            )}
                        </div>

                        {/* Add Enrollment Action - Simplified for now */}
                        <div className="text-xs text-gray-500">
                            * To add user to a course, use the "Enroll" button on the Course Page (simulating user action) or generic API.
                            <br />
                            (Full admin enrollment management coming soon)
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-[#A3D861] text-black font-bold hover:bg-[#A3D861]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
