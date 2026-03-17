export interface Design {
    id: number;
    name: string;
    image: string;
    category: 'graphic' | 'text' | 'logo';
    customScale?: number; // Escala personalizada (opcional, por defecto 1.0)
    isCustom?: boolean; // Indica si es un diseño personalizado subido por el usuario
    originalFile?: File; // Archivo original subido por el usuario
}

export interface GarmentType {
    id: string;
    name: string;
    baseImage: string;
    colors: string[];
}

export interface DesignSize {
    id: string;
    name: string;
    scale: number;
}

export interface PredesignedItem {
    id: number;
    name: string;
    garmentType: string;
    design: Design;
    garmentColor: string;
    designSize: string;
    designPosition: { x: number; y: number };
    price: number;
    image: string;
}

export interface CustomDesign {
    id: string;
    garmentType: string;
    garmentColor: string;
    selectedDesign: Design | null;
    designSize: string;
    designPosition: { x: number; y: number };
    designRotation: number;
    designScale: number;
    designFlipped: boolean;
    price: number;
    createdAt: Date;
    previewImage?: string;
    showBack?: boolean;
}
