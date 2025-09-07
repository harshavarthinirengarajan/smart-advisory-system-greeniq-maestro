import React from 'react';
import type { Notification } from '../types';
import { AlertIcon, InfoIcon, CheckCircleIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: Notification[];
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'alert':
            return <AlertIcon className="w-6 h-6 text-red-500" />;
        case 'info':
            return <InfoIcon className="w-6 h-6 text-blue-500" />;
        case 'success':
            return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        default:
            return null;
    }
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, notifications }) => {
    const { t } = useTranslations();
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold font-display text-gray-800">{t('notifications')}</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center p-8">{t('noNewNotifications')}</p>
                ) : (
                    <ul>
                        {notifications.map((notif, index) => (
                            <li key={notif.id} className={`flex items-start p-4 space-x-3 transition-colors ${index < notifications.length - 1 ? 'border-b border-gray-100' : ''} ${!notif.read ? 'bg-primary-50' : 'bg-white'}`}>
                                <div className="flex-shrink-0 mt-1">
                                    <NotificationIcon type={notif.type} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{notif.title}</p>
                                    <p className="text-sm text-gray-600">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notif.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};