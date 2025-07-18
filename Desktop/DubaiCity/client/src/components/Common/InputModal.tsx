import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputModal = ({ show, onClose, config, user }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!inputValue) {
      setError('Iltimos, qiymat kiriting');
      return;
    }
    if (config?.onConfirm) {
      config.onConfirm(inputValue);
    }
    setInputValue('');
    onClose();
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  };

  if (!show || !config) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg glass-card neon-glow max-w-md w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-4 neon-text">{config.title}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="modal-input" className="block text-sm text-gray-400 mb-1">
            {config.placeholder}
          </label>
          <input
            id="modal-input"
            name="modalInput"
            type={config.inputType || 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
            placeholder={config.placeholder}
            autoComplete="off"
          />
        </div>
        <div className="flex gap-4">
          <motion.button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold py-2 rounded-lg neon-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tasdiqlash
          </motion.button>
          <motion.button
            onClick={() => {
              setInputValue('');
              onClose();
            }}
            className="flex-1 bg-gradient-to-br from-red-400 to-red-600 text-white font-bold py-2 rounded-lg neon-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bekor qilish
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InputModal;