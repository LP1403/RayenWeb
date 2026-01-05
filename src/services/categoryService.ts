import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types/Category';

const COLLECTION_NAME = 'categories';

// Obtener todas las categorías
export const getCategories = async (): Promise<Category[]> => {
    try {
        // Obtener todas las categorías y ordenar en el cliente para evitar índices compuestos
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);

        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Category[];

        // Ordenar: primero por sortOrder (si está definido), luego alfabéticamente
        return categories.sort((a, b) => {
            // Si ambos tienen sortOrder definido, ordenar por sortOrder
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                if (a.sortOrder !== b.sortOrder) {
                    return a.sortOrder - b.sortOrder;
                }
            }
            // Si solo uno tiene sortOrder, el que tiene sortOrder va primero
            if (a.sortOrder !== undefined && b.sortOrder === undefined) {
                return -1;
            }
            if (a.sortOrder === undefined && b.sortOrder !== undefined) {
                return 1;
            }
            // Si ninguno tiene sortOrder o tienen el mismo sortOrder, ordenar alfabéticamente
            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Obtener categorías activas
export const getActiveCategories = async (): Promise<Category[]> => {
    try {
        // Obtener todas las categorías y filtrar/ordenar en el cliente para evitar índices compuestos
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);

        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Category[];

        // Filtrar solo las activas y ordenar: primero por sortOrder, luego alfabéticamente
        return categories
            .filter(category => category.isActive)
            .sort((a, b) => {
                // Si ambos tienen sortOrder definido, ordenar por sortOrder
                if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                    if (a.sortOrder !== b.sortOrder) {
                        return a.sortOrder - b.sortOrder;
                    }
                }
                // Si solo uno tiene sortOrder, el que tiene sortOrder va primero
                if (a.sortOrder !== undefined && b.sortOrder === undefined) {
                    return -1;
                }
                if (a.sortOrder === undefined && b.sortOrder !== undefined) {
                    return 1;
                }
                // Si ninguno tiene sortOrder o tienen el mismo sortOrder, ordenar alfabéticamente
                return a.name.localeCompare(b.name);
            });
    } catch (error) {
        console.error('Error fetching active categories:', error);
        throw error;
    }
};

// Obtener una categoría por ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as Category;
        }
        return null;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
};

// Obtener una categoría por slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('slug', '==', slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as Category;
        }
        return null;
    } catch (error) {
        console.error('Error fetching category by slug:', error);
        throw error;
    }
};

// Crear una nueva categoría
export const createCategory = async (categoryData: CreateCategoryData): Promise<string> => {
    try {
        // Verificar que el slug no exista
        const existingCategory = await getCategoryBySlug(categoryData.slug);
        if (existingCategory) {
            throw new Error('Ya existe una categoría con este slug');
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...categoryData,
            isActive: categoryData.isActive ?? true,
            sortOrder: categoryData.sortOrder ?? 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

// Actualizar una categoría
export const updateCategory = async (id: string, categoryData: UpdateCategoryData): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);

        // Si se está actualizando el slug, verificar que no exista
        if (categoryData.slug) {
            const existingCategory = await getCategoryBySlug(categoryData.slug);
            if (existingCategory && existingCategory.id !== id) {
                throw new Error('Ya existe una categoría con este slug');
            }
        }

        await updateDoc(docRef, {
            ...categoryData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Eliminar una categoría
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// Verificar si una categoría está siendo usada por productos
export const isCategoryInUse = async (categoryId: string): Promise<boolean> => {
    try {
        const { collection: getCollection, query: createQuery, where: createWhere, getDocs } = await import('firebase/firestore');
        const q = createQuery(
            getCollection(db, 'products'),
            createWhere('category', '==', categoryId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking if category is in use:', error);
        return false;
    }
};
