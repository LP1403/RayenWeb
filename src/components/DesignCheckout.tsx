import React from 'react';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { CustomDesign } from '../types/Design';
import { getGarmentImage } from '../data/garmentImages';
import GarmentCanvasPreview from './GarmentCanvasPreview';

interface DesignCheckoutProps {
    design: CustomDesign;
    onBack: () => void;
    onComplete: () => void;
}

const DesignCheckout: React.FC<DesignCheckoutProps> = ({ design, onBack, onComplete }) => {
    const getGarmentName = (type: string) => {
        return type === 'remera' ? 'Remera' : 'Buzo';
    };


    const getDesignSizeName = (size: string) => {
        const sizes: { [key: string]: string } = {
            'small': 'Chico',
            'medium': 'Mediano',
            'large': 'Grande'
        };
        return sizes[size] || size;
    };

    const handleWhatsAppOrder = () => {
        const message = `Hola! Quiero personalizar este diseño:

📦 Producto: ${getGarmentName(design.garmentType)}
🎨 Diseño: ${design.selectedDesign?.name}
📏 Tamaño del diseño: ${getDesignSizeName(design.designSize)}
🎨 Color: ${design.garmentColor}
📍 Posición: ${Math.round(design.designPosition.x)}%, ${Math.round(design.designPosition.y)}%
🔄 Rotación: ${design.designRotation}°

💰 Precio: $${design.price.toLocaleString()}

¿Podrían ayudarme con este pedido personalizado?`;

        const whatsappUrl = `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-black mb-4">Revisa tu diseño</h2>
                <p className="text-gray-600 font-light">Confirma todos los detalles antes de finalizar tu pedido</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Preview Final */}
                <div className="space-y-6">
                    <h3 className="text-xl font-light text-black">Vista previa final</h3>
                    <GarmentCanvasPreview
                        garmentType={{ id: design.garmentType, name: '', baseImage: '', colors: [] }}
                        garmentColor={design.garmentColor}
                        selectedDesign={design.selectedDesign}
                        designSize={{ id: design.designSize, name: '', scale: 1 }}
                        designPosition={design.designPosition}
                        designRotation={design.designRotation}
                        editable={false}
                    />
                </div>

                {/* Resumen del pedido */}
                <div className="space-y-6">
                    <h3 className="text-xl font-light text-black">Resumen del pedido</h3>

                    <div className="bg-gray-50 p-6 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Producto:</span>
                            <span className="font-light text-black">{getGarmentName(design.garmentType)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Diseño:</span>
                            <span className="font-light text-black">{design.selectedDesign?.name}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Tamaño del diseño:</span>
                            <span className="font-light text-black">{getDesignSizeName(design.designSize)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Color:</span>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 border border-gray-300"
                                    style={{ backgroundColor: design.garmentColor }}
                                />
                                <span className="font-light text-black">{design.garmentColor}</span>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Posición:</span>
                            <span className="font-light text-black">
                                {Math.round(design.designPosition.x)}%, {Math.round(design.designPosition.y)}%
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Rotación:</span>
                            <span className="font-light text-black">{design.designRotation}°</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg">
                                <span className="font-light text-black">Total:</span>
                                <span className="font-light text-black">${design.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 p-4 space-y-2">
                        <h4 className="font-light text-black text-sm">ℹ️ Información importante</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Tiempo de producción: 5-7 días hábiles</li>
                            <li>• Envío gratis en CABA y GBA</li>
                            <li>• Garantía de calidad en todos nuestros productos</li>
                            <li>• Posibilidad de cambios hasta 24hs después del pedido</li>
                        </ul>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-4">
                        <button
                            onClick={handleWhatsAppOrder}
                            className="w-full bg-green-600 text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-green-700 transition-colors flex items-center justify-center space-x-3"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span>PEDIR POR WHATSAPP</span>
                        </button>

                        <button
                            onClick={onComplete}
                            className="w-full bg-black text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3"
                        >
                            <Check className="h-5 w-5" />
                            <span>GUARDAR DISEÑO</span>
                        </button>

                        <button
                            onClick={onBack}
                            className="w-full border border-gray-300 text-gray-600 py-4 px-6 font-light text-sm tracking-wide hover:border-black hover:text-black transition-colors flex items-center justify-center space-x-3"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>VOLVER A EDITAR</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignCheckout;
