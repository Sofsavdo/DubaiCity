import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import './assets/styles/main.css';

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
    <NotificationProvider>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </NotificationProvider>
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