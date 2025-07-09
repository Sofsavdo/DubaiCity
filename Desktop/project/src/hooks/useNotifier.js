import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifier must be used within a NotificationProvider');
  }
  return context;
};