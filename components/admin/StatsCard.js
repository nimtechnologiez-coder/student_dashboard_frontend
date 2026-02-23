'use client';

import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="bg-[#0a0f1a] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <p className="text-3xl font-bold text-white mb-2">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                    <Icon size={24} />
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${color}-500 to-transparent opacity-50`}></div>
        </div>
    );
};

export default StatsCard;
