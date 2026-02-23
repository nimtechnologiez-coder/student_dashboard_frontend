'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

const UserTable = ({ users, onEditUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white focus:outline-none focus:border-[#A3D861]"
                    />
                </div>
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-white hover:bg-white/10 transition-colors">
                    <Filter size={18} /> Filter
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 text-sm">
                            <th className="p-4 pl-6 font-medium">User</th>
                            <th className="p-4 font-medium">Contact</th>
                            <th className="p-4 font-medium">Enrollments & Validity</th>
                            <th className="p-4 font-medium">Registered Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {currentUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] flex items-center justify-center text-white font-bold">
                                            {user.fullName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{user.fullName}</div>
                                            <div className="text-gray-500 text-xs">ID: {user._id.substring(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-white text-sm">{user.email}</div>
                                    <div className="text-gray-500 text-xs">{user.mobile}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                                            user.enrolledCourses.map((enrollment, idx) => {
                                                // Calculate expiry: Use stored expiry, or calculate from enrolledAt + validity
                                                let expiry = enrollment.expiryDate ? new Date(enrollment.expiryDate) : null;
                                                const validity = enrollment.course?.validity;

                                                if (!expiry && validity && enrollment.enrolledAt) {
                                                    expiry = new Date(new Date(enrollment.enrolledAt).getTime() + validity * 24 * 60 * 60 * 1000);
                                                }

                                                const now = new Date();
                                                const diffDays = expiry ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : null;

                                                return (
                                                    <div key={idx} className="text-xs">
                                                        <span className="text-gray-300 block truncate max-w-[150px]" title={enrollment.course?.title || 'Unknown Course'}>
                                                            {enrollment.course?.title || 'Unknown Course'}
                                                        </span>
                                                        {diffDays !== null ? (
                                                            <span className={`${diffDays <= 10 ? 'text-red-400 font-bold' : 'text-[#A3D861]'} text-[10px]`}>
                                                                {diffDays < 0 ? 'Expired' : `${diffDays} days left`}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500 text-[10px]">No Expiry</span>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <span className="text-gray-500 text-xs text-center">-</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400 text-sm">
                                    {new Date(user.registeredAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className="bg-[#A3D861]/10 text-[#A3D861] px-2 py-1 rounded text-xs font-bold">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <button
                                        onClick={() => onEditUser(user)}
                                        className="p-2 text-gray-400 hover:text-[#A3D861] transition-colors"
                                        title="Edit User"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
                <div>
                    Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
