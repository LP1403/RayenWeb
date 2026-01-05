import { useState, useEffect } from 'react';
import { Category } from '../types/Category';
import {
    getCategories,
    getActiveCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
    isCategoryInUse
} from '../services/categoryService';

// Hook para obtener todas las categorías
export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const refresh = () => {
        fetchCategories();
    };

    return { categories, loading, error, refresh };
};

// Hook para obtener solo categorías activas
export const useActiveCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActiveCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getActiveCategories();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar categorías activas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveCategories();
    }, []);

    const refresh = () => {
        fetchActiveCategories();
    };

    return { categories, loading, error, refresh };
};

// Hook para obtener una categoría específica
export const useCategory = (id: string) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getCategoryById(id);
                setCategory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar categoría');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    return { category, loading, error };
};

// Hook para obtener una categoría por slug
export const useCategoryBySlug = (slug: string) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getCategoryBySlug(slug);
                setCategory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar categoría');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    return { category, loading, error };
};

// Hook para operaciones CRUD de categorías
export const useCategoryOperations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (categoryData: any) => {
        try {
            setLoading(true);
            setError(null);
            const id = await createCategory(categoryData);
            return id;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, categoryData: any) => {
        try {
            setLoading(true);
            setError(null);
            await updateCategory(id, categoryData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar categoría';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            // Verificar si la categoría está en uso
            const inUse = await isCategoryInUse(id);
            if (inUse) {
                throw new Error('No se puede eliminar la categoría porque está siendo utilizada por productos');
            }

            await deleteCategory(id);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar categoría';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const checkInUse = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await isCategoryInUse(id);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al verificar uso de categoría';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        create,
        update,
        remove,
        checkInUse
    };
};
