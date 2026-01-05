import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { getImageUrl } from '../services/imageService';

/**
 * Hook para obtener URLs de imágenes desde Firebase Storage
 * @param imagePath - Ruta de la imagen en Storage (ej: "products/image.jpg")
 * @returns URL de descarga de la imagen o null si hay error
 */
export function useImageUrl(imagePath: string | null | undefined): string | null {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!imagePath) {
            setImageUrl(null);
            return;
        }

        // Usar el servicio de imágenes para obtener la URL
        const url = getImageUrl(imagePath);

        // Si es una URL local, usarla directamente
        if (url.startsWith('/') || url.startsWith('http')) {
            setImageUrl(url);
            return;
        }

        setLoading(true);
        setError(null);

        const fetchImageUrl = async () => {
            try {
                const imageRef = ref(storage, imagePath);
                const downloadURL = await getDownloadURL(imageRef);
                setImageUrl(downloadURL);
            } catch (err) {
                console.error('Error getting image URL:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setImageUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchImageUrl();
    }, [imagePath]);

    return imageUrl;
}

/**
 * Hook para obtener múltiples URLs de imágenes
 * @param imagePaths - Array de rutas de imágenes
 * @returns Array de URLs de descarga
 */
export function useImageUrls(imagePaths: string[]): (string | null)[] {
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!imagePaths || imagePaths.length === 0) {
            setImageUrls([]);
            return;
        }

        setLoading(true);

        const getImageUrls = async () => {
            const urls = await Promise.all(
                imagePaths.map(async (path) => {
                    if (!path) return null;

                    // Si ya es una URL completa, usarla directamente
                    if (path.startsWith('http')) {
                        return path;
                    }

                    try {
                        const imageRef = ref(storage, path);
                        return await getDownloadURL(imageRef);
                    } catch (err) {
                        console.error('Error getting image URL for', path, err);
                        return null;
                    }
                })
            );

            setImageUrls(urls);
            setLoading(false);
        };

        getImageUrls();
    }, [imagePaths]);

    return imageUrls;
}
