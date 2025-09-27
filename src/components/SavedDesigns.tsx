import React, { useState, useEffect } from 'react';
import { Trash2, Eye, RotateCcw } from 'lucide-react';
import { CustomDesign } from '../types/Design';
import { getSavedDesigns, deleteDesign, recreateDesign } from '../services/designStorage';

const formatPrice = (price: number) => {
    if (price === 0 || price === null || price === undefined) {
        return 'A confirmar';
    }
    return `$${price.toLocaleString()}`;
};

interface SavedDesignsProps {
    onLoadDesign: (design: any) => void;
}

const SavedDesigns: React.FC<SavedDesignsProps> = ({ onLoadDesign }) => {
    const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>([]);

    useEffect(() => {
        loadSavedDesigns();
    }, []);

    const loadSavedDesigns = () => {
        const designs = getSavedDesigns();
        setSavedDesigns(designs);
    };

    const handleDeleteDesign = (designId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este diseño?')) {
            deleteDesign(designId);
            loadSavedDesigns();
        }
    };

    const handleLoadDesign = (design: CustomDesign) => {
        const recreatedDesign = recreateDesign(design);
        onLoadDesign(recreatedDesign);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (savedDesigns.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-light text-black mb-4">Mis Diseños</h1>
                        <p className="text-gray-600 font-light">No tienes diseños guardados aún</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-black mb-4">Mis Diseños</h1>
                    <p className="text-gray-600 font-light">Diseños personalizados guardados</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedDesigns.map((design) => (
                        <div key={design.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Preview Image */}
                            <div className="aspect-[3/4] bg-gray-100 relative">
                                {design.previewImage ? (
                                    <img
                                        src={design.previewImage}
                                        alt={`Diseño ${design.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span>Sin preview</span>
                                    </div>
                                )}
                            </div>

                            {/* Design Info */}
                            <div className="p-4">
                                <div className="mb-3">
                                    <h3 className="font-light text-black text-sm mb-1">
                                        {design.garmentType === 'remera' ? 'Remera' : 'Buzo'} {design.selectedDesign?.name}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Color: {design.garmentColor === '#FFFFFF' ? 'Blanco' :
                                            design.garmentColor === '#000000' ? 'Negro' : 'Gris'}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Tamaño: {design.designSize === 'small' ? 'Chico' :
                                            design.designSize === 'medium' ? 'Mediano' : 'Grande'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>{formatDate(design.createdAt)}</span>
                                    <span>{formatPrice(design.price)}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleLoadDesign(design)}
                                        className="flex-1 bg-black text-white py-2 px-3 text-xs font-light hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <Eye className="h-3 w-3" />
                                        <span>Cargar</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDesign(design.id)}
                                        className="bg-red-100 text-red-600 py-2 px-3 text-xs font-light hover:bg-red-200 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavedDesigns;
