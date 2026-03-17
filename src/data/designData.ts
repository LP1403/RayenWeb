import { Design, GarmentType, DesignSize, PredesignedItem } from '../types/Design';
import { getGarmentTemplate } from './garmentImages';

export const garmentTypes: GarmentType[] = [
    {
        id: 'remera',
        name: 'Remera',
        baseImage: getGarmentTemplate('remera', 'blanco'),
        colors: ['#000000', '#FFFFFF', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    },
    {
        id: 'buzo',
        name: 'Buzo',
        baseImage: getGarmentTemplate('buzo', 'blanco'),
        colors: ['#000000', '#FFFFFF', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    }
];

export const designSizes: DesignSize[] = [
    { id: 'small', name: 'Chico', scale: 1.0 },
    { id: 'medium', name: 'Mediano', scale: 1.8 },
    { id: 'large', name: 'Grande', scale: 2.6 }
];

export const designs: Design[] = [
    {
        id: 1,
        name: 'Gato Psicodélico',
        image: `${import.meta.env.BASE_URL}designs/MOCKUPS KITTL-18.png`,
        category: 'graphic',
        customScale: 1.2
    },
    {
        id: 2,
        name: ' Ángel Rayen',
        image: `${import.meta.env.BASE_URL}designs/MOCKUPS KITTL-19.png`,
        category: 'graphic',
        customScale: 1.1
    },
    {
        id: 3,
        name: 'Serpiente Mística',
        image: `${import.meta.env.BASE_URL}designs/MOCKUPS KITTL-20.png`,
        category: 'graphic',
        customScale: 1.3
    },
    {
        id: 4,
        name: 'Gato Fachero',
        image: `${import.meta.env.BASE_URL}designs/MOCKUPS KITTL-21.png`,
        category: 'graphic',
        customScale: 1.0
    },
    {
        id: 5,
        name: 'Gato Místico',
        image: `${import.meta.env.BASE_URL}designs/MOCKUPS KITTL-22.png`,
        category: 'graphic',
        customScale: 1.0
    }
];

// Prediseños removidos temporalmente - se desarrollarán en otro momento
export const predesignedItems: PredesignedItem[] = [];