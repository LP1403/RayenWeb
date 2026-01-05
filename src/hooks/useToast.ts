import { useState, useCallback } from 'react';

export interface ToastData {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastData = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'success', title, message, duration });
    }, [addToast]);

    const error = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'error', title, message, duration });
    }, [addToast]);

    const warning = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'warning', title, message, duration });
    }, [addToast]);

    const info = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'info', title, message, duration });
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    };
};
