import { Design, GarmentType, DesignSize, PredesignedItem } from '../types/Design';
import { getGarmentTemplate } from './garmentImages';

export const garmentTypes: GarmentType[] = [
    {
        id: 'remera',
        name: 'Remera',
        baseImage: getGarmentTemplate('remera', 'blanco', false),
        colors: ['#000000', '#FFFFFF', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    },
    {
        id: 'buzo',
        name: 'Buzo',
        baseImage: getGarmentTemplate('buzo', 'blanco', false),
        colors: ['#000000', '#FFFFFF', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    }
];

export const designSizes: DesignSize[] = [
    { id: 'small', name: 'Chico', scale: 0.6 },
    { id: 'medium', name: 'Mediano', scale: 1.0 },
    { id: 'large', name: 'Grande', scale: 1.6 }
];

export const designs: Design[] = [
    {
        id: 1,
        name: 'Logo Minimalista',
        image: `${import.meta.env.BASE_URL}designs/logo-minimalista.svg`,
        category: 'logo',
        customScale: 1.0 // Escala personalizada para logos
    },
    {
        id: 2,
        name: 'Geometría Abstracta',
        image: `${import.meta.env.BASE_URL}designs/geometria-abstracta.svg`,
        category: 'graphic',
        customScale: 1.4 // Escala personalizada para gráficos
    },
    {
        id: 3,
        name: 'Tipografía Bold',
        image: `${import.meta.env.BASE_URL}designs/tipografia-bold.svg`,
        category: 'text',
        customScale: 1.4
    },
    {
        id: 4,
        name: 'Patrón Vintage',
        image: `${import.meta.env.BASE_URL}designs/patron-vintage.svg`,
        category: 'graphic',
        customScale: 1.1 // Escala personalizada para patrones
    },
    {
        id: 5,
        name: 'Líneas Modernas',
        image: `${import.meta.env.BASE_URL}designs/lineas-modernas.svg`,
        category: 'graphic'
    },
    {
        id: 6,
        name: 'Texto Inspiracional',
        image: `${import.meta.env.BASE_URL}designs/texto-inspiracional.svg`,
        category: 'text'
    }
];

// Prediseños removidos temporalmente - se desarrollarán en otro momento
export const predesignedItems: PredesignedItem[] = [];