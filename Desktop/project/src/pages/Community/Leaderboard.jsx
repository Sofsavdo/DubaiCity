import React, { useState } from 'react';
import { formatNumberShort } from '../../utils/helpers';

const Leaderboard = ({ leaderboard, companies, user, donators, openDonationModal, levelNames }) => {
    
    // Xavfsizlik uchun: agar propslar kelmasa, bo'sh massiv bilan ishlash
    const safeLeaderboard = leaderboard || [];
    const safeCompanies = companies || [];
    const safeDonators = donators || [];
    const safeLevelNames = levelNames || [];

    const personalLeaderboard = [...safeLeaderboard, {rank: '...', name: user.username, wealth: user.dubaiCoin, level: user.level || 1, profilePictureUrl: user.profilePictureUrl}]
        .sort((a, b) => b.wealth - a.wealth)
        .map((p, i) => ({...p, rank: i+1}));

    const companyLeaderboard = [...safeCompanies]
        .sort((a,b) => b.totalWealth - a.totalWealth)
        .map((c, i) => ({...c, rank: i+1}));

    const donatorLeaderboard = [...safeDonators, { id: user.id, name: user.username, totalDonated: user.totalDonated || 0, profilePictureUrl: user.profilePictureUrl }]
        .filter(d => d.totalDonated > 0)
        .sort((a, b) => b.totalDonated - a.totalDonated)
        .map((p, i) => ({...p, rank: i+1}));

    const getRankClass = (rank) => {
        if (rank === 1) return 'border-yellow-400';
        if (rank === 2) return 'border-gray-400';
        if (rank === 3) return 'border-yellow-700';
        return 'border-transparent';
    };

    const LeaderboardList = ({ data, type }) => (
        <div className="space-y-2">
            {data.map(item => {
                const isCurrentUser = type === 'personal' && item.name === user.username;
                const isCurrentUserCompany = type === 'company' && item.id === user.companyId;

                return (
                    <div key={item.rank || item.id} className={`glass-card p-3 flex items-center space-x-4 ${isCurrentUser || isCurrentUserCompany ? 'border-2 border-yellow-400' : ''}`}>
                        <span className="text-xl font-bold w-8 text-center text-gradient-gold">{item.rank}</span>
                        {type !== 'company' && <img src={item.profilePictureUrl} className="w-10 h-10 rounded-full border-2 border-slate-600" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/090979/ffffff?text=U'; }} alt={item.name}/>}
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-white">{item.name}</p>
                            {type === 'personal' && <p className="text-xs text-gray-400">{safeLevelNames[(item.level || 1)-1] || 'Yangi'}</p>}
                            {type === 'company' && <p className="text-xs text-gray-400">{item.members.length} a'zo</p>}
                        </div>
                        <p className="font-semibold text-lg text-yellow-400">{formatNumberShort(item.wealth || item.totalWealth || item.totalDonated)}</p>
                    </div>
                );
            })}
        </div>
    );
    
    // XATO TUZATILDI: Faylga `return` qismi va ichki tablar mantig'i qo'shildi
    const [tab, setTab] = useState('personal');

    return (
        <div className="h-full flex flex-col">
            <div className="glass-card p-1.5 flex mb-4">
                <button onClick={() => setTab('personal')} className={`flex-1 rounded-xl py-1 font-bold transition-colors text-sm ${tab === 'personal' ? 'bg-slate-700/50 text-white' : 'text-gray-400'}`}>O'yinchilar</button>
                <button onClick={() => setTab('company')} className={`flex-1 rounded-xl py-1 font-bold transition-colors text-sm ${tab === 'company' ? 'bg-slate-700/50 text-white' : 'text-gray-400'}`}>Kompaniyalar</button>
                <button onClick={() => setTab('donators')} className={`flex-1 rounded-xl py-1 font-bold transition-colors text-sm ${tab === 'donators' ? 'bg-slate-700/50 text-white' : 'text-gray-400'}`}>Homiylar</button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                {tab === 'personal' && <LeaderboardList data={personalLeaderboard} type="personal" />}
                {tab === 'company' && <LeaderboardList data={companyLeaderboard} type="company" />}
                {tab === 'donators' && (
                    <>
                        <button onClick={openDonationModal} className="w-full mb-4 bg-yellow-500 text-black font-bold py-2 px-3 rounded-lg">Homiy bo'lish</button>
                        <LeaderboardList data={donatorLeaderboard} type="donators" />
                    </>
                )}
            </div>
        </div>
    );
}; // XATO TUZATILDI: Komponentni yopuvchi qavs qo'shildi

export default Leaderboard;