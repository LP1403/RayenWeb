export interface Design {
    id: number;
    name: string;
    image: string;
    category: 'graphic' | 'text' | 'logo';
    customScale?: number; // Escala personalizada (opcional, por defecto 1.0)
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
    price: number;
    createdAt: Date;
    previewImage?: string; // Imagen del preview generada
    showBack?: boolean; // Si se estaba mostrando el dorso
}
