// Configuración de talles disponibles
// Puedes modificar estos arrays para ajustar los talles disponibles

export interface SizeConfig {
    id: string;
    name: string;
    available: boolean;
}

// Tallas estándar para remeras y buzos
export const AVAILABLE_SIZES: SizeConfig[] = [
    { id: 'S', name: 'S', available: true },
    { id: 'M', name: 'M', available: true },
    { id: 'L', name: 'L', available: true },
    { id: 'XL', name: 'XL', available: true },
    { id: 'XXL', name: 'XXL', available: true },
    { id: 'XXXL', name: 'XXXL', available: false }, // No disponible por ahora
];

// Función para obtener talles disponibles
export const getAvailableSizes = (): SizeConfig[] => {
    return AVAILABLE_SIZES.filter(size => size.available);
};

// Función para obtener nombres de talles disponibles
export const getAvailableSizeNames = (): string[] => {
    return getAvailableSizes().map(size => size.name);
};

// Función para verificar si un talle está disponible
export const isSizeAvailable = (sizeName: string): boolean => {
    const size = AVAILABLE_SIZES.find(s => s.name === sizeName);
    return size ? size.available : false;
};

// Función para obtener información de un talle específico
export const getSizeInfo = (sizeName: string): SizeConfig | undefined => {
    return AVAILABLE_SIZES.find(s => s.name === sizeName);
};
