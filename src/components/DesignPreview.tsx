import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Move, Maximize2, Eye, EyeOff } from 'lucide-react';
import { GarmentType, Design, DesignSize } from '../types/Design';
import { getGarmentImage } from '../data/garmentImages';

interface DesignPreviewProps {
    garmentType: GarmentType | null;
    garmentColor: string;
    selectedDesign: Design | null;
    designSize: DesignSize;
    designPosition: { x: number; y: number };
    designRotation: number;
    onPositionChange: (position: { x: number; y: number }) => void;
    onRotationChange: (rotation: number) => void;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
    garmentType,
    garmentColor,
    selectedDesign,
    designSize,
    designPosition,
    designRotation,
    onPositionChange,
    onRotationChange
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showBack, setShowBack] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const designRef = useRef<HTMLDivElement>(null);


    const handleMouseDown = (e: React.MouseEvent) => {
        if (!selectedDesign) return;
        e.preventDefault();

        setIsDragging(true);
        const rect = previewRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - (designPosition.x / 100) * rect.width,
                y: e.clientY - (designPosition.y / 100) * rect.height
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !previewRef.current) return;

        const rect = previewRef.current.getBoundingClientRect();
        const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
        const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

        onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleRotate = () => {
        onRotationChange((designRotation + 15) % 360);
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || !previewRef.current) return;

            const rect = previewRef.current.getBoundingClientRect();
            const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
            const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

            onPositionChange({ x: newX, y: newY });
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, onPositionChange]);

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

            <div
                ref={previewRef}
                className="relative aspect-[3/4] bg-gray-100 overflow-hidden border border-gray-200 rounded-lg"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Imagen base de la prenda */}
                <img
                    src={getGarmentImage(garmentType.id, garmentColor, showBack)}
                    alt={`${garmentType.name} ${garmentColor}`}
                    className="w-full h-full object-cover"
                />

                {/* Diseño superpuesto */}
                {selectedDesign && (
                    <div
                        ref={designRef}
                        className="absolute cursor-move select-none z-10"
                        style={{
                            left: `${designPosition.x}%`,
                            top: `${designPosition.y}%`,
                            transform: `translate(-50%, -50%) rotate(${designRotation}deg) scale(${designSize.scale})`,
                            transformOrigin: 'center',
                            opacity: isDragging ? 0.8 : 1,
                            transition: isDragging ? 'none' : 'all 0.2s ease',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <img
                            src={selectedDesign.image}
                            alt={selectedDesign.name}
                            className="w-20 h-20 object-contain"
                            draggable={false}
                        />
                    </div>
                )}

                {/* Controles de rotación */}
                {selectedDesign && (
                    <div className="absolute bottom-4 right-4 flex space-x-2">
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

export default DesignPreview;
