import React from 'react';
import FriendsList from './FriendsList';
import Achievements from './Achievements';
import { WalletIcon } from '../../components/Icons';

const Profile = ({ user, setUser, openInputModal, handleInviteFriend, levelNames, companies, exchangeRate }) => {
    
    // Yutuqlar ro'yxati
    const achievementTemplates = [
        { id: 1, name: 'Birinchi Qadam', icon: '👶', description: 'O\'yinni boshlash' },
        { id: 2, name: 'Yig\'uvchi', icon: '💰', description: '10,000 DC yig\'ish' },
        { id: 3, name: 'Biznesmen', icon: '💼', description: 'Birinchi biznes sotib olish' },
        { id: 4, name: 'Millioner', icon: '💎', description: '1,000,000 DC yig\'ish' },
        { id: 5, name: 'Do\'st Taklif Qiluvchi', icon: '👥', description: '5 ta do\'st taklif qilish' },
        { id: 6, name: 'Premium Foydalanuvchi', icon: '👑', description: 'Premium status olish' },
        { id: 7, name: 'Faol O\'yinchi', icon: '🎮', description: '100 ta o\'yin o\'ynash' },
        { id: 8, name: 'Tap Ustasi', icon: '👆', description: '10,000 marta tap qilish' },
    ];

    // Foydalanuvchi yutuqlarini hisoblash
    const calculateUnlockedAchievements = () => {
        const unlocked = [];
        
        // Birinchi Qadam
        if (user.totalEarned > 0) unlocked.push(1);
        
        // Yig'uvchi
        if (user.totalEarned >= 10000) unlocked.push(2);
        
        // Biznesmen
        if (Object.keys(user.itemLevels || {}).length > 0) unlocked.push(3);
        
        // Millioner
        if (user.totalEarned >= 1000000) unlocked.push(4);
        
        // Do'st Taklif Qiluvchi
        if ((user.referrals || []).length >= 5) unlocked.push(5);
        
        // Premium Foydalanuvchi
        if (user.isPremium) unlocked.push(6);
        
        // Faol O'yinchi
        if ((user.gamesPlayedToday || 0) >= 100) unlocked.push(7);
        
        // Tap Ustasi
        if ((user.tapsToday || 0) >= 10000) unlocked.push(8);
        
        return unlocked;
    };

    const unlockedAchievements = calculateUnlockedAchievements();
    
    const handleConnectWallet = () => {
        openInputModal({
            title: "Hamyonni Ulash",
            placeholder: "Hamyon manzilingizni kiriting...",
            onConfirm: (address) => {
                setUser(prev => ({...prev, walletAddress: address}))
            }
        });
    };

    const handleDisconnectWallet = () => {
         setUser(prev => ({...prev, walletAddress: null}))
    };

    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Airdrop countdown
    const airdropDate = new Date('2025-12-01T00:00:00Z');
    const now = new Date();
    const timeLeft = airdropDate - now;
    const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));

    // DC ning dollar qiymati
    const dcValueInUSD = (user.dubaiCoin || 0) * (exchangeRate || 0.0001);

    return (
         <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black pb-20">
             {/* Minimal Header */}
             <div className="p-2 flex-shrink-0">
                 <h1 className="text-lg font-bold text-gradient-gold mb-1 text-center">Profil</h1>
             </div>
             <div className="flex-grow overflow-y-auto px-3 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                 <div className="glass-card p-4 space-y-3">
                      <div className="flex items-center gap-3">
                           <img src={user.profilePictureUrl} className="w-16 h-16 rounded-full border-2 border-yellow-400" alt="User"/>
                           <div>
                               <h2 className="text-lg font-bold">{user.username}</h2>
                              {user.isPremium && <span className="text-xs font-bold bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full">Premium</span>}
                           </div>
                      </div>
                      <div className="border-t border-white/10 my-3"></div>
                      <div className="space-y-2 text-gray-300 text-sm">
                          <p><strong>Daraja:</strong> {levelNames[(user.level || 1) - 1]} (Lv. {Math.floor(user.level || 1)})</p>
                          <p><strong>Jami boylik:</strong> {Math.floor(user.dubaiCoin || 0).toLocaleString('en-US').replace(/,/g, ' ')}</p>
                          <p><strong>USD qiymati:</strong> ${Math.floor(dcValueInUSD)}</p>
                          <p><strong>Kompaniya:</strong> {user.companyId ? companies.find(c => c.id === user.companyId)?.name : "Yo'q"}</p>
                      </div>
                      
                      {/* Airdrop Section */}
                      <div className="border-t border-white/10 my-3"></div>
                      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-lg p-4">
                          <h3 className="text-lg font-bold text-purple-300 mb-2 text-center">🪂 AIRDROP</h3>
                          <div className="text-center mb-3">
                              <p className="text-sm text-gray-300">Listing sanasi:</p>
                              <p className="text-xl font-bold text-yellow-400">01.12.2025</p>
                              <p className="text-sm text-purple-300">{daysLeft} kun qoldi</p>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                              <h4 className="font-bold text-white">Listing shartlari:</h4>
                              <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                      <span className={`w-4 h-4 rounded-full ${user.walletAddress ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                      <span className={user.walletAddress ? 'text-green-400' : 'text-red-400'}>
                                          Akkauntni aktivatsiya qilish (0.5$ to'lov)
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <span className={`w-4 h-4 rounded-full ${(user.referrals || []).length >= 5 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                      <span className={(user.referrals || []).length >= 5 ? 'text-green-400' : 'text-red-400'}>
                                          5 ta do'st taklif qilish ({(user.referrals || []).length}/5)
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div className="border-t border-white/10 my-3"></div>
                      <div>
                          <h3 className="text-sm font-bold mb-2">Telegram Hamyon</h3>
                          {user.walletAddress ? (
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center bg-slate-800/50 rounded-lg p-2">
                                      <WalletIcon />
                                      <span className="font-mono text-xs">{truncateAddress(user.walletAddress)}</span>
                                  </div>
                                  <button onClick={handleDisconnectWallet} className="bg-red-600/80 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg text-xs">O'chirish</button>
                              </div>
                          ) : (
                              <div>
                                  <p className="text-xs text-gray-400 mb-2">Airdrop va kelajakdagi tokenlar uchun hamyoningizni ulang. Bu sizning akkauntingizni aktivatsiya qiladi va listing uchun tayyorlaydi.</p>
                                  <button onClick={handleConnectWallet} className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 text-sm">
                                      <WalletIcon /> Hamyonni Ulash (Aktivatsiya)
                                  </button>
                              </div>
                          )}
                      </div>
                       <div className="border-t border-white/10 my-3"></div>
                      <FriendsList user={user} handleInviteFriend={handleInviteFriend} />
                      <Achievements achievementTemplates={achievementTemplates} unlockedAchievements={unlockedAchievements} />
                 </div>
             </div>
         </div>
    );
};

export default Profile;