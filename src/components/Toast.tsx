import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animar entrada
        const timer = setTimeout(() => setIsVisible(true), 100);

        // Auto cerrar
        const autoCloseTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(autoCloseTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Check className="h-5 w-5 text-green-600" />;
            case 'error':
                return <X className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-600" />;
            default:
                return <Info className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStyles = () => {
        const baseStyles = "bg-white border-l-4 shadow-lg rounded-lg p-4 mb-3 transition-all duration-300 transform";

        switch (type) {
            case 'success':
                return `${baseStyles} border-green-500 ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
            case 'error':
                return `${baseStyles} border-red-500 ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
            case 'warning':
                return `${baseStyles} border-yellow-500 ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
            case 'info':
                return `${baseStyles} border-blue-500 ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
            default:
                return `${baseStyles} border-gray-500 ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
        }
    };

    return (
        <div className={getStyles()}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    {message && (
                        <p className="text-sm text-gray-600 mt-1">{message}</p>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={handleClose}
                        className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
