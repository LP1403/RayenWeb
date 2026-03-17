export interface Product {
    id: string;
    productNumber?: number; // Número identificador incremental del producto
    name: string;
    category: string; // Ahora es dinámico, no limitado a valores específicos
    price: number; // Precio de venta al cliente
    cost: number; // Costo del producto (interno)
    description: string;
    images: string[];
    catalogImageIndex?: number; // Índice de la imagen a usar en el catálogo (default: 0)
    sizes: string[];
    colors: string[];
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Campos adicionales para compatibilidad
    featured?: boolean;
    material?: string;
    care?: string;
    imagesByColor?: { [color: string]: string[] };
    carouselImages?: string[];
    sizeInfo?: { [size: string]: { available: boolean; stock: number } };
}

export interface CreateProductData {
    name: string;
    category: string; // Ahora es dinámico
    price: number; // Precio de venta
    cost: number; // Costo del producto
    description: string;
    images: string[];
    catalogImageIndex?: number; // Índice de la imagen a usar en el catálogo
    sizes: string[];
    colors: string[];
    stock: number;
    // Campos adicionales para compatibilidad
    material?: string;
    care?: string;
    featured?: boolean;
    imagesByColor?: { [color: string]: string[] };
    carouselImages?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
    isActive?: boolean;
}