import { useState, useEffect } from 'react';
import { FirebaseAuthService, AuthUser } from '../auth/firebaseAuth';

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FirebaseAuthService.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email!,
                    displayName: firebaseUser.displayName || undefined,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const user = await FirebaseAuthService.login(email, password);
            setUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await FirebaseAuthService.logout();
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };
};
