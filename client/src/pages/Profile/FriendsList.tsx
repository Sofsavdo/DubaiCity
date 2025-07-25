import React from 'react';
import { ShareIcon } from '../../components/Icons';
import { formatNumberShort } from '../../utils/helpers';

const FriendsList = ({ user, handleInviteFriend }) => {
  
  const handleInviteClick = () => {
    const WebApp = window.Telegram?.WebApp;
    if (WebApp) {
      const botUsername = "DubaiCityUzBot";
      const referralId = `${user.id}_${Date.now()}`;
      const inviteLink = `https://t.me/${botUsername}?start=ref_${referralId}`;
      const shareText = `Mening Dubay shahri o'yinimga qo'shiling va birgalikda boylik to'playmiz!`;
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
      
      WebApp.openTelegramLink(shareUrl);
      
      // Referal bonusini qo'shish
      handleInviteFriend();
    } else {
      alert('Bu funksiya faqat Telegram ilovasida ishlaydi');
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-center">
        <h2 className="text-xl font-bold text-white">Do'stlarni taklif qiling!</h2>
        <p className="text-gray-300 mt-2">Siz va do'stingiz bonuslarga ega bo'lasiz</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-left">
            <span>Oddiy do'st uchun:</span>
            <span className="font-bold text-yellow-300">+5,000</span>
          </div>
          <div className="flex justify-between items-center text-left">
            <span>Premium do'st uchun:</span>
            <span className="font-bold text-yellow-300">+25,000</span>
          </div>
        </div>
        <button 
          onClick={handleInviteClick} 
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <ShareIcon /> Taklif qilish
        </button>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Do'stlaringiz ro'yxati ({(user.referrals || []).length})</h3>
        <div className="space-y-2">
          {(user.referrals || []).map(friend => (
            <div key={friend.id} className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 flex items-center gap-3">
              <img src={`https://placehold.co/40x40/090979/ffffff?text=${(friend.name || '').charAt(0)}`} className="w-10 h-10 rounded-full"/>
              <div className="flex-grow">
                <p className="font-bold">{friend.name}</p>
              </div>
              <span className="font-bold text-green-400">+{formatNumberShort(friend.isPremium ? 25000 : 5000)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;