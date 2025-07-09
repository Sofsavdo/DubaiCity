import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SpinWheel = ({ user, onBack, onReward }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);

  const rewards = [
    { type: 'coin', amount: 500, emoji: '🪙' },
    { type: 'coin', amount: 1000, emoji: '💰' },
    { type: 'energy', amount: 200, emoji: '⚡' },
    { type: 'coin', amount: 2000, emoji: '💎' },
  ];

  const handleSpin = () => {
    if (!user.energy || user.energy < 20) {
      alert('Energiya yetarli emas!');
      return;
    }
    setSpinning(true);
    const randomRotation = Math.floor(Math.random() * 360) + 720; // 2+ aylanish
    setRotation(randomRotation);
    const rewardIndex = Math.floor((randomRotation % 360) / (360 / rewards.length));
    setTimeout(() => {
      setSpinning(false);
      const selectedReward = rewards[rewardIndex];
      setReward(selectedReward);
      onReward(selectedReward);
      window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    }, 3000);
  };

  return (
    <motion.div
      className="p-4 bg-gradient-to-b from-gray-900 to-black min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        onClick={onBack}
        className="mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg neon-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Orqaga ⬅️
      </motion.button>
      <h2 className="text-2xl font-bold text-gradient-gold mb-4 neon-text">Spin G‘ildiragi 🎡</h2>
      <motion.div
        className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 neon-glow"
        animate={{ rotate: rotation }}
        transition={{ duration: 3, ease: 'easeOut' }}
      >
        <div className="absolute w-full h-full grid grid-cols-2 gap-1">
          {rewards.map((r, i) => (
            <div key={i} className="text-center text-white font-bold">
              {r.emoji} {r.amount}
            </div>
          ))}
        </div>
      </motion.div>
      <motion.button
        onClick={handleSpin}
        disabled={spinning}
        className={`mt-4 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg neon-glow ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Aylantirish 🔄
      </motion.button>
      {reward && (
        <motion.p
          className="mt-4 text-green-400 font-bold neon-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Yutuq: {reward.amount} {reward.emoji}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SpinWheel;