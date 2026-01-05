import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook para detectar si el usuario está logueado como admin
 * y manejar el estado de autenticación para la web pública
 */
export const useAdminAuth = () => {
    const { user } = useAuth();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    useEffect(() => {
        // Verificar si hay un usuario autenticado
        if (user) {
            setIsAdminLoggedIn(true);
            // Guardar en localStorage para persistencia
            localStorage.setItem('adminLoggedIn', 'true');
        } else {
            setIsAdminLoggedIn(false);
            localStorage.removeItem('adminLoggedIn');
        }
    }, [user]);

    // Verificar localStorage al cargar la página
    useEffect(() => {
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        if (adminLoggedIn === 'true' && user) {
            setIsAdminLoggedIn(true);
        }
    }, []);

    return { isAdminLoggedIn };
};
