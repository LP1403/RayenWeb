/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { CustomDesign } from '../types/Design';
import { getGarmentTemplate } from '../data/garmentImages';
import { saveDesign, generateDesignId } from '../services/designStorage';
import { composeDesignPreview } from '../services/designExport';
import { useToast } from '../hooks/useToast';

interface DesignCheckoutProps {
    design: CustomDesign;
    onBack: () => void;
    onComplete: () => void;
}

const DesignCheckout: React.FC<DesignCheckoutProps> = ({ design, onBack, onComplete }) => {
    const [isSaving, setIsSaving] = useState(false);
    const { success } = useToast();

    const getGarmentName = (type: string) =>
        type === 'remera' ? 'Remera' : 'Buzo';

    const getDesignSizeName = (size: string) => {
        const sizes: Record<string, string> = {
            small: 'Chico',
            medium: 'Mediano',
            large: 'Grande',
        };
        return sizes[size] || size;
    };

    const formatPrice = (price: number) =>
        price === 0 ? 'A confirmar' : `$${price.toLocaleString()}`;

    const handleSaveDesign = useCallback(async () => {
        try {
            setIsSaving(true);
            const previewImage = await composeDesignPreview(design);
            const designToSave: CustomDesign = {
                ...design,
                id: generateDesignId(),
                createdAt: new Date(),
                previewImage,
                showBack: false,
            };
            saveDesign(designToSave);
            success('¡Diseño guardado!', 'Tu diseño se ha guardado exitosamente');
            onComplete();
        } catch (err: any) {
            console.error('Error al guardar diseño:', err);
        } finally {
            setIsSaving(false);
        }
    }, [design, success, onComplete]);

    const handleWhatsAppOrder = () => {
        const message =
            `Hola! Quiero personalizar este diseño:\n\n` +
            `📦 Producto: ${getGarmentName(design.garmentType)}\n` +
            `🎨 Diseño: ${design.selectedDesign?.name}\n` +
            `📏 Tamaño del diseño: ${getDesignSizeName(design.designSize)}\n` +
            `🎨 Color: ${design.garmentColor}\n` +
            `📍 Posición: ${Math.round(design.designPosition.x)}%, ${Math.round(design.designPosition.y)}%\n` +
            `🔄 Rotación: ${design.designRotation}°\n` +
            `🔍 Escala: ${design.designScale.toFixed(2)}×\n\n` +
            `💰 Precio: ${formatPrice(design.price)}\n\n` +
            `¿Podrían ayudarme con este pedido personalizado?`;

        window.open(
            `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`,
            '_blank',
        );
    };

    // ── Static preview (CSS-based, matches the editor visually) ─────────────
    const colorName =
        design.garmentColor === '#FFFFFF' ? 'blanco' :
        design.garmentColor === '#000000' ? 'negro' : 'blanco';

    const garmentUrl = getGarmentTemplate(design.garmentType, colorName, 'front');

    const sizeScale =
        design.designSize === 'small' ? 0.8 :
        design.designSize === 'large' ? 2.0 : 1.5;

    const safeScale = design.designScale ?? 1;
    const safeFlipped = design.designFlipped ?? false;

    const designWidthPct = `${28 * sizeScale}%`;

    const designTransform = [
        'translate(-50%, -50%)',
        `scale(${safeScale})`,
        `rotate(${design.designRotation}deg)`,
    ].join(' ');

    const imgTransform = safeFlipped ? 'scaleX(-1)' : undefined;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-black mb-4">Revisa tu diseño</h2>
                <p className="text-gray-600 font-light">
                    Confirma todos los detalles antes de finalizar tu pedido
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Static preview */}
                <div className="space-y-6">
                    <h3 className="text-xl font-light text-black">Vista previa final</h3>
                    <div
                        className="relative bg-gray-100 overflow-hidden border border-gray-200 rounded-lg"
                        style={{ width: '100%', aspectRatio: '3/4' }}
                    >
                        {/* Garment */}
                        <img
                            src={garmentUrl}
                            alt={getGarmentName(design.garmentType)}
                            draggable={false}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Printable zone indicator */}
                        <div
                            aria-hidden
                            style={{
                                position: 'absolute',
                                top: '15%',
                                left: '16%',
                                right: '16%',
                                bottom: '20%',
                                border: '1px dashed rgba(99,102,241,0.3)',
                                borderRadius: 4,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Design overlay */}
                        {design.selectedDesign && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${design.designPosition.x}%`,
                                    top: `${design.designPosition.y}%`,
                                    width: designWidthPct,
                                    transform: designTransform,
                                    transformOrigin: 'center center',
                                    pointerEvents: 'none',
                                }}
                            >
                                <img
                                    src={design.selectedDesign.image}
                                    alt="design"
                                    draggable={false}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: 'auto',
                                        transform: imgTransform,
                                        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Order summary */}
                <div className="space-y-6">
                    <h3 className="text-xl font-light text-black">Resumen del pedido</h3>

                    <div className="bg-gray-50 p-6 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Producto:</span>
                            <span className="font-light text-black">
                                {getGarmentName(design.garmentType)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Diseño:</span>
                            <span className="font-light text-black">
                                {design.selectedDesign?.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tamaño del diseño:</span>
                            <span className="font-light text-black">
                                {getDesignSizeName(design.designSize)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Escala:</span>
                            <span className="font-light text-black">
                                {safeScale.toFixed(2)}×
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Color:</span>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 border border-gray-300"
                                    style={{ backgroundColor: design.garmentColor }}
                                />
                                <span className="font-light text-black">
                                    {design.garmentColor === '#FFFFFF' ? 'Blanco' : 'Negro'}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Rotación:</span>
                            <span className="font-light text-black">{design.designRotation}°</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg">
                                <span className="font-light text-black">Total:</span>
                                <span className="font-light text-black">{formatPrice(design.price)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 space-y-2">
                        <h4 className="font-light text-black text-sm">ℹ️ Información importante</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Tiempo de producción: 5-7 días hábiles</li>
                            <li>• Envío gratis en CABA y GBA</li>
                            <li>• Garantía de calidad en todos nuestros productos</li>
                            <li>• Posibilidad de cambios hasta 24hs después del pedido</li>
                        </ul>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                        <p>• Previsualización ilustrativa. Los colores y proporciones finales pueden variar.</p>
                        <p>• El logo de Rayen se incluirá automáticamente en la prenda.</p>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleWhatsAppOrder}
                            className="w-full bg-green-600 text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-green-700 transition-colors flex items-center justify-center space-x-3"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span>PEDIR POR WHATSAPP</span>
                        </button>

                        <button
                            onClick={handleSaveDesign}
                            disabled={isSaving}
                            className="w-full bg-black text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3 disabled:opacity-60"
                        >
                            <Check className="h-5 w-5" />
                            <span>{isSaving ? 'Guardando...' : 'GUARDAR DISEÑO'}</span>
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
