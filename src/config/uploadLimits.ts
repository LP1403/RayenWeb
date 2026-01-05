// Configuración de límites para subida de archivos personalizados
export interface UploadLimits {
    maxFileSize: number; // en bytes
    maxWidth: number; // en píxeles
    maxHeight: number; // en píxeles
    minWidth: number; // en píxeles
    minHeight: number; // en píxeles
    allowedFormats: string[]; // formatos permitidos
    maxFiles: number; // número máximo de archivos
}

// Configuración por defecto - fácilmente modificable
export const defaultUploadLimits: UploadLimits = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxWidth: 3610,
    maxHeight: 5273,
    minWidth: 100,
    minHeight: 100,
    allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
    maxFiles: 1
};

// Función para validar un archivo
export const validateFile = (file: File, limits: UploadLimits = defaultUploadLimits): { valid: boolean; error?: string } => {
    // Validar tamaño
    if (file.size > limits.maxFileSize) {
        return {
            valid: false,
            error: `El archivo es demasiado grande. Máximo permitido: ${Math.round(limits.maxFileSize / (1024 * 1024))}MB`
        };
    }

    // Validar formato
    if (!limits.allowedFormats.includes(file.type)) {
        return {
            valid: false,
            error: `Formato no permitido. Formatos válidos: ${limits.allowedFormats.join(', ')}`
        };
    }

    return { valid: true };
};

// Función para validar dimensiones de imagen
export const validateImageDimensions = (
    width: number,
    height: number,
    limits: UploadLimits = defaultUploadLimits
): { valid: boolean; error?: string } => {
    if (width < limits.minWidth || height < limits.minHeight) {
        return {
            valid: false,
            error: `La imagen es demasiado pequeña. Mínimo: ${limits.minWidth}x${limits.minHeight}px`
        };
    }

    if (width > limits.maxWidth || height > limits.maxHeight) {
        return {
            valid: false,
            error: `La imagen es demasiado grande. Máximo: ${limits.maxWidth}x${limits.maxHeight}px`
        };
    }

    return { valid: true };
};

// Función para formatear tamaño de archivo
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
