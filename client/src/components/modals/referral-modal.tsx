import { useGame } from "@/hooks/use-game";
import { useTelegram } from "@/hooks/use-telegram";
import { formatNumber } from "@/lib/game-utils";
import { X, Users, Copy, Share2, Gift } from "lucide-react";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const { user } = useGame();
  const { tg } = useTelegram();

  if (!isOpen || !user) return null;

  const referralLink = `https://t.me/DubaiCITY_robot?start=${user.telegramId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = 'Referral link copied!';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const shareReferral = () => {
    const text = `Join me in Dubai City! Build your empire and earn coins! 🏙️`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    
    if (tg) {
      tg.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-dubai-gold">Refer Friends</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-dubai-gold rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8 text-dubai-dark" />
          </div>
          <div className="text-gray-300 text-sm mb-2">
            Earn <span className="text-dubai-gold font-bold">5,000 coins</span> for each friend!
          </div>
          <div className="text-gray-400 text-xs">
            Your friends get <span className="text-dubai-gold">2,000 bonus coins</span> too!
          </div>
        </div>
        
        <div className="bg-dubai-dark rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-dubai-gold font-bold text-lg mb-2">Your Referral Code</div>
            <div className="bg-dubai-card rounded-lg p-3 font-mono text-dubai-gold text-lg">
              {user.referralCode}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-dubai-dark rounded-lg p-3 text-center">
            <div className="text-dubai-gold font-bold text-xl">
              {user.referralCount}
            </div>
            <div className="text-gray-400 text-sm">Friends Invited</div>
          </div>
          <div className="bg-dubai-dark rounded-lg p-3 text-center">
            <div className="text-dubai-gold font-bold text-xl">
              {formatNumber(user.referralEarnings)}
            </div>
            <div className="text-gray-400 text-sm">Coins Earned</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={shareReferral}
            className="w-full bg-dubai-gold text-dubai-dark font-bold py-3 rounded-lg flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Referral Link
          </button>
          
          <button 
            onClick={copyToClipboard}
            className="w-full bg-dubai-blue text-white font-bold py-3 rounded-lg flex items-center justify-center"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy Link
          </button>
        </div>
        
        <div className="mt-4 bg-dubai-dark rounded-lg p-3">
          <div className="flex items-center text-dubai-gold font-bold mb-2">
            <Gift className="w-4 h-4 mr-2" />
            Referral Rewards
          </div>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• You earn 5,000 coins for each friend</li>
            <li>• Your friends get 2,000 bonus coins</li>
            <li>• No limit on referrals</li>
            <li>• Instant reward on friend's first login</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
