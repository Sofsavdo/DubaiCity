import React, { useState } from 'react';
import { Modal } from './Modal';
import { useNotifier } from '../../context/NotificationContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    name: string;
    usdPrice: number;
    description?: string;
    onConfirm: () => void;
  } | null;
  user: any;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, paymentData, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'coins'>('wallet');
  const notifier = useNotifier();

  if (!paymentData) return null;

  const handlePayment = async () => {
    if (paymentMethod === 'wallet') {
      // Wallet payment - generate payment link
      setIsProcessing(true);
      
      try {
        // Create payment URL for UzCard/Humo
        const paymentUrl = `https://click.uz/pay?amount=${paymentData.usdPrice}&description=${encodeURIComponent(paymentData.name)}&user_id=${user.id}`;
        
        // Open payment in new tab
        window.open(paymentUrl, '_blank');
        
        // Show success message
        notifier.addNotification('To\'lov tizimiga yo\'naltirildi', 'success');
        
        // Close modal and execute callback
        onClose();
        paymentData.onConfirm();
        
      } catch (error) {
        notifier.addNotification('To\'lov xatolik yuz berdi', 'error');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Coin payment - direct deduction
      const requiredCoins = paymentData.usdPrice * 1000000; // 1 USD = 1M coins
      
      if (user.dubaiCoin < requiredCoins) {
        notifier.addNotification('Yetarli coin yo\'q!', 'error');
        return;
      }
      
      // Deduct coins and proceed
      paymentData.onConfirm();
      onClose();
      notifier.addNotification(`${requiredCoins.toLocaleString()} coin to\'landi`, 'success');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="To'lov">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">{paymentData.name}</h3>
          <p className="text-2xl font-bold text-yellow-400">${paymentData.usdPrice}</p>
          {paymentData.description && (
            <p className="text-sm text-gray-400 mt-2">{paymentData.description}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                paymentMethod === 'wallet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              💳 Karta orqali
            </button>
            <button
              onClick={() => setPaymentMethod('coins')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                paymentMethod === 'coins'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🪙 Coin orqali
            </button>
          </div>

          {paymentMethod === 'wallet' && (
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-3">
              <p className="text-sm text-blue-300">
                💳 UzCard/Humo karta orqali to'lov qilishingiz mumkin. 
                To'lov tizimiga yo'naltirilasiz.
              </p>
            </div>
          )}

          {paymentMethod === 'coins' && (
            <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-3">
              <p className="text-sm text-yellow-300">
                🪙 Kerakli coin: {(paymentData.usdPrice * 1000000).toLocaleString()}
              </p>
              <p className="text-sm text-yellow-300">
                💰 Sizning coinlar: {user.dubaiCoin?.toLocaleString() || 0}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'coins' && user.dubaiCoin < paymentData.usdPrice * 1000000)}
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isProcessing ? 'Jarayonda...' : 'To\'lov qilish'}
          </button>
        </div>
      </div>
    </Modal>
  );
};