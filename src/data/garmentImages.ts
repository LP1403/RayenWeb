// Imágenes base de las prendas (usando URLs de Unsplash para mockups blancos)
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

// Función para obtener la imagen base de una prenda
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