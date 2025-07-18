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

  const generatePaymentUrl = (paymentData: any, user: any) => {
    // Generate payment URL for UzCard/Humo integration
    const baseUrl = 'https://click.uz/pay';
    const params = new URLSearchParams({
      amount: paymentData.usdPrice.toString(),
      description: paymentData.name,
      user_id: user.id?.toString() || 'anonymous',
      return_url: window.location.origin,
      merchant_id: 'dubai_city_bot'
    });
    
    return `${baseUrl}?${params.toString()}`;
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
    description: 'Botni to\'liq faollashtirish uchun'
  },
  COMPANY_ADS: {
    name: 'Kompaniya Reklama',
    usdPrice: 1.0,
    description: 'Kompaniya e\'loni joylash uchun'
  },
  PREMIUM_PURCHASE: {
    name: 'Premium Sotib Olish',
    usdPrice: 2.0,
    description: 'Premium a\'zolik sotib olish uchun'
  },
  SPONSORSHIP: {
    name: 'Homiylik',
    usdPrice: 0, // Variable
    description: 'Loyihani qo\'llab-quvvatlash uchun'
  },
  AUTO_ROBOT: {
    name: 'Auto Robot',
    usdPrice: 0, // Coin only
    coinPrice: 1000000,
    description: 'Avtomatik coin yig\'ish roboti'
  }
};