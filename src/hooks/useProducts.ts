import { useState, useEffect } from 'react';
import { ProductService } from '../services/productService';
import { Product } from '../types/Product';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const productsData = await ProductService.getAllProducts();
                setProducts(productsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar productos');
                console.error('Error loading products:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newProductId = await ProductService.createProduct(productData);
            // Recargar productos después de crear uno nuevo
            const updatedProducts = await ProductService.getAllProducts();
            setProducts(updatedProducts);
            return newProductId;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear producto');
            throw err;
        }
    };

    const updateProduct = async (id: string, productData: Partial<Product>) => {
        try {
            await ProductService.updateProduct(id, productData);
            // Recargar productos después de actualizar
            const updatedProducts = await ProductService.getAllProducts();
            setProducts(updatedProducts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar producto');
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await ProductService.deleteProduct(id);
            // Recargar productos después de eliminar
            const updatedProducts = await ProductService.getAllProducts();
            setProducts(updatedProducts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar producto');
            throw err;
        }
    };

    return {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        refetch: () => {
            setLoading(true);
            ProductService.getAllProducts()
                .then(setProducts)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    };
};

export const useActiveProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadActiveProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const productsData = await ProductService.getActiveProducts();
                setProducts(productsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar productos activos');
                console.error('Error loading active products:', err);
            } finally {
                setLoading(false);
            }
        };

        loadActiveProducts();
    }, []);

    return {
        products,
        loading,
        error
    };
};
