import { CustomDesign } from '../types/Design';

const STORAGE_KEY = 'rayen-custom-designs';

// Función para guardar un diseño en localStorage
export const saveDesign = (design: CustomDesign): void => {
    try {
        const existingDesigns = getSavedDesigns();
        const updatedDesigns = [...existingDesigns, design];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDesigns));
        console.log('Diseño guardado exitosamente:', design.id);
    } catch (error) {
        console.error('Error al guardar diseño:', error);
    }
};

// Función para obtener todos los diseños guardados
export const getSavedDesigns = (): CustomDesign[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const designs = JSON.parse(stored);
        // Convertir las fechas de string a Date
        return designs.map((design: any) => ({
            ...design,
            createdAt: new Date(design.createdAt)
        }));
    } catch (error) {
        console.error('Error al cargar diseños:', error);
        return [];
    }
};

// Función para eliminar un diseño
export const deleteDesign = (designId: string): void => {
    try {
        const existingDesigns = getSavedDesigns();
        const updatedDesigns = existingDesigns.filter(design => design.id !== designId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDesigns));
        console.log('Diseño eliminado:', designId);
    } catch (error) {
        console.error('Error al eliminar diseño:', error);
    }
};

// Función para generar un ID único
export const generateDesignId = (): string => {
    return `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Función para capturar el canvas como imagen
export const captureCanvasAsImage = (canvas: HTMLCanvasElement): string => {
    try {
        return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
        console.error('Error al capturar canvas:', error);
        return '';
    }
};

// Función para recrear un diseño desde localStorage
export const recreateDesign = (design: CustomDesign) => {
    return {
        garmentType: design.garmentType,
        garmentColor: design.garmentColor,
        selectedDesign: design.selectedDesign,
        designSize: design.designSize,
        designPosition: design.designPosition,
        designRotation: design.designRotation,
        showBack: design.showBack || false
    };
};
