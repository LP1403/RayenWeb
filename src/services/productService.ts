import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, CreateProductData, UpdateProductData } from '../types/Product';

const PRODUCTS_COLLECTION = 'products';
const COUNTERS_COLLECTION = 'counters';

export class ProductService {
    // Obtener el siguiente número de producto
    private static async getNextProductNumber(): Promise<number> {
        const counterRef = doc(db, COUNTERS_COLLECTION, 'productCounter');
        const counterSnap = await getDoc(counterRef);

        if (!counterSnap.exists()) {
            // Crear el contador si no existe, empezando desde 1001
            await updateDoc(counterRef, { count: 1001 });
            return 1001;
        }

        const currentCount = counterSnap.data().count || 1000;
        const nextNumber = currentCount + 1;
        await updateDoc(counterRef, { count: nextNumber });
        return nextNumber;
    }

    // Obtener todos los productos
    static async getAllProducts(): Promise<Product[]> {
        try {
            const productsRef = collection(db, PRODUCTS_COLLECTION);
            const q = query(productsRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Product[];
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    }

    // Obtener producto por ID
    static async getProductById(id: string): Promise<Product | null> {
        try {
            const productRef = doc(db, PRODUCTS_COLLECTION, id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const data = productSnap.data();
                return {
                    id: productSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Product;
            }
            return null;
        } catch (error) {
            console.error('Error getting product:', error);
            throw error;
        }
    }

    // Crear nuevo producto
    static async createProduct(productData: CreateProductData): Promise<string> {
        try {
            const productsRef = collection(db, PRODUCTS_COLLECTION);
            const now = new Date();
            const productNumber = await this.getNextProductNumber();

            const docRef = await addDoc(productsRef, {
                ...productData,
                productNumber,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            });

            return docRef.id;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    // Actualizar producto
    static async updateProduct(id: string, productData: UpdateProductData): Promise<void> {
        try {
            const productRef = doc(db, PRODUCTS_COLLECTION, id);
            await updateDoc(productRef, {
                ...productData,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Eliminar producto
    static async deleteProduct(id: string): Promise<void> {
        try {
            const productRef = doc(db, PRODUCTS_COLLECTION, id);
            await deleteDoc(productRef);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Obtener productos activos
    static async getActiveProducts(): Promise<Product[]> {
        try {
            const productsRef = collection(db, PRODUCTS_COLLECTION);
            const q = query(productsRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const allProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Product[];

            // Filtrar productos activos en el cliente
            return allProducts.filter(product => product.isActive === true);
        } catch (error) {
            console.error('Error getting active products:', error);
            throw error;
        }
    }

    // Suscribirse a cambios en tiempo real
    static subscribeToProducts(callback: (products: Product[]) => void) {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const q = query(productsRef, orderBy('createdAt', 'desc'));

        return onSnapshot(q, (querySnapshot) => {
            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Product[];

            callback(products);
        });
    }
}