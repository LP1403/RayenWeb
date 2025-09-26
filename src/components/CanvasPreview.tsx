import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw, Move, Maximize2, Eye, EyeOff } from 'lucide-react';
import { GarmentType, Design, DesignSize } from '../types/Design';
import { getBaseGarmentImage, applyColorFilter } from '../data/garmentImages';

interface CanvasPreviewProps {
    garmentType: GarmentType | null;
    garmentColor: string;
    selectedDesign: Design | null;
    designSize: DesignSize;
    designPosition: { x: number; y: number };
    designRotation: number;
    onPositionChange: (position: { x: number; y: number }) => void;
    onRotationChange: (rotation: number) => void;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
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
    const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
    const upperCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showBack, setShowBack] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 400, height: 500 });
    const [lastUpdateTime, setLastUpdateTime] = useState(0);

    // Función para redimensionar el canvas
    const resizeCanvas = useCallback(() => {
        if (!containerRef.current || !lowerCanvasRef.current || !upperCanvasRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        setContainerSize({ width, height });

        // Configurar canvas inferior (imagen de fondo)
        const lowerCanvas = lowerCanvasRef.current;
        lowerCanvas.width = width;
        lowerCanvas.height = height;
        lowerCanvas.style.width = `${width}px`;
        lowerCanvas.style.height = `${height}px`;

        // Configurar canvas superior (diseño)
        const upperCanvas = upperCanvasRef.current;
        upperCanvas.width = width;
        upperCanvas.height = height;
        upperCanvas.style.width = `${width}px`;
        upperCanvas.style.height = `${height}px`;

        // Redibujar
        drawLowerCanvas();
        drawUpperCanvas();
    }, [garmentType, garmentColor, showBack, selectedDesign, designSize, designPosition, designRotation]);

    // Función para dibujar el canvas inferior (imagen de fondo)
    const drawLowerCanvas = useCallback(() => {
        if (!lowerCanvasRef.current || !garmentType) return;

        const canvas = lowerCanvasRef.current;
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

            // Aplicar filtro de color
            applyColorFilter(ctx, garmentColor);
        };
        img.src = getBaseGarmentImage(garmentType.id, showBack);
    }, [garmentType, garmentColor, showBack]);

    // Cache para la imagen del diseño
    const designImageCache = useRef<HTMLImageElement | null>(null);
    const isDraggingRef = useRef(false);

    // Función para cargar la imagen del diseño una sola vez
    const loadDesignImage = useCallback(() => {
        if (!selectedDesign || designImageCache.current) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            designImageCache.current = img;
            drawUpperCanvas();
        };
        img.src = selectedDesign.image;
    }, [selectedDesign]);

    // Función para dibujar el canvas superior (diseño) - optimizada
    const drawUpperCanvas = useCallback(() => {
        if (!upperCanvasRef.current || !selectedDesign || !designImageCache.current) return;

        const canvas = upperCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calcular posición y tamaño
        const x = (designPosition.x / 100) * canvas.width;
        const y = (designPosition.y / 100) * canvas.height;
        const size = Math.min(canvas.width, canvas.height) * 0.15 * designSize.scale;

        // Guardar contexto
        ctx.save();

        // Mover al centro del diseño
        ctx.translate(x, y);

        // Rotar
        ctx.rotate((designRotation * Math.PI) / 180);

        // Dibujar diseño (usando imagen cacheada)
        ctx.drawImage(designImageCache.current, -size / 2, -size / 2, size, size);

        // Restaurar contexto
        ctx.restore();
    }, [selectedDesign, designSize, designPosition, designRotation]);

    // Cargar imagen del diseño cuando cambie
    useEffect(() => {
        if (selectedDesign) {
            designImageCache.current = null; // Reset cache
            loadDesignImage();
        }
    }, [selectedDesign, loadDesignImage]);

    // Solo redibujar cuando NO esté arrastrando
    useEffect(() => {
        if (!isDraggingRef.current) {
            drawUpperCanvas();
        }
    }, [drawUpperCanvas]);

    // Efecto para redimensionar cuando cambie el tamaño del contenedor
    useEffect(() => {
        resizeCanvas();

        const handleResize = () => resizeCanvas();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [resizeCanvas]);

    // Efecto para redibujar cuando cambien las propiedades
    useEffect(() => {
        drawLowerCanvas();
    }, [drawLowerCanvas]);

    useEffect(() => {
        drawUpperCanvas();
    }, [drawUpperCanvas]);

    // Manejar eventos de mouse - optimizado
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!selectedDesign) return;

        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = true;

        const rect = upperCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - (designPosition.x / 100) * rect.width,
                y: e.clientY - (designPosition.y / 100) * rect.height
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !upperCanvasRef.current) return;

        const rect = upperCanvasRef.current.getBoundingClientRect();
        const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
        const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

        // Actualizar posición directamente sin redibujar todo
        onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        isDraggingRef.current = false;
        // Redibujar una vez al terminar el drag
        drawUpperCanvas();
    };

    const handleRotate = () => {
        onRotationChange((designRotation + 15) % 360);
    };

    // Eventos globales para el drag - optimizado con throttling
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || !upperCanvasRef.current) return;

            const now = Date.now();
            // Throttle a 60fps (16ms)
            if (now - lastUpdateTime < 16) return;

            const rect = upperCanvasRef.current.getBoundingClientRect();
            const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
            const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

            setLastUpdateTime(now);
            onPositionChange({ x: newX, y: newY });
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            isDraggingRef.current = false;
            // Redibujar una vez al terminar el drag
            drawUpperCanvas();
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
            document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, onPositionChange, lastUpdateTime, drawUpperCanvas]);

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
                <button
                    onClick={() => setShowBack(!showBack)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                    {showBack ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showBack ? 'Frente' : 'Dorso'}</span>
                </button>
            </div>

            <div className="text-sm text-gray-600 font-light mb-4">
                Arrastra el diseño para moverlo • Haz clic en rotar para girarlo
            </div>

            {/* Wrapper con estilos exactos de Kittl */}
            <div
                data-testid="mockup-canvas-wrapper"
                className="relative aspect-[3/4] bg-gray-100 overflow-hidden border border-gray-200 rounded-lg"
                style={{
                    width: '100%',
                    height: '500px',
                    position: 'relative',
                    filter: 'blur(0px)',
                    animation: '0.5s linear 0s 1 normal none running MQRBn'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
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
                        ref={lowerCanvasRef}
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
                        ref={upperCanvasRef}
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
                            opacity: isDragging ? 0 : 1,
                            transition: 'opacity 0.1s ease'
                        }}
                        onMouseDown={handleMouseDown}
                    />

                    {/* Elemento HTML para drag suave */}
                    {isDragging && selectedDesign && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${designPosition.x}%`,
                                top: `${designPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                width: `${Math.min(containerSize.width, containerSize.height) * 0.15 * designSize.scale}px`,
                                height: `${Math.min(containerSize.width, containerSize.height) * 0.15 * designSize.scale}px`,
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

                {/* Controles de rotación */}
                {selectedDesign && (
                    <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                        <button
                            onClick={handleRotate}
                            className="p-2 bg-white/90 hover:bg-white transition-colors rounded-full shadow-sm"
                            title="Rotar diseño"
                        >
                            <RotateCw className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="p-2 bg-white/90 rounded-full shadow-sm flex items-center">
                            <Move className="h-4 w-4 text-gray-600" />
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

export default CanvasPreview;
