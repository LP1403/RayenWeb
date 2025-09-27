// Sistema dinámico de templates - Usa imágenes reales del proyecto
export const garmentTemplates = {
    remera: {
        front: {
            blanco: `${import.meta.env.BASE_URL}Mock remera gato color- blanco frente.jpg`,
            negro: `${import.meta.env.BASE_URL}Mock remera gato color-Frente Negro.jpg`,
            gris: `${import.meta.env.BASE_URL}Mock remera gato color- verde frente osc.jpg`
        },
        back: {
            blanco: `${import.meta.env.BASE_URL}Mock remera gato color- blanco.jpg`,
            negro: `${import.meta.env.BASE_URL}Mock remera gato color-Negro.jpg`,
            gris: `${import.meta.env.BASE_URL}Mock remera gato color- verde osc.jpg`
        }
    },
    buzo: {
        front: {
            blanco: `${import.meta.env.BASE_URL}Mock buzo gato lentes-Beige frente.jpg`,
            negro: `${import.meta.env.BASE_URL}Mock up buzo gato negro-frente Negro.jpg`,
            gris: `${import.meta.env.BASE_URL}Mock buzo gato lentes-frente Marron osc.jpg`
        },
        back: {
            blanco: `${import.meta.env.BASE_URL}Mock buzo gato lentes-Beige.jpg`,
            negro: `${import.meta.env.BASE_URL}Mock up buzo gato negro-Espalda Negro.jpg`,
            gris: `${import.meta.env.BASE_URL}Mock buzo gato lentes-Marron osc.jpg`
        }
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
export const getGarmentTemplate = (garmentId: string, color: string, isBack: boolean = false) => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (templates) {
        const side = isBack ? 'back' : 'front';

        // Si no hay imagen de dorso, usar la de frente
        if (isBack && !templates.back) {
            const colorKey = color.toLowerCase() as keyof typeof templates['front'];
            return templates['front'][colorKey] || templates['front']['blanco'];
        }

        const colorKey = color.toLowerCase() as keyof typeof templates['front'];
        return templates[side][colorKey] || templates[side]['blanco'];
    }
    // Fallback image if not found
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80';
};

// Función para detectar automáticamente si hay imágenes de dorso
export const hasBackView = (garmentId: string): boolean => {
    const templates = garmentTemplates[garmentId as keyof typeof garmentTemplates];
    if (!templates || !templates.back) return false;
    
    // Verificar si las URLs de dorso contienen palabras clave de dorso
    const backUrls = Object.values(templates.back);
    const hasBackKeywords = backUrls.some(url => 
        detectBackViewFromFilename(url) || 
        url.includes('espalda') || 
        url.includes('dorso') || 
        url.includes('back')
    );
    
    return hasBackKeywords;
};

// Función para detectar automáticamente imágenes de dorso basándose en nombres de archivo
export const detectBackViewFromFilename = (filename: string): boolean => {
    const backKeywords = ['dorso', 'back', 'espalda', 'rear', 'posterior'];
    const frontKeywords = ['frente', 'front', 'frontal', 'anterior'];
    
    const lowerFilename = filename.toLowerCase();
    
    // Si contiene palabras de dorso, es dorso
    if (backKeywords.some(keyword => lowerFilename.includes(keyword))) {
        return true;
    }
    
    // Si contiene palabras de frente, es frente
    if (frontKeywords.some(keyword => lowerFilename.includes(keyword))) {
        return false;
    }
    
    // Por defecto, asumir que es frente
    return false;
};

// Función para obtener la imagen base de una prenda (MANTENER COMPATIBILIDAD)
export const getBaseGarmentImage = (garmentId: string, isBack: boolean = false) => {
    const garmentTypeImages = baseGarmentImages[garmentId as keyof typeof baseGarmentImages];
    if (garmentTypeImages) {
        return isBack ? garmentTypeImages.back : garmentTypeImages.front;
    }
    // Fallback image if not found
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center&auto=format&q=80';
};

// Función para aplicar filtro de color a una imagen en canvas
export const applyColorFilter = (ctx: CanvasRenderingContext2D, color: string) => {
    // Convertir color hex a RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Para colores específicos, usar diferentes técnicas
    if (color === '#FFFFFF') {
        // Para blanco, usar overlay con opacidad baja
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else if (color === '#000000') {
        // Para negro, usar multiply con opacidad
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
        // Para gris y otros colores, usar color-burn
        ctx.globalCompositeOperation = 'color-burn';
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Restaurar configuración
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
};

// Función para obtener la imagen base (mantener compatibilidad)
export const getGarmentImage = (garmentId: string, _color: string, isBack: boolean = false) => {
    return getBaseGarmentImage(garmentId, isBack);
};