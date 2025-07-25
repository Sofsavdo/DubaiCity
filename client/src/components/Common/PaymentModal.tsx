import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentModal = ({ show, onClose, item, user, onPaymentSuccess, ADMIN_WALLET_ADDRESS }) => {
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!transactionId) {
      setError('Tranzaksiya ID’sini kiriting');
      return;
    }
    // Backend'ga tranzaksiya ID’sini yuborish (API orqali tasdiqlash)
    // Bu yerda faqat misol, haqiqiy backend integratsiyasi kerak
    if (onPaymentSuccess) {
      onPaymentSuccess({ item, transactionId });
    }
    setTransactionId('');
    onClose();
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
  };

  if (!show) return null;

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
        <h2 className="text-2xl font-bold text-gradient-gold mb-4 neon-text">To'lov: {item?.name} 💳</h2>
        <p className="text-gray-400 mb-4">
          Iltimos, quyidagi Telegram kashalok manziliga {item?.usdPrice}$ o‘tkazing: <br />
          <strong>{ADMIN_WALLET_ADDRESS}</strong>
        </p>
        <p className="text-gray-400 mb-4">O‘tkazmadan so‘ng tranzaksiya ID’sini kiriting.</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleConfirmPayment}>
          <div className="mb-4">
            <label htmlFor="transaction-id" className="block text-sm text-gray-400 mb-1">
              Tranzaksiya ID
            </label>
            <input
              id="transaction-id"
              name="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
              placeholder="Tranzaksiya ID’sini kiriting"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-4">
            <motion.button
              type="submit"
              className="flex-1 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold py-2 rounded-lg neon-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tasdiqlash ✅
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gradient-to-br from-red-400 to-red-600 text-white font-bold py-2 rounded-lg neon-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bekor qilish 🚫
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;