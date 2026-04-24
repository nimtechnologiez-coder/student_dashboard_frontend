'use client';

import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, ExternalLink, Timer, AlertCircle, CheckCircle2, ChevronRight, Users, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import JitsiCallContainer from './JitsiCallContainer';

const LiveClassesSection = ({ theme, user }) => {
    const [liveClasses, setLiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, history
    const [activeCall, setActiveCall] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    const fetchLiveClasses = async () => {
        try {
            const res = await fetch(`${API_URL}/api/live-classes`);
            if (res.ok) {
                const data = await res.json();
                
                // Fetch courses to get their planType for team filtering
                const coursesRes = await fetch(`${API_URL}/api/courses`);
                const allCourses = coursesRes.ok ? await coursesRes.json() : [];
                const teamCourseIds = new Set(
                    allCourses
                        .filter(c => c.planType === 'Team' || c.planType === 'Both')
                        .map(c => String(c.id || c._id))
                );

                const enrolledCourseIds = (user.enrolledCourses || []).map(e => 
                    String(e.course?._id || e.course?.id || e.course)
                );
                
                const isTeamMember = (user.enrolledCourses || []).some(e => e.planType === 'Team');
                
                const accessibleClasses = data.filter(c => {
                    // Admin see everything
                    if (user.role === 'admin') return true;

                    // Team members see only classes for courses marked as Team or Both
                    if (isTeamMember) {
                        return teamCourseIds.has(String(c.courseId));
                    }
                    
                    const isGeneralSession = !c.courseId || c.courseId === "" || c.courseId === "null";
                    const isEnrolled = enrolledCourseIds.includes(String(c.courseId));
                    return isGeneralSession || isEnrolled;
                });

                setLiveClasses(accessibleClasses);
            }
        } catch (error) {
            console.error("Error fetching live classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveClasses();
        const interval = setInterval(fetchLiveClasses, 30000); // Refresh every 30s for live status
        return () => clearInterval(interval);
    }, [user]);

    const handleJoin = async (liveClass) => {
        if (liveClass.status !== 'Live') return;
        
        try {
            // Track attendance
            await fetch(`${API_URL}/api/live-classes/${liveClass._id}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id || user.id })
            });

            // If internal, open Jitsi
            if (liveClass.meetingType === 'internal') {
                setActiveCall(liveClass);
            } else {
                // Open external meeting link
                window.open(liveClass.meetingLink, '_blank');
            }
        } catch (error) {
            console.error("Join tracking failed:", error);
            if (liveClass.meetingType === 'internal') {
                setActiveCall(liveClass);
            } else {
                window.open(liveClass.meetingLink, '_blank');
            }
        }
    };

    const upcoming = liveClasses.filter(c => c.status === 'Scheduled' || c.status === 'Live')
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    
    const history = liveClasses.filter(c => c.status === 'Completed' || c.status === 'Cancelled')
        .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#A3D861]/30 border-t-[#A3D861] rounded-full animate-spin"></div>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Syncing live sessions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-black/20 rounded-xl w-fit border border-white/5">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'upcoming' ? 'bg-[#A3D861] text-black shadow-lg shadow-[#A3D861]/20' : 'text-gray-400 hover:text-white'}`}
                >
                    <Calendar size={16} /> Upcoming Sessions
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-[#A3D861] text-black shadow-lg shadow-[#A3D861]/20' : 'text-gray-400 hover:text-white'}`}
                >
                    <Clock size={16} /> My History
                </button>
            </div>

            {activeTab === 'upcoming' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {upcoming.length > 0 ? upcoming.map(c => (
                        <LiveClassCard 
                            key={c._id} 
                            liveClass={c} 
                            theme={theme} 
                            onJoin={() => handleJoin(c)}
                        />
                    )) : (
                        <div className="col-span-full py-20 text-center bg-black/20 rounded-3xl border border-white/5 border-dashed">
                             <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
                             <h3 className="text-xl font-bold text-white mb-2">No Sessions Scheduled</h3>
                             <p className="text-gray-500 max-w-md mx-auto">We'll update this section as soon as new live classes are announced for your courses.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {history.length > 0 ? history.map(c => (
                        <HistoryRow key={c._id} liveClass={c} theme={theme} user={user} />
                    )) : (
                        <div className="py-20 text-center opacity-50">
                             <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>You haven't attended any past sessions yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Jitsi Call Overlay */}
            {activeCall && (
                <JitsiCallContainer 
                    roomName={activeCall.roomName}
                    title={activeCall.title}
                    user={user.fullName || 'Student'}
                    onClose={() => setActiveCall(null)}
                />
            )}
        </div>
    );
};

const LiveClassCard = ({ liveClass, theme, onJoin }) => {
    const now = new Date();
    const scheduledAt = new Date(liveClass.scheduledAt);
    const isLive = liveClass.status === 'Live';
    
    // Countdown calculation
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (isLive) return;
        
        const updateTimer = () => {
            const diff = scheduledAt - new Date();
            if (diff <= 0) {
                setTimeLeft('Starting now...');
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);
            
            if (hours > 24) {
                setTimeLeft(`${Math.floor(hours/24)}d ${hours%24}h remain`);
            } else {
                setTimeLeft(`${hours}h ${mins}m ${secs}s`);
            }
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();
        return () => clearInterval(timer);
    }, [liveClass.scheduledAt, isLive]);

    return (
        <div className={`relative rounded-3xl overflow-hidden border p-6 transition-all group ${isLive ? 'border-[#A3D861] bg-[#A3D861]/5 shadow-[0_0_30px_rgba(163,216,97,0.1)]' : 'border-white/10 bg-[#0a0f1a] hover:border-white/20 shadow-xl'}`}>
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
                {isLive ? (
                    <span className="flex items-center gap-2 bg-[#A3D861] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse">
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Live Now
                    </span>
                ) : (
                    <span className="flex items-center gap-2 bg-white/5 text-gray-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/10">
                        Scheduled
                    </span>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <p className="text-xs font-bold text-[#0395B2] uppercase tracking-widest mb-1">{liveClass.instructor || 'Expert Faculty'}</p>
                    <h3 className="text-xl font-black text-white line-clamp-2 leading-tight group-hover:text-[#A3D861] transition-colors">{liveClass.title}</h3>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Starts At</span>
                        <span className="text-sm font-bold text-gray-200">
                            {scheduledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex flex-col ml-auto text-right">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Duration</span>
                        <span className="text-sm font-bold text-gray-400">{liveClass.duration || 60} Min</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {!isLive && (
                        <div className="flex items-center gap-4 text-[#A3D861] bg-[#A3D861]/10 px-4 py-3 rounded-2xl">
                            <Timer size={20} />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase opacity-60">Session Starts In</span>
                                <span className="text-lg font-black tracking-tighter tabular-nums">{timeLeft}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onJoin}
                        disabled={!isLive}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isLive 
                            ? 'bg-[#A3D861] text-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#A3D861]/20' 
                            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}
                    >
                        {isLive ? (
                            <>Join Live Session <ExternalLink size={18} /></>
                        ) : (
                            <>Link Protected</>
                        )}
                    </button>
                </div>

                <p className="text-[10px] text-gray-600 text-center font-medium italic">
                    {isLive ? 'Click to enter the meeting immediately' : 'Meeting link will be unlocked precisely at scheduled time'}
                </p>
            </div>
        </div>
    );
};

const HistoryRow = ({ liveClass, theme, user }) => {
    const scheduledAt = new Date(liveClass.scheduledAt);
    const attended = liveClass.attendance?.includes(user._id || user.id);

    return (
        <div className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0a0f1a] border-white/10' : 'bg-white border-gray-100 hover:shadow-md'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${attended ? 'bg-[#A3D861]/10 text-[#A3D861]' : 'bg-white/5 text-gray-500'}`}>
                {attended ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${attended ? 'bg-[#A3D861]/20 text-[#A3D861]' : 'bg-gray-800 text-gray-400'}`}>
                        {attended ? 'Attended' : 'Missed'}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold">• {scheduledAt.toLocaleDateString()}</span>
                </div>
                <h4 className="text-white font-bold truncate">{liveClass.title}</h4>
                <p className="text-gray-500 text-xs font-medium italic">with {liveClass.instructor}</p>
            </div>

            <div className="text-right flex flex-col items-end">
                 <span className="text-gray-400 text-xs font-bold">{liveClass.duration || 60}m Session</span>
                 <div className="text-[#0395B2] text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 border border-[#0395B2]/20 rounded-full px-2 py-0.5 mt-2">
                    <Users size={10} /> {liveClass.attendance?.length || 0} Learners
                 </div>
            </div>
        </div>
    );
};

export default LiveClassesSection;
