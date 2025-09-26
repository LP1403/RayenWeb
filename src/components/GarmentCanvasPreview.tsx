import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw, Move } from 'lucide-react';
import { GarmentType, Design, DesignSize } from '../types/Design';
import { getGarmentImage, applyColorFilter } from '../data/garmentImages';

interface GarmentCanvasPreviewProps {
    garmentType: GarmentType | null;
    garmentColor: string;
    selectedDesign: Design | null;
    designSize: DesignSize;
    designPosition: { x: number; y: number };
    designRotation: number;
    editable?: boolean;
    onPositionChange?: (position: { x: number; y: number }) => void;
    onRotationChange?: (rotation: number) => void;
    showBack?: boolean;
    onToggleBack?: () => void;
}

const GarmentCanvasPreview: React.FC<GarmentCanvasPreviewProps> = ({
    garmentType,
    garmentColor,
    selectedDesign,
    designSize,
    designPosition,
    designRotation,
    editable = false,
    onPositionChange,
    onRotationChange,
    showBack = false,
    onToggleBack
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
    const upperCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    // Eliminado: containerSize no se usa
    const designImageCache = useRef<HTMLImageElement | null>(null);
    const isDraggingRef = useRef(false);

    // Redimensionar canvas
    const resizeCanvas = useCallback(() => {
        if (!containerRef.current || !lowerCanvasRef.current || !upperCanvasRef.current) return;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        lowerCanvasRef.current.width = width;
        lowerCanvasRef.current.height = height;
        upperCanvasRef.current.width = width;
        upperCanvasRef.current.height = height;
        drawLowerCanvas();
        drawUpperCanvas();
    }, [garmentType, garmentColor, showBack, selectedDesign, designSize, designPosition, designRotation]);

    // Dibujar canvas inferior (mockup)
    const drawLowerCanvas = useCallback(() => {
        if (!lowerCanvasRef.current || !garmentType) return;
        const canvas = lowerCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            applyColorFilter(ctx, garmentColor);
        };
        img.src = getGarmentImage(garmentType.id, garmentColor, showBack);
    }, [garmentType, garmentColor, showBack]);

    // Cargar imagen del diseño
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

    // Dibujar canvas superior (diseño)
    const drawUpperCanvas = useCallback(() => {
        if (!upperCanvasRef.current || !selectedDesign || !designImageCache.current) return;
        const canvas = upperCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const x = (designPosition.x / 100) * canvas.width;
        const y = (designPosition.y / 100) * canvas.height;
        const size = Math.min(canvas.width, canvas.height) * 0.15 * designSize.scale;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((designRotation * Math.PI) / 180);
        ctx.drawImage(designImageCache.current, -size / 2, -size / 2, size, size);
        ctx.restore();
    }, [selectedDesign, designSize, designPosition, designRotation]);

    // Cargar imagen del diseño cuando cambie
    useEffect(() => {
        if (selectedDesign) {
            designImageCache.current = null;
            loadDesignImage();
        }
    }, [selectedDesign, loadDesignImage]);

    useEffect(() => {
        if (!isDraggingRef.current) {
            drawUpperCanvas();
        }
    }, [drawUpperCanvas]);

    useEffect(() => {
        resizeCanvas();
        const handleResize = () => resizeCanvas();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [resizeCanvas]);

    useEffect(() => {
        drawLowerCanvas();
    }, [drawLowerCanvas]);

    useEffect(() => {
        drawUpperCanvas();
    }, [drawUpperCanvas]);

    // Drag & drop para edición
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!editable || !selectedDesign) return;
        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = true;
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - (designPosition.x / 100) * rect.width,
                y: e.clientY - (designPosition.y / 100) * rect.height
            });
        }
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!editable || !isDragging || !containerRef.current || !onPositionChange) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
        const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));
        onPositionChange({ x: newX, y: newY });
    };
    const handleMouseUp = () => {
        setIsDragging(false);
        isDraggingRef.current = false;
    };
    const handleRotate = () => {
        if (editable && onRotationChange) {
            onRotationChange((designRotation + 15) % 360);
        }
    };

    if (!garmentType) {
        return (
            <div className="bg-gray-50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Sin prenda</span>
                </div>
                <p className="text-gray-500 font-light">Selecciona una prenda para ver el preview</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-light text-black">Vista previa</h3>
                {onToggleBack && (
                    <button
                        onClick={onToggleBack}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                        <span>{showBack ? 'Frente' : 'Dorso'}</span>
                    </button>
                )}
            </div>
            <div className="text-sm text-gray-600 font-light mb-4">
                Arrastra el diseño para moverlo • Haz clic en rotar para girarlo
            </div>
            <div
                ref={containerRef}
                className="relative aspect-[3/4] bg-gray-100 overflow-hidden border border-gray-200 rounded-lg"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <canvas
                    ref={lowerCanvasRef}
                    className="absolute top-0 left-0 w-full h-full z-0"
                />
                <canvas
                    ref={upperCanvasRef}
                    className="absolute top-0 left-0 w-full h-full z-10"
                    onMouseDown={handleMouseDown}
                />
                {/* Controles de rotación */}
                {editable && selectedDesign && (
                    <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
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

export default GarmentCanvasPreview;
