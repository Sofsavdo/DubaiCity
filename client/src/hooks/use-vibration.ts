import { useEffect, useRef } from 'react';

export function useVibration() {
  const isEnabledRef = useRef(true);

  useEffect(() => {
    // Check if vibration is enabled in settings
    const vibrationEnabled = localStorage.getItem('dubai-vibration') !== 'false';
    isEnabledRef.current = vibrationEnabled;

    // Listen for settings changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dubai-vibration') {
        isEnabledRef.current = e.newValue !== 'false';
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const vibrate = (pattern: number | number[] = 50) => {
    if (!isEnabledRef.current) return;

    try {
      // Browser vibration API
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }

      // Telegram Web App haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        if (typeof pattern === 'number') {
          if (pattern <= 50) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
          } else if (pattern <= 100) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          } else {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
          }
        } else {
          // For pattern arrays, use medium impact
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
      }
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  };

  const vibrateSuccess = () => {
    vibrate([50, 100, 50]);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const vibrateError = () => {
    vibrate([100, 50, 100]);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
  };

  const vibrateWarning = () => {
    vibrate([75, 75, 75]);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    }
  };

  const vibrateSelection = () => {
    vibrate(25);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
  };

  const setEnabled = (enabled: boolean) => {
    isEnabledRef.current = enabled;
    localStorage.setItem('dubai-vibration', enabled.toString());
  };

  return {
    vibrate,
    vibrateSuccess,
    vibrateError,
    vibrateWarning,
    vibrateSelection,
    setEnabled,
    isEnabled: () => isEnabledRef.current,
  };
}

// Vibration patterns for different game events
export const VibrationPatterns = {
  tap: 25,
  coin: 50,
  levelUp: [100, 50, 100, 50, 100],
  purchase: [75, 50, 75],
  error: [150, 100, 150],
  notification: [50, 100, 50],
  achievement: [100, 50, 50, 50, 100],
};

// Global vibration utility
export class VibrationManager {
  private static instance: VibrationManager;
  private enabled: boolean = true;

  static getInstance(): VibrationManager {
    if (!VibrationManager.instance) {
      VibrationManager.instance = new VibrationManager();
    }
    return VibrationManager.instance;
  }

  constructor() {
    this.enabled = localStorage.getItem('dubai-vibration') !== 'false';
    
    // Listen for settings changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'dubai-vibration') {
        this.enabled = e.newValue !== 'false';
      }
    });
  }

  vibrate(pattern: number | number[] = 50) {
    if (!this.enabled) return;

    try {
      // Browser vibration API
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }

      // Telegram Web App haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        if (typeof pattern === 'number') {
          if (pattern <= 50) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
          } else if (pattern <= 100) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          } else {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
          }
        } else {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
      }
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }

  success() {
    this.vibrate(VibrationPatterns.levelUp);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }

  error() {
    this.vibrate(VibrationPatterns.error);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('dubai-vibration', enabled.toString());
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Global vibration manager instance
export const vibrationManager = VibrationManager.getInstance();
