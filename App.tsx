import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SignIn } from './components/SignIn';
import type { Notification } from './types';
import { useTranslations } from './hooks/useTranslations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voiceNotificationsEnabled, setVoiceNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { locale } = useTranslations();

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleVoiceEnabledChange = (enabled: boolean) => {
    setVoiceNotificationsEnabled(enabled);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Keep last 20
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };


  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Header
        onSignOut={handleSignOut}
        voiceEnabled={voiceNotificationsEnabled}
        onVoiceEnabledChange={handleVoiceEnabledChange}
        notifications={notifications}
        onMarkNotificationsAsRead={markAllAsRead}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard 
          voiceNotificationsEnabled={voiceNotificationsEnabled} 
          onNewNotification={addNotification}
          locale={locale}
        />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GREENIQ MAESTRO. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;