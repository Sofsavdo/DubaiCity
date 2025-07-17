import React, { useState } from 'react';
import Modal from './Modal';

const SimplePaymentModal = ({ isOpen, onClose, paymentData, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState('ton');
    const [isProcessing, setIsProcessing] = useState(false);
    
    if (!paymentData) return null;
    
    const handlePayment = async () => {
        setIsProcessing(true);
        console.log('To\'lov boshlandi:', paymentData);
        
        try {
            // TON to'lov ma'lumotlarini tayyorlash
            const tonPayment = {
                title: paymentData.name,
                description: paymentData.description || `${paymentData.name} sotib olish`,
                payload: `payment_${Date.now()}`,
                amount: paymentData.usdPrice.toString()
            };

            console.log('TON to\'lov ma\'lumotlari:', tonPayment);

            // Backend'ga TON to'lov yaratish so'rovi
            const response = await fetch('/api/telegram/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tonPayment)
            });

            console.log('Backend javobi:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('TON to\'lov yaratildi:', result);
                
                // TON kashalok orqali to'lov
                const tonUrl = result.data.tonUrl;
                const webAppUrl = result.data.webAppUrl;
                
                console.log('TON URL:', tonUrl);
                console.log('Web App URL:', webAppUrl);
                
                // Telegram Web App muhitini tekshirish
                if (window.Telegram?.WebApp) {
                    const WebApp = window.Telegram.WebApp;
                    console.log('Telegram Web App mavjud');
                    
                    // TON kashalok ochish
                    try {
                        if (WebApp.openTelegramLink) {
                            console.log('openTelegramLink ishlatilmoqda');
                            WebApp.openTelegramLink(tonUrl);
                        } else if (WebApp.openLink) {
                            console.log('openLink ishlatilmoqda');
                            WebApp.openLink(webAppUrl);
                        } else {
                            console.log('window.open ishlatilmoqda');
                            window.open(webAppUrl, '_blank');
                        }
                        
                        // To'lov tugagandan keyin 3 soniya kutish
                        setTimeout(() => {
                            console.log('To\'lov tugadi, modal yopilmoqda');
                            if (onConfirm) {
                                onConfirm();
                            }
                            onClose();
                        }, 3000);
                    } catch (error) {
                        console.error('TON wallet error:', error);
                        // Demo rejimi
                        setTimeout(() => {
                            if (onConfirm) {
                                onConfirm();
                            }
                            onClose();
                        }, 1000);
                    }
                } else {
                    console.log('Telegram Web App mavjud emas - demo rejimi');
                    // Demo rejimi
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    if (onConfirm) {
                        onConfirm();
                    }
                    onClose();
                }
            } else {
                console.error('Backend xatosi:', response.status);
                // Backend xatosi - demo rejimi
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (onConfirm) {
                    onConfirm();
                }
                onClose();
            }
        } catch (error) {
            console.error('Payment error:', error);
            
            // Xato holatida demo rejimi
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (onConfirm) {
                onConfirm();
            }
            onClose();
        }
        
        setIsProcessing(false);
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="glass-card p-6 max-w-sm mx-auto">
                <h2 className="text-xl font-bold text-white mb-4 text-center">
                    {paymentData.name}
                </h2>
                
                <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-blue-400">
                        {paymentData.usdPrice} TON
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        ≈ ${paymentData.usdPrice} (~{paymentData.usdPrice * 12500} so'm)
                    </p>
                </div>
                
                <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-bold text-white">To'lov usuli:</h3>
                    
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-600 cursor-pointer hover:bg-blue-800/30 bg-blue-900/20">
                            <input
                                type="radio"
                                name="payment"
                                value="ton"
                                checked={paymentMethod === 'ton'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="text-blue-500"
                            />
                            <span className="text-white">💎 TON Kashalok</span>
                        </label>
                        
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-800/50">
                            <input
                                type="radio"
                                name="payment"
                                value="uzcard"
                                checked={paymentMethod === 'uzcard'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="text-blue-500"
                            />
                            <span className="text-white">💳 UzCard</span>
                        </label>
                        
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-800/50">
                            <input
                                type="radio"
                                name="payment"
                                value="humo"
                                checked={paymentMethod === 'humo'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="text-blue-500"
                            />
                            <span className="text-white">💳 Humo</span>
                        </label>
                        
                        {paymentData.allowCoins && (
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-800/50">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="coins"
                                    checked={paymentMethod === 'coins'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-blue-500"
                                />
                                <span className="text-white">🪙 Tangalar ({paymentData.coinPrice?.toLocaleString()})</span>
                            </label>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Bekor qilish
                    </button>
                    
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? 'Jarayonda...' : (paymentMethod === 'ton' ? '💎 TON bilan to\'lash' : 'To\'lash')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SimplePaymentModal;