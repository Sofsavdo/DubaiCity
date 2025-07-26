import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Coins } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'coins';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  coins?: number;
}

interface ToastNotificationProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  coins: Coins,
};

const toastColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  coins: 'bg-dubai-gold',
};

const toastTextColors = {
  success: 'text-white',
  error: 'text-white',
  info: 'text-white',
  coins: 'text-dubai-dark',
};

export function ToastNotificationContainer({ notifications, onRemove }: ToastNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  notification: ToastNotification;
  onRemove: (id: string) => void;
}

function ToastItem({ notification, onRemove }: ToastItemProps) {
  const { id, type, title, message, duration = 3000, coins } = notification;
  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`
        ${toastColors[type]} ${toastTextColors[type]}
        rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]
        pointer-events-auto relative
      `}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="font-semibold text-sm">{title}</div>
          {message && (
            <div className="text-xs mt-1 opacity-90">{message}</div>
          )}
          {coins && (
            <div className="text-sm font-bold mt-1">
              +{coins.toLocaleString()} coins
            </div>
          )}
        </div>
        
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 rounded-b-lg"
      />
    </motion.div>
  );
}

// Toast manager hook
export function useToastNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  };

  const showError = (title: string, message?: string) => {
    addNotification({ type: 'error', title, message });
  };

  const showInfo = (title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  };

  const showCoins = (coins: number, title: string = 'Coins Earned!') => {
    addNotification({ type: 'coins', title, coins });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showCoins,
    removeNotification,
    ToastContainer: () => (
      <ToastNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    ),
  };
}
