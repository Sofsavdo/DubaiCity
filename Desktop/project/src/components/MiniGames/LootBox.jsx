import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LootBox = ({ user, onBack, onReward }) => {
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState(null);

  const rewards = [
    { type: 'coin', amount: 1000, emoji: '🪙' },
    { type: 'coin', amount: 2000, emoji: '💰' },
    { type: 'energy', amount: 300, emoji: '⚡' },
  ];

  const handleOpen = () => {
    if (!user.energy || user.energy < 30) {
      alert('Energiya yetarli emas!');
      return;
    }
    setOpened(true);
    const selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(selectedReward);
    onReward(selectedReward);
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
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
      <h2 className="text-2xl font-bold text-gradient-gold mb-4 neon-text">Lootbox 🎁</h2>
      <motion.div
        className={`w-64 h-64 mx-auto rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 neon-glow ${opened ? 'opacity-50' : ''}`}
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="text-center text-white font-bold pt-24">Lootbox ochish 🎁</p>
      </motion.div>
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

export default LootBox;