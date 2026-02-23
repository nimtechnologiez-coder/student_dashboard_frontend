'use client';

import React, { useState, useEffect } from 'react';
import { Award, Upload, Search, User, BookOpen, Download } from 'lucide-react'; // Removed CheckCircle/AlertCircle to be safe

const CertificateManager = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [certificateFile, setCertificateFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch Users
    useEffect(() => {
        fetchUsers();
    }, []);

    const resetModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedCourseId('');
        setCertificateFile(null);
    };

    useEffect(() => {
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            const filtered = users.filter(u =>
                u.fullName?.toLowerCase().includes(lower) ||
                u.email?.toLowerCase().includes(lower)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                setFilteredUsers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
            }
            return null;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleIssueCertificate = async (e) => {
        e.preventDefault();

        if (!selectedUser || !selectedCourseId || !certificateFile) {
            alert('Please fill all fields');
            return;
        }

        setUploading(true);

        try {
            // 1. Upload File
            const fileUrl = await handleFileUpload(certificateFile);
            if (!fileUrl) {
                alert('File upload failed');
                setUploading(false);
                return;
            }

            // 2. Call Issue API
            const res = await fetch('http://localhost:5000/api/certificates/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser._id,
                    courseId: selectedCourseId,
                    certificateUrl: fileUrl
                })
            });

            if (res.ok) {
                alert('Certificate issued successfully!');
                resetModal();
                fetchUsers(); // Refresh list
            } else {
                alert('Failed to issue certificate');
            }
        } catch (err) {
            console.error(err);
            alert('Error issuing certificate');
        } finally {
            setUploading(false);
        }
    };

    // Calculate stats
    const totalCertificates = users.reduce((acc, user) => {
        return acc + (user.enrolledCourses?.filter(c => c.certificateStatus === 'Approved').length || 0);
    }, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Certificate Management</h2>
                    <p className="text-gray-400 text-sm">Issue and manage course certificates</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#A3D861] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#A3D861]/90 transition-colors flex items-center gap-2"
                >
                    <Award size={20} /> Issue Certificate
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0f1a] border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Issued</p>
                            <h3 className="text-3xl font-black text-white mt-1">{totalCertificates}</h3>
                        </div>
                        <div className="p-3 bg-[#A3D861]/10 rounded-xl text-[#A3D861]">
                            <Award size={24} />
                        </div>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* List of Issued Certificates */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Issued Certificates</h3>
                    <div className="relative w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#A3D861]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* Pending Requests Section */}
                    {(() => {
                        const pendingRequests = filteredUsers.flatMap(user => {
                            const pending = user.enrolledCourses?.filter(c => c.certificateStatus === 'Pending') || [];
                            return pending.map(enrollment => ({ user, enrollment }));
                        });

                        if (pendingRequests.length > 0) {
                            return (
                                <div className="mb-8">
                                    <h4 className="px-6 py-4 text-[#A3D861] font-bold border-b border-white/10 flex items-center gap-2">
                                        <Award size={18} /> Pending Requests ({pendingRequests.length})
                                    </h4>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="p-6 font-medium">Student</th>
                                                <th className="p-6 font-medium">Course</th>
                                                <th className="p-6 font-medium">Status</th>
                                                <th className="p-6 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 bg-[#A3D861]/5">
                                            {pendingRequests.map(({ user, enrollment }, idx) => (
                                                <tr key={`pending-${user._id}-${idx}`} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-6">
                                                        <div className="font-bold text-white">{user.fullName}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="p-6 text-gray-300">
                                                        {enrollment.course?.title || 'Unknown Course'}
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                                                            Pending Review
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setSelectedCourseId(enrollment.course?._id || enrollment.course);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-[#A3D861] text-black text-xs font-bold rounded hover:bg-[#A3D861]/80 transition-colors"
                                                        >
                                                            Issue Now
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* Issued Certificates Section */}
                    <h4 className="px-6 py-4 text-white font-bold border-b border-t border-white/10 bg-[#0a0f1a]">
                        Issued History
                    </h4>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-6 font-medium">Student</th>
                                <th className="p-6 font-medium">Course</th>
                                <th className="p-6 font-medium">Date Issued</th>
                                <th className="p-6 font-medium">Status</th>
                                <th className="p-6 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.flatMap(user => {
                                    const approvedCourses = user.enrolledCourses?.filter(c => c.certificateStatus === 'Approved') || [];
                                    if (approvedCourses.length === 0) return [];

                                    return approvedCourses.map((enrollment, idx) => (
                                        <tr key={`${user._id}-${idx}`} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] flex items-center justify-center text-white font-bold text-xs">
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{user.fullName}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm text-gray-300">
                                                    {enrollment.course?.title || 'Unknown Course'}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm text-gray-400">
                                                    {enrollment.certificateIssuedAt ? new Date(enrollment.certificateIssuedAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <span>✓ Issued</span>
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <a
                                                    href={enrollment.certificateUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0395B2] hover:text-white transition-colors"
                                                >
                                                    <Download size={14} /> Download
                                                </a>
                                            </td>
                                        </tr>
                                    ));
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Certificate Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetModal}></div>
                    <div className="relative bg-[#0a0f1a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Issue New Certificate</h3>

                        <form onSubmit={handleIssueCertificate} className="space-y-4">
                            {/* User Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Student</label>
                                <select
                                    className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    onChange={(e) => {
                                        const user = users.find(u => u._id === e.target.value);
                                        setSelectedUser(user);
                                        setSelectedCourseId(''); // Reset course
                                    }}
                                    value={selectedUser?._id || ''}
                                    required
                                >
                                    <option value="">-- Choose Student --</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Selection (dependent on user) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Course</label>
                                <select
                                    className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    disabled={!selectedUser}
                                    required
                                >
                                    <option value="">-- Choose Course --</option>
                                    {selectedUser?.enrolledCourses?.map((enrollment, idx) => (
                                        <option key={idx} value={enrollment.course?._id || enrollment.course}>
                                            {enrollment.course?.title || 'Untitled Course'}
                                            {enrollment.certificateStatus === 'Approved' ? ' (Already Issued)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Upload Certificate (PDF/Image)</label>
                                <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,image/*"
                                        onChange={(e) => setCertificateFile(e.target.files[0])}
                                        required
                                    />
                                    <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                                    {certificateFile ? (
                                        <p className="text-[#A3D861] font-medium text-sm">{certificateFile.name}</p>
                                    ) : (
                                        <p className="text-gray-400 text-sm">Click to browse or drag file here</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetModal}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 py-3 rounded-xl bg-[#A3D861] text-black font-bold hover:bg-[#A3D861]/90 disabled:opacity-50"
                                >
                                    {uploading ? 'Processing...' : 'Issue Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateManager;
