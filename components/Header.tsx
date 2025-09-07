import React, { useState, useRef, useEffect } from 'react';
import { LeafIcon } from './IconComponents';
import { SettingsModal } from './SettingsModal';
import { NotificationPanel } from './NotificationPanel';
import type { Notification } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface HeaderProps {
    onSignOut: () => void;
    voiceEnabled: boolean;
    onVoiceEnabledChange: (enabled: boolean) => void;
    notifications: Notification[];
    onMarkNotificationsAsRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSignOut, 
  voiceEnabled, 
  onVoiceEnabledChange,
  notifications,
  onMarkNotificationsAsRead
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(prev => {
        if (!prev) { // If opening, mark as read
            onMarkNotificationsAsRead();
        }
        return !prev;
    });
  };
  
  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <LeafIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-display text-primary-800 tracking-tight">
                {t('appName')}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative" ref={notificationsRef}>
                <button 
                    onClick={handleNotificationsToggle}
                    className="p-2 rounded-full hover:bg-gray-100 transition duration-150 relative" 
                    aria-label={t('notifications')}
                >
                    <BellIcon />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
                <NotificationPanel 
                    isOpen={isNotificationsOpen} 
                    notifications={notifications}
                />
              </div>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-150"
                aria-label={t('openSettings')}
              >
                <SettingsIcon />
              </button>
              <button 
                onClick={onSignOut}
                className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 text-sm"
              >
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceEnabled={voiceEnabled}
        onVoiceToggle={onVoiceEnabledChange}
      />
    </>
  );
};

const BellIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);