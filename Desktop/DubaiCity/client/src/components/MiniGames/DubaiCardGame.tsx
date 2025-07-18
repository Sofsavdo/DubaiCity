import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DubaiCardGame = ({ user, onBack, onWin }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const cards = [
    { id: 1, reward: { type: 'coin', amount: 1000 }, emoji: '🪙' },
    { id: 2, reward: { type: 'coin', amount: 500 }, emoji: '💰' },
    { id: 3, reward: { type: 'energy', amount: 100 }, emoji: '⚡' },
  ];

  const handleCardSelect = (card) => {
    if (!user.energy || user.energy < 10) {
      alert('Energiya yetarli emas!');
      return;
    }
    setSelectedCard(card.id);
    setGameResult(card.reward);
    onWin(card.reward);
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
      <h2 className="text-2xl font-bold text-gradient-gold mb-4 neon-text">Dubay Kartasi 🎴</h2>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardSelect(card)}
            className={`p-4 glass-card rounded-lg cursor-pointer neon-glow ${selectedCard === card.id ? 'highlight' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-2xl">{card.emoji}</p>
            <p className="text-white font-bold">Karta {card.id}</p>
          </motion.div>
        ))}
      </div>
      {gameResult && (
        <motion.p
          className="mt-4 text-green-400 font-bold neon-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Yutuq: {gameResult.amount} {gameResult.type === 'coin' ? '🪙' : '⚡'}
        </motion.p>
      )}
    </motion.div>
  );
};

export default DubaiCardGame;