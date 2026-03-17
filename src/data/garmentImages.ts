export const garmentTemplates = {
    remera: {
        front: {
            blanco: '/MockBlanco.jpg',
            negro: '/MockNegro.jpg',
        },
        back: {
            blanco: '/Mock remera gato color- blanco.jpg',
            negro: '/Mock remera gato color-Negro.jpg',
            gris: '/Mock remera gato color- verde osc.jpg',
        },
    },
    buzo: {
        front: {
            blanco: '/Mock buzo gato lentes-Beige frente.jpg',
            negro: '/Mock up buzo gato negro-frente Negro.jpg',
        },
        back: {
            blanco: '/Mock buzo gato lentes-Beige.jpg',
            negro: '/Mock up buzo gato negro-Espalda Negro.jpg',
            gris: '/Mock buzo gato lentes-Marron osc.jpg',
        },
    },
};

export const baseGarmentImages = {
    remera: {
        front: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
        back: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
    },
    buzo: {
        front: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
        back: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
    },
};

export const getGarmentTemplate = (
    garmentId: string,
    color: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _side: 'front' | 'back' = 'front',
): string => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (!templates) {
        return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80';
    }

    // Always use the front blank mockup — back-view files are product photos with
    // a cat design already printed, not blank templates.
    const sideTemplates = templates.front;
    const colorKey = color.toLowerCase() as keyof typeof sideTemplates;
    return sideTemplates[colorKey] ?? sideTemplates['blanco'] ?? '';
};

export const hasBackView = (garmentId?: string): boolean => {
    if (!garmentId) return false;
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    return !!templates?.back;
};

export const getAvailableGarmentImages = (garmentId: string): string[] => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (!templates) return [];
    return Object.keys(templates.front);
};

export const checkImageExists = (url: string): Promise<boolean> =>
    new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });

export const getBestGarmentImage = async (garmentId: string, color: string): Promise<string> => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (!templates) return getGarmentTemplate(garmentId, color);

    const colorKey = color.toLowerCase() as keyof typeof templates['front'];
    const preferredImage = templates.front[colorKey];

    if (preferredImage && await checkImageExists(preferredImage)) return preferredImage;

    const fallback = templates.front['blanco'];
    if (fallback && await checkImageExists(fallback)) return fallback;

    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80';
};
