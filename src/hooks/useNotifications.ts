import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                new Notification('通知が許可されました', {
                    body: 'このようにお知らせします',
                    icon: '/icon-192x192.png'
                });
            }
        } catch (error) {
            console.error('Notification permission error:', error);
        }
    }, []);

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (permission === 'granted') {
            new Notification(title, {
                icon: '/icon-192x192.png',
                ...options
            });
        }
    }, [permission]);

    return { permission, requestPermission, sendNotification };
};
