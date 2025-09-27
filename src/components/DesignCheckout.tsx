import React, { useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { CustomDesign } from '../types/Design';
import { getBaseGarmentImage, applyColorFilter, getGarmentTemplate } from '../data/garmentImages';

interface DesignCheckoutProps {
    design: CustomDesign;
    onBack: () => void;
    onComplete: () => void;
}

const DesignCheckout: React.FC<DesignCheckoutProps> = ({ design, onBack, onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const garmentCanvasRef = useRef<HTMLCanvasElement>(null);
    const designCanvasRef = useRef<HTMLCanvasElement>(null);

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

    // Función para redimensionar los canvas
    const resizeCanvas = useCallback(() => {
        if (!containerRef.current || !garmentCanvasRef.current || !designCanvasRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Configurar canvas de la prenda
        const garmentCanvas = garmentCanvasRef.current;
        garmentCanvas.width = width;
        garmentCanvas.height = height;
        garmentCanvas.style.width = `${width}px`;
        garmentCanvas.style.height = `${height}px`;

        // Configurar canvas del diseño
        const designCanvas = designCanvasRef.current;
        designCanvas.width = width;
        designCanvas.height = height;
        designCanvas.style.width = `${width}px`;
        designCanvas.style.height = `${height}px`;

        // Redibujar
        drawGarmentCanvas();
        drawDesignCanvas();
    }, [design]);

    // Función para dibujar el canvas de la prenda
    const drawGarmentCanvas = useCallback(() => {
        if (!garmentCanvasRef.current) return;

        const canvas = garmentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Crear imagen de fondo
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Dibujar la imagen base
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Ya no necesitamos aplicar filtro de color porque usamos templates específicos
            // applyColorFilter(ctx, design.garmentColor);
        };

        // Convertir color hex a nombre para el template
        const colorName = design.garmentColor === '#FFFFFF' ? 'blanco' :
            design.garmentColor === '#000000' ? 'negro' :
                design.garmentColor === '#6B7280' ? 'gris' : 'blanco';

        img.src = getGarmentTemplate(design.garmentType, colorName, false);
    }, [design.garmentType, design.garmentColor]);

    // Función para dibujar el canvas del diseño
    const drawDesignCanvas = useCallback(() => {
        if (!designCanvasRef.current || !design.selectedDesign) return;

        const canvas = designCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Crear imagen del diseño
        const designImg = new Image();
        designImg.crossOrigin = 'anonymous';
        designImg.onload = () => {
            // Calcular posición y tamaño
            const x = (design.designPosition.x / 100) * canvas.width;
            const y = (design.designPosition.y / 100) * canvas.height;

            // Aplicar escala personalizada si está disponible
            const customScale = design.selectedDesign?.customScale || 1.0;
            const size = Math.min(canvas.width, canvas.height) * 0.15 * (
                design.designSize === 'small' ? 0.8 :
                    design.designSize === 'medium' ? 1.5 : 2.0
            ) * customScale;

            // Guardar contexto
            ctx.save();

            // Mover al centro del diseño
            ctx.translate(x, y);

            // Rotar
            ctx.rotate((design.designRotation * Math.PI) / 180);

            // Dibujar diseño
            ctx.drawImage(designImg, -size / 2, -size / 2, size, size);

            // Restaurar contexto
            ctx.restore();
        };
        designImg.src = design.selectedDesign.image;
    }, [design]);

    // Efecto para redimensionar cuando cambie el tamaño del contenedor
    useEffect(() => {
        resizeCanvas();

        const handleResize = () => resizeCanvas();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [resizeCanvas]);

    // Efecto para redibujar cuando cambien las propiedades
    useEffect(() => {
        drawGarmentCanvas();
    }, [drawGarmentCanvas]);

    useEffect(() => {
        drawDesignCanvas();
    }, [drawDesignCanvas]);

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
                {/* Preview Final con Canvas */}
                <div className="space-y-6">
                    <h3 className="text-xl font-light text-black">Vista previa final</h3>

                    {/* Wrapper con estilos exactos de Kittl */}
                    <div
                        data-testid="mockup-canvas-wrapper"
                        className="relative aspect-[3/4] bg-gray-100 overflow-hidden border border-gray-200 rounded-lg"
                        style={{
                            width: '100%',
                            height: '500px',
                            position: 'relative',
                            filter: 'blur(0px)'
                        }}
                    >
                        {/* Container con doble canvas como Kittl */}
                        <div
                            ref={containerRef}
                            className="canvas-container"
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                userSelect: 'none',
                                outline: 'none'
                            }}
                        >
                            {/* Canvas inferior - Imagen de fondo */}
                            <canvas
                                ref={garmentCanvasRef}
                                className="lower-canvas"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    left: '0px',
                                    top: '0px',
                                    touchAction: 'none',
                                    userSelect: 'none'
                                }}
                            />

                            {/* Canvas superior - Diseño */}
                            <canvas
                                ref={designCanvasRef}
                                className="upper-canvas"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    left: '0px',
                                    top: '0px',
                                    touchAction: 'none',
                                    userSelect: 'none'
                                }}
                            />
                        </div>
                    </div>
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