import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000, id) => {
    const notificationId = id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setNotifications((prev) => {
      // Bir xil ID yoki xabar bilan bildirishnoma mavjudligini tekshirish
      if (prev.some((n) => n.id === notificationId || n.message === message)) {
        return prev;
      }
      
      // Maksimal 3 ta bildirishnoma ko'rsatish
      const newNotifications = [...prev, { id: notificationId, message, type, duration }];
      return newNotifications.slice(-3);
    });

    // Bildirishnomani avtomatik o'chirish
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs">
        <AnimatePresence>
          {notifications.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg shadow-lg neon-glow text-white flex items-center justify-between text-sm ${
                type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-700' :
                type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-700' :
                type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700' :
                'bg-gradient-to-r from-cyan-400 to-blue-500'
              }`}
            >
              <span className="neon-text flex-1 pr-2">{message}</span>
              <button
                onClick={() => removeNotification(id)}
                className="ml-2 text-white hover:text-yellow-300 font-bold text-lg leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifier must be used within a NotificationProvider');
  }
  return context;
};