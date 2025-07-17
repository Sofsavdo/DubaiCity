import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Telegram Web App ni global window ob'ektidan olish
const WebApp = window.Telegram?.WebApp;
if (WebApp) {
    WebApp.ready();
}

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
                    <h1 role="alert">Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.</h1>
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

// Production'da console warning'larni yashirish
if (isProduction) {
    console.warn = () => {};
    console.log = () => {};
}

const rootElement = document.getElementById('root');
if (rootElement) {
    // Check if root already exists to prevent duplicate creation
    if (!rootElement.hasAttribute('data-react-root')) {
        rootElement.setAttribute('data-react-root', 'true');
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            isProduction ? (
                <AppWrapper />
            ) : (
                <React.StrictMode>
                    <AppWrapper />
                </React.StrictMode>
            )
        );
    }
}