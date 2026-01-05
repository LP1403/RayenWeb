// Sistema dinámico de templates - Usa imágenes reales del proyecto
export const garmentTemplates = {
    remera: {
        front: {
            blanco: '/MockBlanco.jpg',
            negro: '/MockNegro.jpg',
        },
        /*back: {
            blanco: '/Mock remera gato color- blanco.jpg',
            negro: '/Mock remera gato color-Negro.jpg',
            gris: '/Mock remera gato color- verde osc.jpg'
        }*/
    },
    buzo: {
        front: {
            blanco: '/Mock buzo gato lentes-Beige frente.jpg',
            negro: '/Mock up buzo gato negro-frente Negro.jpg',
        },
        /*back: {
            blanco: '/Mock buzo gato lentes-Beige.jpg',
            negro: '/Mock up buzo gato negro-Espalda Negro.jpg',
            gris: '/Mock buzo gato lentes-Marron osc.jpg'
        }*/
    }
};

// Imágenes base de las prendas (usando URLs de Unsplash para mockups blancos) - MANTENER COMPATIBILIDAD
export const baseGarmentImages = {
    remera: {
        front: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
        back: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80'
    },
    buzo: {
        front: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
        back: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center&auto=format&q=80'
    }
};

// Función para obtener template por color
export const getGarmentTemplate = (garmentId: string, color: string) => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (templates) {
        // Solo usar front por ahora, ya que back está comentado
        const side = 'front';
        const colorKey = color.toLowerCase() as keyof typeof templates['front'];
        return templates[side][colorKey] || templates[side]['blanco'];
    }
    // Fallback image if not found
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80';
};

// Función para detectar automáticamente si hay imágenes de dorso
export const hasBackView = (): boolean => {
    // Por ahora no hay imágenes de dorso disponibles
    return false;
};

// Función para obtener todas las imágenes disponibles de una prenda
export const getAvailableGarmentImages = (garmentId: string) => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (!templates) return [];

    return Object.keys(templates.front);
};

// Función para verificar si una imagen existe
export const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

// Función para obtener la mejor imagen disponible
export const getBestGarmentImage = async (garmentId: string, color: string) => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (!templates) return getGarmentTemplate(garmentId, color);

    const side = 'front';
    const colorKey = color.toLowerCase() as keyof typeof templates['front'];
    const preferredImage = templates[side][colorKey];

    if (preferredImage) {
        const exists = await checkImageExists(preferredImage);
        if (exists) return preferredImage;
    }

    // Fallback a blanco si no existe la imagen del color
    const fallbackImage = templates[side]['blanco'];
    if (fallbackImage) {
        const exists = await checkImageExists(fallbackImage);
        if (exists) return fallbackImage;
    }

    // Último fallback
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80';
};