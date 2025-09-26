import { Design, GarmentType, DesignSize, PredesignedItem } from '../types/Design';

export const garmentTypes: GarmentType[] = [
    {
        id: 'remera',
        name: 'Remera',
        baseImage: '/garment-templates/remera-blanca-frente.jpg',
        colors: ['#000000', '#FFFFFF', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    },
    {
        id: 'buzo',
        name: 'Buzo',
        baseImage: '', // No mostrar si no hay mockup
        colors: ['#000000', '#FFFFFF', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    }
];

export const designSizes: DesignSize[] = [
    { id: 'small', name: 'Chico', scale: 0.8 },
    { id: 'medium', name: 'Mediano', scale: 1.5 },
    { id: 'large', name: 'Grande', scale: 2.0 }
];

export const designs: Design[] = [
    {
        id: 1,
        name: 'Logo Minimalista',
        image: '/designs/logo-minimalista.svg',
        category: 'logo'
    },
    {
        id: 2,
        name: 'Geometría Abstracta',
        image: '/designs/geometria-abstracta.svg',
        category: 'graphic'
    },
    {
        id: 3,
        name: 'Tipografía Bold',
        image: '/designs/tipografia-bold.svg',
        category: 'text'
    },
    {
        id: 4,
        name: 'Patrón Vintage',
        image: '/designs/patron-vintage.svg',
        category: 'graphic'
    },
    {
        id: 5,
        name: 'Líneas Modernas',
        image: '/designs/lineas-modernas.svg',
        category: 'graphic'
    },
    {
        id: 6,
        name: 'Texto Inspiracional',
        image: '/designs/texto-inspiracional.svg',
        category: 'text'
    }
];

export const predesignedItems: PredesignedItem[] = [
    {
        id: 1,
        name: 'Clásico Urbano',
        garmentType: 'remera',
        design: designs[0],
        garmentColor: '#000000',
        designSize: 'medium',
        designPosition: { x: 50, y: 30 },
        price: 18900,
        image: '/predesigned/clasico-urbano.svg'
    },
    {
        id: 2,
        name: 'Vintage Style',
        garmentType: 'buzo',
        design: designs[3],
        garmentColor: '#6B7280',
        designSize: 'large',
        designPosition: { x: 50, y: 25 },
        price: 25900,
        image: '/predesigned/vintage-style.svg'
    },
    {
        id: 3,
        name: 'Modern Minimal',
        garmentType: 'remera',
        design: designs[4],
        garmentColor: '#FFFFFF',
        designSize: 'small',
        designPosition: { x: 50, y: 35 },
        price: 16900,
        image: '/predesigned/modern-minimal.svg'
    }
];