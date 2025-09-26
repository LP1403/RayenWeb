// Función para obtener la imagen base de una prenda
export const getBaseGarmentImage = (garmentId: string, isBack: boolean = false) => {
    // Prioridad: mockup blanca local si existe
    let fileName = '';
    if (garmentId === 'remera') {
        fileName = isBack
            ? '/garment-templates/remera-blanca-dorso.jpg'
            : '/garment-templates/remera-blanca-frente.jpg';
    } else if (garmentId === 'buzo') {
        fileName = isBack
            ? '/garment-templates/buzo-blanco-dorso.jpg'
            : '/garment-templates/buzo-blanco-frente.jpg';
    }
    // Fallback: si no existe el archivo, usar base
    // NOTA: En producción, deberías validar la existencia del archivo
    return fileName;
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
// Mejorada: busca mockup local por prenda, color y lado
export const getGarmentImage = (garmentId: string, color: string, isBack: boolean = false) => {
    // Mapear colores hex a nombres de archivo
    const colorMap: Record<string, string> = {
        '#FFFFFF': 'blanca',
        '#000000': 'negra',
    };
    const colorName = colorMap[color] || 'blanca';
    let fileName = '';
    if (garmentId === 'remera') {
        if (!isBack) {
            // Prioridad: mockup JPG si existe
            fileName = `/garment-templates/remera-${colorName}-frente.jpg`;
        } else {
            // Si agregas dorso, usa: `/garment-templates/remera-${colorName}-dorso.jpg`
            fileName = `/garment-templates/remera-${colorName}-dorso.jpg`;
        }
    } else if (garmentId === 'buzo') {
        fileName = isBack
            ? `/garment-templates/buzo-base-${colorName}-back.svg`
            : `/garment-templates/buzo-base-${colorName}-front.svg`;
    }
    // Fallback: si no existe el archivo, usar base
    // NOTA: En producción, deberías validar la existencia del archivo
    return fileName;
};