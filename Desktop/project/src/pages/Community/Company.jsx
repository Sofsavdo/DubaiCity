import React, { useState, useEffect, useRef } from 'react';
import { useNotifier } from '../../hooks/useNotifier';
import { formatNumberShort } from '../../utils/helpers';
import { SendIcon, ShareIcon } from '../../components/Icons';

const Company = ({ user, companies, handleJoinCompany, handleCreateCompany, handleLeaveCompany, handleSendMessage, openPaymentModal, openInputModal, levelNames, handleDeleteCompany, handleRenameCompany }) => {
    const [companyTab, setCompanyTab] = useState('announcements');
    const [isCreating, setIsCreating] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState("");
    const [messageText, setMessageText] = useState("");
    const chatBoxRef = useRef(null);
    const userCompany = companies.find(c => c.id === user.companyId);
    const notifier = useNotifier();
    
    useEffect(() => {
        if(chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [userCompany?.messages, userCompany?.announcements, companyTab]);
    
    const onCreate = () => {
        if(newCompanyName.trim() !== '') {
            handleCreateCompany(newCompanyName);
            setIsCreating(false);
            setNewCompanyName("");
        }
    }
    const onSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim() !== "" && userCompany) {
            handleSendMessage(userCompany.id, messageText, 'chat');
            setMessageText("");
        }
    }
    
    const handleInviteToCompany = () => {
        if (!userCompany) return;
        const botName = "DubaiCityUzBot";
        const inviteLink = `https://t.me/${botName}?start=join_company_${userCompany.id}`;
        const shareText = `Mening "${userCompany.name}" kompaniyamga qo'shiling va birgalikda rivojlanamiz!`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openTelegramLink(shareUrl);
        } else {
            notifier.addNotification("Faqat Telegram ilovasida ishlaydi.", "info");
        }
    };
    
    const handleWriteAnnouncement = () => {
         openPaymentModal({
              name: "Kompaniya E'loni",
              usdPrice: 1.00,
              onConfirm: () => {
                  openInputModal({
                      title: "E'lon yozish",
                      placeholder: "E'lon matnini kiriting...",
                      onConfirm: (text) => handleSendMessage(userCompany.id, text, 'announcement')
                  });
              }
         });
    }

    if (userCompany) {
        const isOwner = user.id === userCompany.ownerId;
        const membersInCompany = userCompany.members.map(m => m.id === user.id ? {...m, name: "Siz"} : m);
        
        return (
            <div className="text-white h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gradient-gold mb-2 text-center">{userCompany.name}</h2>
                <p className="text-center text-gray-400 mb-4">Umumiy boylik: <span className="font-bold text-yellow-300">{formatNumberShort(userCompany.totalWealth)}</span></p>
                
                <div className="flex border-b border-white/10 mb-4">
                        <button onClick={() => setCompanyTab('announcements')} className={`flex-1 py-2 text-sm font-bold ${companyTab === 'announcements' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>E'lonlar</button>
                        <button onClick={() => setCompanyTab('chat')} className={`flex-1 py-2 text-sm font-bold ${companyTab === 'chat' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Chat</button>
                        <button onClick={() => setCompanyTab('members')} className={`flex-1 py-2 text-sm font-bold ${companyTab === 'members' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>A'zolar</button>
                        <button onClick={() => setCompanyTab('settings')} className={`flex-1 py-2 text-sm font-bold ${companyTab === 'settings' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Sozlamalar</button>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                    {companyTab === 'announcements' && (
                        <div className="h-full glass-card p-4 flex flex-col">
                            <div ref={chatBoxRef} className="flex-grow space-y-3 mb-3 pr-2 overflow-y-auto custom-scrollbar">
                                {userCompany.announcements?.length > 0 ? userCompany.announcements.map(msg => (
                                    <div key={msg.id} className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                )) : <p className="text-gray-500 text-center h-full flex items-center justify-center">Hozircha e'lonlar yo'q.</p>}
                            </div>
                            {isOwner && <button onClick={handleWriteAnnouncement} className="w-full mt-2 bg-yellow-500 text-black font-bold py-2 px-3 rounded-lg">E'lon Yozish ($1.00)</button>}
                        </div>
                    )}
                    {companyTab === 'chat' && (
                        <div className="h-full glass-card p-4 flex flex-col">
                            <div ref={chatBoxRef} className="flex-grow space-y-3 mb-3 pr-2 overflow-y-auto custom-scrollbar">
                                {userCompany.messages?.length > 0 ? userCompany.messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}>
                                        <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === user.id ? "bg-blue-600 rounded-br-none" : "bg-slate-700 rounded-bl-none"}`}>
                                            <p className="text-xs font-bold text-yellow-300 mb-1">{msg.senderId === user.id ? "Siz" : msg.sender}</p>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 text-center h-full flex items-center justify-center">Chat bo'sh.</p>}
                            </div>
                            <form onSubmit={onSendMessage} className="flex gap-2">
                                <input type="text" placeholder="Xabar yozing..." value={messageText} onChange={e => setMessageText(e.target.value)} className="w-full bg-black/30 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400" />
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg"><SendIcon/></button>
                            </form>
                        </div>
                    )}
                    {companyTab === 'members' && (
                         <div className="h-full flex flex-col">
                             <button onClick={handleInviteToCompany} className="w-full mb-4 bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><ShareIcon/> Do'stlarni Taklif Qilish</button>
                             <div className="space-y-2 flex-grow overflow-y-auto custom-scrollbar pr-2">
                                 {membersInCompany.map(member => (
                                     <div key={member.id} className="glass-card p-3 flex items-center gap-3">
                                         <img src={member.profilePictureUrl} className="w-10 h-10 rounded-full border-2 border-slate-600" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/090979/ffffff?text=U'; }} alt={member.name}/>
                                         <div className="flex-grow">
                                             <p className="font-bold text-white">{member.name}</p>
                                             <p className="text-xs text-gray-400">{levelNames[(member.level || 1)-1]}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="font-semibold text-lg text-yellow-400">{formatNumberShort(member.wealth)}</p>
                                         </div>
                                         {member.id === userCompany.ownerId && <span className="text-xs ml-2 font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">ASOSCHI</span>}
                                     </div>
                                 ))}
                             </div>
                         </div>
                    )}
                     {companyTab === 'settings' && (
                         <div className="glass-card p-4 space-y-4">
                            <h2 className="text-xl font-bold text-white mb-2 text-center">Sozlamalar</h2>
                            {isOwner ? (
                                <>
                                    <button 
                                        onClick={() => openInputModal({
                                            title: "Kompaniya nomini o'zgartirish",
                                            placeholder: "Yangi nomni kiriting",
                                            initialValue: userCompany.name,
                                            onConfirm: (newName) => handleRenameCompany(newName)
                                        })} 
                                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-3 rounded-lg"
                                    >
                                        Nomini o'zgartirish
                                   </button>
                                   <button onClick={handleDeleteCompany} className="w-full bg-red-800 hover:bg-red-700 transition-colors text-white font-bold py-3 rounded-lg">Kompaniyani O'chirish</button>
                                </>
                            ) : (
                                <button onClick={handleLeaveCompany} className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-3 rounded-lg">Kompaniyadan Chiqish</button>
                            )}
                         </div>
                    )}
                </div>
            </div>
        )
    }

    if(isCreating) {
        return (
            <div className="p-4 z-10 relative pb-24">
                <h1 className="text-3xl font-bold text-gradient-gold mb-6 text-center">Yangi Kompaniya Yaratish</h1>
                <div className="glass-card p-6 space-y-4">
                   <p className="text-center text-gray-400">Kompaniya yaratish narxi: 10,000</p>
                    <input 
                        type="text"
                        placeholder="Kompaniya nomini kiriting..."
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        className="w-full bg-black/30 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setIsCreating(false)} className="bg-slate-700 hover:bg-slate-600 transition-colors text-white font-bold py-3 rounded-lg">Bekor qilish</button>
                        <button onClick={onCreate} className="bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-3 rounded-lg disabled:opacity-50" disabled={!user || user.dubaiCoin < 10000}>Tasdiqlash</button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="p-4 z-10 relative pb-24">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Kompaniyalar</h2>
            <button onClick={() => setIsCreating(true)} className="w-full mb-6 bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-3 rounded-xl">Yangi Kompaniya Yaratish</button>
            <div className="space-y-3">
                {companies.map(c => (
                    <div key={c.id} className="glass-card p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-white">{c.name}</p>
                            <p className="text-sm text-gray-400">{c.members.length} a'zo</p>
                        </div>
                        <button onClick={() => handleJoinCompany(c.id)} className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-2 px-4 rounded-lg">Qo'shilish</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Company;