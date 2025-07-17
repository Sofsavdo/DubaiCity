import React, { useState } from 'react';
import Company from './Company';
import Leaderboard from './Leaderboard';

const CommunityPage = (props) => {
    const [activeTab, setActiveTab] = useState('kompaniya');

    return (
         <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
            {/* Minimal Header */}
            <div className="p-2 flex-shrink-0">
                <h1 className="text-lg font-bold text-gradient-gold mb-1 text-center">Jamoa</h1>
                <div className="glass-card p-1 flex">
                    <button onClick={() => setActiveTab('kompaniya')} className={`flex-1 rounded-xl py-1 font-bold transition-colors text-xs ${activeTab === 'kompaniya' ? 'bg-slate-700/50 text-white' : 'text-gray-400'}`}>Kompaniya</button>
                    <button onClick={() => setActiveTab('reyting')} className={`flex-1 rounded-xl py-1 font-bold transition-colors text-xs ${activeTab === 'reyting' ? 'bg-slate-700/50 text-white' : 'text-gray-400'}`}>Reyting</button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {activeTab === 'kompaniya' && <Company {...props} />}
                {activeTab === 'reyting' && <Leaderboard {...props} />}
            </div>
        </div>
    );
};

export default CommunityPage;