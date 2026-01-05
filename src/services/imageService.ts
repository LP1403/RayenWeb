import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export interface ImageUploadResult {
    url: string;
    path: string;
    name: string;
}

export interface ProductImageData {
    mainImages: ImageUploadResult[];
    carouselImages: ImageUploadResult[];
    imagesByColor: { [color: string]: ImageUploadResult[] };
}

/**
 * Genera un nombre de archivo estructurado para las imágenes
 * @param productName - Nombre del producto
 * @param color - Color del producto
 * @param imageType - Tipo de imagen (main, carousel, etc.)
 * @param index - Índice de la imagen
 * @returns Nombre de archivo estructurado
 */
function generateImageName(
    productName: string,
    color: string,
    imageType: string,
    index: number = 0
): string {
    const sanitizedName = productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const sanitizedColor = color
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return `products/${sanitizedName}/${sanitizedColor}/${imageType}-${index + 1}.jpg`;
}

/**
 * Sube una imagen a Firebase Storage
 * @param file - Archivo de imagen
 * @param path - Ruta donde subir la imagen
 * @returns URL de descarga y metadatos
 */
export async function uploadImage(file: File, path: string): Promise<ImageUploadResult> {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            url: downloadURL,
            path: path,
            name: file.name
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
}

/**
 * Sube múltiples imágenes para un producto
 * @param productName - Nombre del producto
 * @param colors - Colores del producto
 * @param imageFiles - Archivos de imagen organizados por color
 * @returns Datos de imágenes subidas
 */
export async function uploadProductImages(
    productName: string,
    colors: string[],
    imageFiles: { [color: string]: File[] }
): Promise<ProductImageData> {
    const result: ProductImageData = {
        mainImages: [],
        carouselImages: [],
        imagesByColor: {}
    };

    try {
        // Subir imágenes principales (primera imagen del primer color)
        if (colors.length > 0 && imageFiles[colors[0]] && imageFiles[colors[0]].length > 0) {
            const mainImagePath = generateImageName(productName, colors[0], 'main', 0);
            const mainImageResult = await uploadImage(imageFiles[colors[0]][0], mainImagePath);
            result.mainImages.push(mainImageResult);
        }

        // Subir imágenes por color
        for (const color of colors) {
            if (imageFiles[color] && imageFiles[color].length > 0) {
                result.imagesByColor[color] = [];

                for (let i = 0; i < imageFiles[color].length; i++) {
                    const imagePath = generateImageName(productName, color, 'color', i);
                    const imageResult = await uploadImage(imageFiles[color][i], imagePath);
                    result.imagesByColor[color].push(imageResult);

                    // La primera imagen de cada color va también al carousel
                    if (i === 0) {
                        result.carouselImages.push(imageResult);
                    }
                }
            }
        }

        return result;
    } catch (error) {
        console.error('Error uploading product images:', error);
        throw error;
    }
}

/**
 * Elimina una imagen de Firebase Storage
 * @param imagePath - Ruta de la imagen a eliminar
 */
export async function deleteImage(imagePath: string): Promise<void> {
    try {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
        // No lanzamos error aquí porque la imagen podría no existir
    }
}

/**
 * Elimina todas las imágenes de un producto
 * @param productImages - Datos de imágenes del producto
 */
export async function deleteProductImages(productImages: ProductImageData): Promise<void> {
    const deletePromises: Promise<void>[] = [];

    // Eliminar imágenes principales
    productImages.mainImages.forEach(img => {
        deletePromises.push(deleteImage(img.path));
    });

    // Eliminar imágenes del carousel
    productImages.carouselImages.forEach(img => {
        deletePromises.push(deleteImage(img.path));
    });

    // Eliminar imágenes por color
    Object.values(productImages.imagesByColor).forEach(colorImages => {
        colorImages.forEach(img => {
            deletePromises.push(deleteImage(img.path));
        });
    });

    await Promise.all(deletePromises);
}

/**
 * Obtiene la URL de una imagen desde Storage o devuelve la URL local
 * @param imagePath - Ruta de la imagen
 * @returns URL de la imagen
 */
export function getImageUrl(imagePath: string): string {
    // Si ya es una URL completa, devolverla
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Si es una ruta de Storage, construir la URL
    if (imagePath.startsWith('products/')) {
        return `https://firebasestorage.googleapis.com/v0/b/rayenweb-b321c.firebasestorage.app/o/${encodeURIComponent(imagePath)}?alt=media`;
    }

    // Si es una imagen local, devolver la ruta relativa
    return `/${imagePath}`;
}
