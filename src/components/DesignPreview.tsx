import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw, Move, Maximize2, Eye, EyeOff } from 'lucide-react';
import { GarmentType, Design, DesignSize } from '../types/Design';
import { getGarmentTemplate, hasBackView } from '../data/garmentImages';

interface SmoothCanvasPreviewProps {
    garmentType: GarmentType | null;
    garmentColor: string;
    selectedDesign: Design | null;
    designSize: DesignSize;
    designPosition: { x: number; y: number };
    designRotation: number;
    onPositionChange: (position: { x: number; y: number }) => void;
    onRotationChange: (rotation: number) => void;
}

const SmoothCanvasPreview: React.FC<SmoothCanvasPreviewProps> = ({
    garmentType,
    garmentColor,
    selectedDesign,
    designSize,
    designPosition,
    designRotation,
    onPositionChange,
    onRotationChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const garmentCanvasRef = useRef<HTMLCanvasElement>(null);
    const designCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showBack, setShowBack] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 400, height: 500 });
    const [garmentImageLoaded, setGarmentImageLoaded] = useState(false);
    const [designImageLoaded, setDesignImageLoaded] = useState(false);

    // Función para dibujar el canvas de la prenda (SOLO UNA VEZ)
    const drawGarmentCanvas = useCallback(() => {
        if (!garmentCanvasRef.current || !garmentType) return;

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
            // applyColorFilter(ctx, garmentColor);

            setGarmentImageLoaded(true);
        };
        img.onerror = () => {
            console.error('Error loading garment image');
            setGarmentImageLoaded(true);
        };
        // Convertir color hex a nombre para el template
        const colorName = garmentColor === '#FFFFFF' ? 'blanco' :
            garmentColor === '#000000' ? 'negro' :
                garmentColor === '#6B7280' ? 'gris' : 'blanco';

        img.src = getGarmentTemplate(garmentType.id, colorName, showBack);
    }, [garmentType, garmentColor, showBack]);

    // Función para dibujar el canvas del diseño (SOLO UNA VEZ - sin redibujar durante drag)
    const drawDesignCanvas = useCallback(() => {
        if (!designCanvasRef.current || !selectedDesign || isDragging) return;

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
            const x = (designPosition.x / 100) * canvas.width;
            const y = (designPosition.y / 100) * canvas.height;

            // Aplicar escala personalizada si está disponible
            const customScale = selectedDesign.customScale || 1.0;
            const size = Math.min(canvas.width, canvas.height) * 0.15 * designSize.scale * customScale;

            // Guardar contexto
            ctx.save();

            // Mover al centro del diseño
            ctx.translate(x, y);

            // Rotar
            ctx.rotate((designRotation * Math.PI) / 180);

            // Dibujar diseño
            ctx.drawImage(designImg, -size / 2, -size / 2, size, size);

            // Restaurar contexto
            ctx.restore();

            setDesignImageLoaded(true);
        };
        designImg.onerror = () => {
            console.error('Error loading design image');
            setDesignImageLoaded(true);
        };
        designImg.src = selectedDesign.image;
    }, [selectedDesign, designSize, designPosition, designRotation, isDragging]);

    // Función para redimensionar los canvas
    const resizeCanvas = useCallback(() => {
        if (!containerRef.current || !garmentCanvasRef.current || !designCanvasRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        setContainerSize({ width, height });

        // Configurar canvas de la prenda (estático)
        const garmentCanvas = garmentCanvasRef.current;
        garmentCanvas.width = width;
        garmentCanvas.height = height;
        garmentCanvas.style.width = `${width}px`;
        garmentCanvas.style.height = `${height}px`;

        // Configurar canvas del diseño (móvil)
        const designCanvas = designCanvasRef.current;
        designCanvas.width = width;
        designCanvas.height = height;
        designCanvas.style.width = `${width}px`;
        designCanvas.style.height = `${height}px`;

        // Redibujar solo si las imágenes están cargadas
        if (garmentImageLoaded) {
            drawGarmentCanvas();
        }
        if (designImageLoaded) {
            drawDesignCanvas();
        }
    }, [garmentImageLoaded, designImageLoaded, drawGarmentCanvas, drawDesignCanvas]);

    // Cargar imagen de la prenda cuando cambie
    useEffect(() => {
        if (garmentType) {
            setGarmentImageLoaded(false);
            drawGarmentCanvas();
        }
    }, [garmentType, garmentColor, showBack, drawGarmentCanvas]);

    // Cargar imagen del diseño cuando cambie
    useEffect(() => {
        if (selectedDesign) {
            setDesignImageLoaded(false);
            drawDesignCanvas();
        }
    }, [selectedDesign, designSize, designPosition, designRotation, drawDesignCanvas]);

    // Redimensionar cuando cambie el tamaño del contenedor
    useEffect(() => {
        resizeCanvas();

        const handleResize = () => resizeCanvas();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [resizeCanvas]);

    // Manejar eventos de mouse
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!selectedDesign) return;

        e.preventDefault();
        setIsDragging(true);

        const rect = designCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - (designPosition.x / 100) * rect.width,
                y: e.clientY - (designPosition.y / 100) * rect.height
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !designCanvasRef.current) return;

        const rect = designCanvasRef.current.getBoundingClientRect();
        const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
        const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

        onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Redibujar el canvas una vez al terminar el drag
        setTimeout(() => {
            drawDesignCanvas();
        }, 100);
    };

    const handleRotate = () => {
        onRotationChange((designRotation + 15) % 360);
    };

    // Eventos globales para el drag
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || !designCanvasRef.current) return;

            const rect = designCanvasRef.current.getBoundingClientRect();
            const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
            const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

            onPositionChange({ x: newX, y: newY });
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            // Redibujar el canvas una vez al terminar el drag
            setTimeout(() => {
                drawDesignCanvas();
            }, 100);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
            document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, onPositionChange, drawDesignCanvas]);

    if (!garmentType) {
        return (
            <div className="bg-gray-50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Maximize2 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-light">Selecciona una prenda para ver el preview</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-light text-black">Vista previa</h3>
                {garmentType && hasBackView(garmentType.id) && (
                    <button
                        onClick={() => setShowBack(!showBack)}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                        {showBack ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showBack ? 'Frente' : 'Dorso'}</span>
                    </button>
                )}
            </div>

            <div className="text-sm text-gray-600 font-light mb-4">
                Arrastra el diseño para moverlo • Haz clic en rotar para girarlo
            </div>

            {/* Container con doble canvas optimizado */}
            <div
                data-testid="mockup-canvas-wrapper"
                className="relative aspect-[3/4] bg-gray-100 overflow-hidden border border-gray-200 rounded-lg"
                style={{
                    width: '100%',
                    height: '500px',
                    position: 'relative',
                    filter: 'blur(0px)'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Container de canvas */}
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
                    {/* Canvas de la prenda (ESTÁTICO - nunca se redibuja durante drag) */}
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
                            userSelect: 'none',
                            zIndex: 1
                        }}
                    />

                    {/* Canvas del diseño (ESTÁTICO - solo se redibuja al terminar drag) */}
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
                            userSelect: 'none',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            zIndex: 2,
                            opacity: isDragging ? 0 : 1,
                            transition: 'opacity 0.1s ease'
                        }}
                        onMouseDown={handleMouseDown}
                    />

                    {/* Elemento HTML para drag suave (solo visible durante drag) */}
                    {isDragging && selectedDesign && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${designPosition.x}%`,
                                top: `${designPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                width: `${Math.min(containerSize.width, containerSize.height) * 0.15 * designSize.scale * (selectedDesign?.customScale || 1.0)}px`,
                                height: `${Math.min(containerSize.width, containerSize.height) * 0.15 * designSize.scale * (selectedDesign?.customScale || 1.0)}px`,
                                pointerEvents: 'none',
                                zIndex: 10
                            }}
                        >
                            <img
                                src={selectedDesign.image}
                                alt="Design"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    transform: `rotate(${designRotation}deg)`,
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Controles de rotación mejorados */}
                {selectedDesign && (
                    <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                        <button
                            onClick={handleRotate}
                            className="p-3 bg-white/95 hover:bg-white transition-all duration-200 rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105"
                            title="Rotar diseño"
                        >
                            <RotateCw className="h-5 w-5 text-gray-700" />
                        </button>
                        <div className="p-3 bg-white/95 rounded-full shadow-lg border border-gray-200 flex items-center">
                            <Move className="h-5 w-5 text-gray-700" />
                        </div>
                    </div>
                )}
            </div>

            {/* Información del diseño */}
            {selectedDesign && (
                <div className="bg-gray-50 p-4 space-y-2 rounded-lg">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diseño:</span>
                        <span className="font-light text-black">{selectedDesign.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tamaño:</span>
                        <span className="font-light text-black">{designSize.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Posición:</span>
                        <span className="font-light text-black">
                            {Math.round(designPosition.x)}%, {Math.round(designPosition.y)}%
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rotación:</span>
                        <span className="font-light text-black">{designRotation}°</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmoothCanvasPreview;