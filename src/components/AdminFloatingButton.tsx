import React from 'react';
import { Settings } from 'lucide-react';

/**
 * Botón flotante para acceder al admin desde la web pública
 * Solo se muestra cuando el usuario está logueado como admin
 */
const AdminFloatingButton: React.FC = () => {
    const handleGoToAdmin = () => {
        window.open('/admin/dashboard', '_blank');
    };

    return (
        <button
            onClick={handleGoToAdmin}
            className="fixed bottom-6 right-6 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100"
            title="Ir al Admin"
        >
            <Settings className="h-5 w-5" />
        </button>
    );
};

export default AdminFloatingButton;
