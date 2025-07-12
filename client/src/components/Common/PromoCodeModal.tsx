import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumberFull } from '../../utils/helpers';

const PromoCodeModal = ({ isOpen, onClose, promoCode, onCopy, onShare, onUse }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (promoCode && promoCode.expiresAt) {
      const interval = setInterval(() => {
        const now = Date.now();
        const expires = new Date(promoCode.expiresAt).getTime();
        const remaining = Math.max(0, expires - now);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [promoCode]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (days > 0) return `${days}k ${hours}s ${minutes}d ${seconds}son`;
    if (hours > 0) return `${hours}s ${minutes}d ${seconds}son`;
    if (minutes > 0) return `${minutes}d ${seconds}son`;
    return `${seconds}son`;
  };

  const handleCopy = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(promoCode.code);
    }
  };

  const handleShare = () => {
    if (promoCode) {
      const shareText = `🎁 Maxsus promo kod: ${promoCode.code}\n💰 Mukofot: ${formatNumberFull(promoCode.reward)} DC\n⏰ Muddati: ${formatTime(timeLeft)}\n\nTez oling! 🏃‍♂️`;
      const shareUrl = `https://t.me/share/text?text=${encodeURIComponent(shareText)}`;
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink(shareUrl);
      } else {
        navigator.clipboard.writeText(shareText);
      }
      onShare?.(promoCode);
    }
  };

  const handleUse = () => {
    if (promoCode && promoCode.externalLink) {
      window.open(promoCode.externalLink, '_blank');
    }
    onUse?.(promoCode);
  };

  if (!isOpen || !promoCode) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-sm w-full border border-amber-500/30 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="text-4xl mb-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🎁
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-2">Promo Kod</h2>
            <p className="text-gray-400 text-sm">{promoCode.description}</p>
          </div>

          {/* Promo Code */}
          <div className="bg-black/30 rounded-lg p-4 mb-4 border border-amber-500/20">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Promo Kod</p>
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-lg px-4 py-2 rounded-lg mb-2">
                {promoCode.code}
              </div>
              <p className="text-green-400 font-semibold">
                💰 {formatNumberFull(promoCode.reward)} DC
              </p>
            </div>
          </div>

          {/* Timer */}
          {timeLeft > 0 && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <div className="text-center">
                <p className="text-red-400 text-xs mb-1">Muddati tugashiga</p>
                <div className="text-red-300 font-bold text-lg">
                  ⏰ {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
            >
              {copied ? '✅ Nusxalandi!' : '📋 Nusxalash'}
            </motion.button>
            
            <motion.button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUse}
            >
              🔗 Ishlatish
            </motion.button>
            
            <motion.button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
            >
              📤 Telegram'da ulashish
            </motion.button>
          </div>

          {/* Close Button */}
          <motion.button
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoCodeModal;