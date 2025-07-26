import { createContext, useContext, useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
    query_id?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  ready: () => void;
  close: () => void;
  expand: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text: string }> }) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (result: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback?: (result: string) => void) => void;
  closeScanQrPopup: () => void;
  requestWriteAccess: (callback?: (result: boolean) => void) => void;
  requestContact: (callback?: (result: boolean) => void) => void;
  invokeCustomMethod: (method: string, params?: Record<string, any>, callback?: (result: any) => void) => void;
}

interface TelegramContextType {
  tg: TelegramWebApp | null;
  user: TelegramUser | null;
  startParam: string | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  tg: null,
  user: null,
  startParam: null,
  isReady: false,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [startParam, setStartParam] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const webapp = window.Telegram.WebApp;
        setTg(webapp);
        setUser(webapp.initDataUnsafe.user || null);
        setStartParam(webapp.initDataUnsafe.start_param || null);
        
        try {
          webapp.ready();
          webapp.expand();
        } catch (error) {
          console.warn('Telegram WebApp methods not available:', error);
        }
        setIsReady(true);
      } else {
        // For development purposes, create a mock user
        if (process.env.NODE_ENV === 'development' || 
            window.location.hostname.includes('webcontainer') || 
            window.location.hostname.includes('replit') ||
            window.location.hostname.includes('localhost') ||
            import.meta.env.VITE_ENABLE_PREVIEW_MODE === 'true') {
          setUser({
            id: 999999999,
            first_name: 'Preview',
            last_name: 'User',
            username: 'preview_user',
            language_code: 'en',
          });
          setStartParam(null);
          // Mock Telegram WebApp object for preview
          const mockTg = {
            ready: () => console.log('🎮 Mock Telegram ready'),
            expand: () => console.log('🎮 Mock Telegram expand'),
            close: () => console.log('🎮 Mock Telegram close'),
            showAlert: (message: string, callback?: () => void) => {
              alert(message);
              callback?.();
            },
            showConfirm: (message: string, callback?: (result: boolean) => void) => {
              const result = confirm(message);
              callback?.(result);
            },
            openTelegramLink: (url: string) => {
              console.log('🔗 Would open Telegram link:', url);
              window.open(url, '_blank');
            },
            HapticFeedback: {
              impactOccurred: (style: string) => console.log('📳 Haptic feedback:', style),
              notificationOccurred: (type: string) => console.log('🔔 Notification:', type),
              selectionChanged: () => console.log('🎯 Selection changed'),
            },
          } as any;
          setTg(mockTg);
          setIsReady(true);
          console.log('🎮 Preview mode enabled - using mock Telegram user');
        }
      }
    };

    initTelegram();

    // Load Telegram Web App script if not already loaded
    if (typeof window !== 'undefined' && !window.Telegram) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = initTelegram;
      try {
        document.head.appendChild(script);
      } catch (error) {
        console.warn('Could not load Telegram script:', error);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ tg, user, startParam, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}

// Extend window type for TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
