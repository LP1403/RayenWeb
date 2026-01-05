export interface Category {
    id: string;
    name: string;
    slug: string; // Para URLs y referencias
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Campos adicionales
    icon?: string; // Nombre del icono o emoji
    color?: string; // Color hexadecimal para UI
    sortOrder?: number; // Para ordenamiento personalizado
}

export interface CreateCategoryData {
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
    icon?: string;
    color?: string;
    sortOrder?: number;
}

export interface UpdateCategoryData {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    icon?: string;
    color?: string;
    sortOrder?: number;
}
