'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, GraduationCap, Activity, Award, FileText, Ticket } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'instructors', label: 'Instructors', icon: GraduationCap },
        { id: 'students', label: 'Student Activity', icon: Activity },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'coupons', label: 'Coupons', icon: Ticket },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-[#0a0f1a] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#0395B2] to-[#A3D861] rounded-lg"></div>
                    <span className="text-xl font-bold text-white">Admin Panel</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-[#A3D861] text-black font-bold shadow-[0_0_20px_rgba(163,216,97,0.3)]'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link href="/">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;
