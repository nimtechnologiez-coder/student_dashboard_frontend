'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { X, Phone, Users, ShieldCheck } from 'lucide-react';

// Dynamic import for Jitsi
const JitsiMeeting = dynamic(
    () => import('@jitsi/react-sdk').then((mod) => mod.JitsiMeeting),
    { ssr: false }
);

const JitsiCallContainer = ({ roomName, user, title, onClose }) => {
    if (!roomName) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in zoom-in duration-300">
            {/* Minimal Header */}
            <div className="bg-[#0a0f1a]/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0395B2] to-[#A3D861] flex items-center justify-center text-black font-black">
                        N
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm leading-tight">{title}</h2>
                        <p className="text-[#A3D861] text-[10px] font-black uppercase tracking-widest">Live Classroom</p>
                    </div>
                </div>
                
                <button 
                    onClick={onClose}
                    className="bg-white/5 text-gray-400 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Jitsi View */}
            <div className="flex-1 relative bg-black">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        startWithVideoMuted: true,
                        enableWelcomePage: false,
                        prejoinPageEnabled: true, // Allow students to test gear
                        disableDeepLinking: true
                    }}
                    interfaceConfigOverwrite={{
                        SHOW_JITSI_WATERMARK: false,
                        GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
                        DISPLAY_WELCOME_PAGE_CONTENT: false,
                    }}
                    userInfo={{
                        displayName: user || 'Student',
                    }}
                    onApiReady={(externalApi) => {
                        console.log('Jitsi Meet API is ready for Student');
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>

            {/* Bottom Security Bar */}
            <div className="bg-[#0a0f1a] px-6 py-2 flex justify-between items-center text-[9px] font-bold text-gray-600 uppercase tracking-widest border-t border-white/5">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-[#A3D861]" /> SSL Encrypted</span>
                    <span className="flex items-center gap-1"><Users size={10} /> {user} (Participant)</span>
                </div>
                <div>
                    Powered by Nim Mesh
                </div>
            </div>
        </div>
    );
};

export default JitsiCallContainer;
