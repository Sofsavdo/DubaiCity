import React, { useState } from 'react';
import { useNotifier } from '../../context/NotificationContext';

interface PaymentHandlerProps {
  user: any;
  setUser: (user: any) => void;
  children: React.ReactNode;
}

export const PaymentHandler: React.FC<PaymentHandlerProps> = ({ user, setUser, children }) => {
  const notifier = useNotifier();

  const handlePayment = async (paymentData: {
    name: string;
    usdPrice: number;
    description?: string;
    onSuccess: () => void;
    onCancel?: () => void;
  }) => {
    // Define payment prices
    const paymentPrices = {
      'Bot Aktivatsiya': 0.5,
      'Kompaniya Reklama': 1.0,
      'Premium Sotib Olish': 2.0,
      'Homiylik': 0, // Variable amount
      'Auto Robot': 0 // Paid with coins only
    };

    // Check if this is a coin-only payment
    if (paymentData.name === 'Auto Robot') {
      const requiredCoins = 1000000; // 1M coins
      if (user.dubaiCoin < requiredCoins) {
        notifier.addNotification('1,000,000 coin kerak!', 'error');
        return;
      }
      
      // Deduct coins and proceed
      setUser(prev => ({
        ...prev,
        dubaiCoin: prev.dubaiCoin - requiredCoins,
        hasAutoRobot: true
      }));
      
      paymentData.onSuccess();
      notifier.addNotification('Auto robot sotib olindi!', 'success');
      return;
    }

    // For USD payments, show payment options
    const confirmPayment = window.confirm(
      `${paymentData.name} uchun $${paymentData.usdPrice} to'lov qilasizmi?\n\n` +
      'To\'lov usullari:\n' +
      '1. UzCard/Humo karta orqali\n' +
      '2. Coin orqali (1$ = 1,000,000 coin)'
    );

    if (!confirmPayment) {
      paymentData.onCancel?.();
      return;
    }

    // Ask for payment method
    const useCoins = window.confirm(
      'To\'lov usulini tanlang:\n\n' +
      'OK - Coin orqali to\'lov\n' +
      'Cancel - Karta orqali to\'lov'
    );

    if (useCoins) {
      // Coin payment
      const requiredCoins = paymentData.usdPrice * 1000000;
      if (user.dubaiCoin < requiredCoins) {
        notifier.addNotification(`${requiredCoins.toLocaleString()} coin kerak!`, 'error');
        return;
      }
      
      setUser(prev => ({
        ...prev,
        dubaiCoin: prev.dubaiCoin - requiredCoins,
        ...(paymentData.name === 'Premium Sotib Olish' && { isPremium: true }),
        ...(paymentData.name === 'Bot Aktivatsiya' && { isActive: true })
      }));
      
      paymentData.onSuccess();
      notifier.addNotification(`${requiredCoins.toLocaleString()} coin to'landi!`, 'success');
    } else {
      // Card payment - generate payment link
      const paymentUrl = generatePaymentUrl(paymentData, user);
      
      // Open payment in new tab
      window.open(paymentUrl, '_blank');
      
      // Show instruction
      notifier.addNotification('To\'lov tizimiga yo\'naltirildi', 'info');
      
      // For demo purposes, assume payment is successful after 3 seconds
      setTimeout(() => {
        setUser(prev => ({
          ...prev,
          ...(paymentData.name === 'Premium Sotib Olish' && { isPremium: true }),
          ...(paymentData.name === 'Bot Aktivatsiya' && { isActive: true })
        }));
        
        paymentData.onSuccess();
        notifier.addNotification('To\'lov muvaffaqiyatli!', 'success');
      }, 3000);
    }
  };

  const generatePaymentUrl = async (paymentData: any, user: any) => {
    try {
      // Telegram Wallet orqali to'lov
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.usdPrice,
          currency: paymentData.currency || 'USDT',
          description: paymentData.name,
          userId: user.telegramId || user.id
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data.paymentUrl;
      } else {
        throw new Error('Payment URL generation failed');
      }
    } catch (error) {
      console.error('Payment URL generation error:', error);
      // Fallback to direct Telegram Wallet link
      return `https://t.me/wallet/pay?amount=${paymentData.usdPrice}&asset=USDT&recipient=UQCyQs9OCWvwYqwfcWE5rDkH0T9B4iJyp52_6Bv64_uNyVg6&comment=${encodeURIComponent(paymentData.name)}`;
    }
  };

  // Provide payment handler to children
  return React.cloneElement(children as React.ReactElement, {
    handlePayment
  });
};

// Payment configurations
export const PAYMENT_CONFIGS = {
  BOT_ACTIVATION: {
    name: 'Bot Aktivatsiya',
    usdPrice: 0.5,
    currency: 'USDT',
    description: 'Botni to\'liq faollashtirish uchun'
  },
  PREMIUM_PURCHASE: {
    name: 'Premium Sotib Olish',
    usdPrice: 2.0,
    currency: 'TON',
    description: 'Premium a\'zolik sotib olish uchun'
  },
  COINS_1M: {
    name: '1M Coin Paket',
    usdPrice: 1.0,
    currency: 'USDT',
    description: '1,000,000 coin instant yetkazib berish'
  },
  BUSINESS_NFT: {
    name: 'Business NFT',
    usdPrice: 5.0,
    currency: 'TON',
    description: 'Premium business asset NFT'
  },
  PREMIUM_SKIN_NFT: {
    name: 'Premium Skin NFT',
    usdPrice: 3.0,
    currency: 'TON',
    description: 'Eksklyuziv premium skin NFT'
  },
  ENERGY_BOOST: {
    name: 'Energiya Kuchaytirish',
    usdPrice: 0.5,
    currency: 'USDT',
    description: '+500 maksimal energiya'
  },
  SPONSORSHIP: {
    name: 'Homiylik',
    usdPrice: 5.0,
    currency: 'TON',
    description: 'Loyihani qo\'llab-quvvatlash uchun'
  }
};