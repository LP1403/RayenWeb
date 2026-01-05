import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
    uid: string;
    email: string;
    displayName?: string;
}

export class FirebaseAuthService {
    // Iniciar sesión
    static async login(email: string, password: string): Promise<AuthUser> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            return {
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || undefined,
            };
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    // Cerrar sesión
    static async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // Obtener usuario actual
    static getCurrentUser(): User | null {
        return auth.currentUser;
    }

    // Suscribirse a cambios de autenticación
    static onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }

    // Verificar si está autenticado
    static isAuthenticated(): boolean {
        return !!auth.currentUser;
    }
}
