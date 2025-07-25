import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import './assets/styles/main.css';

// Telegram Web App ni global window ob'ektidan olish
const WebApp = window.Telegram?.WebApp;
if (WebApp) {
    WebApp.ready();
}

// PWA va xato boshqaruvi
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    // PWA install prompt ni keyinroq ko'rsatish uchun saqlash
    window.deferredPrompt = e;
});

// Browser xatolarini boshqarish
window.addEventListener('error', (event) => {
    console.warn('Browser error caught:', event.error);
    // TikTok analytics va boshqa tashqi xizmat xatolarini ignore qilish
    if (event.filename && (
        event.filename.includes('tiktok.com') ||
        event.filename.includes('analytics') ||
        event.message.includes('message port closed')
    )) {
        event.preventDefault();
        return false;
    }
});

// Unhandled promise rejection uchun
window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    // Network xatolarini ignore qilish
    if (event.reason && (
        event.reason.message?.includes('ERR_NETWORK_CHANGED') ||
        event.reason.message?.includes('Failed to fetch')
    )) {
        event.preventDefault();
        return false;
    }
});

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
                    <div className="text-center">
                        <h1 role="alert" className="text-xl font-bold mb-4">
                            Xatolik yuz berdi
                        </h1>
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                            onClick={() => window.location.reload()}
                        >
                            Qayta yuklash
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const AppWrapper = () => (
    <ErrorBoundary>
        <NotificationProvider>
            <App />
        </NotificationProvider>
    </ErrorBoundary>
);

const isProduction = process.env.NODE_ENV === 'production';

ReactDOM.createRoot(document.getElementById('root')).render(
    isProduction ? (
        <AppWrapper />
    ) : (
        <React.StrictMode>
            <AppWrapper />
        </React.StrictMode>
    )
);