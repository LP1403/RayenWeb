import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw, Maximize2, Eye, EyeOff } from 'lucide-react';
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
    const [designImageLoaded, setDesignImageLoaded] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 400, height: 500 });
    const [isLoadingGarment, setIsLoadingGarment] = useState(false);
    const isDraggingRef = useRef(false);
    const [rotationStep, setRotationStep] = useState(5);
    const [isFlipped, setIsFlipped] = useState(false);
    const lastMoveTime = useRef(0);

    // Función para redimensionar los canvas
    const resizeCanvas = useCallback(() => {
        if (!containerRef.current || !garmentCanvasRef.current || !designCanvasRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        console.log('🔄 Resizing canvas:', { width, height, rect });

        setContainerSize({ width, height });

        // Mantener proporción 3:4 para los canvas
        const aspectRatio = 3 / 4;
        let canvasWidth = width;
        let canvasHeight = width / aspectRatio;

        // Si la altura calculada es mayor que la disponible, ajustar por altura
        if (canvasHeight > height) {
            canvasHeight = height;
            canvasWidth = height * aspectRatio;
        }

        const garmentCanvas = garmentCanvasRef.current;
        garmentCanvas.width = canvasWidth;
        garmentCanvas.height = canvasHeight;
        garmentCanvas.style.width = `${canvasWidth}px`;
        garmentCanvas.style.height = `${canvasHeight}px`;

        const designCanvas = designCanvasRef.current;
        designCanvas.width = canvasWidth;
        designCanvas.height = canvasHeight;
        designCanvas.style.width = `${canvasWidth}px`;
        designCanvas.style.height = `${canvasHeight}px`;

        console.log('✅ Canvas resized successfully with aspect ratio 3:4');
    }, []);

    // Función para dibujar el canvas de la prenda
    const drawGarmentCanvas = useCallback(() => {
        if (!garmentCanvasRef.current || !garmentType) return;

        const canvas = garmentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Asegurar que el canvas tenga dimensiones
        if (canvas.width === 0 || canvas.height === 0) {
            console.log('🔄 Canvas has no dimensions, resizing first...');
            resizeCanvas();
            setTimeout(() => {
                drawGarmentCanvas();
            }, 100);
            return;
        }

        console.log('🔄 Drawing garment canvas:', {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            garmentType: garmentType.id,
            garmentColor
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        setIsLoadingGarment(true);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        const loadingTimeout = setTimeout(() => {
            console.log('⏰ Loading timeout reached, forcing stop');
            setIsLoadingGarment(false);
        }, 10000); // Aumentar timeout para mobile

        img.onload = () => {
            clearTimeout(loadingTimeout);
            console.log('✅ Garment image loaded, drawing to canvas');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setIsLoadingGarment(false);
            console.log('✅ Garment image drawn successfully');
        };

        img.onerror = (error) => {
            clearTimeout(loadingTimeout);
            console.error('❌ Error loading garment image:', error);
            setIsLoadingGarment(false);
        };

        const colorName = garmentColor === '#FFFFFF' ? 'blanco' :
            garmentColor === '#000000' ? 'negro' :
                garmentColor === '#6B7280' ? 'gris' : 'blanco';

        const imageUrl = getGarmentTemplate(garmentType.id, colorName);
        console.log('🔄 Loading garment image:', {
            garmentType: garmentType.id,
            color: garmentColor,
            colorName,
            imageUrl,
            canvasSize: { width: canvas.width, height: canvas.height }
        });

        if (!imageUrl || imageUrl === '') {
            console.error('❌ Invalid image URL');
            setIsLoadingGarment(false);
            return;
        }

        img.src = imageUrl;
    }, [garmentType, garmentColor, resizeCanvas]);

    // Función para dibujar el canvas del diseño
    const drawDesignCanvas = useCallback(() => {
        if (!designCanvasRef.current || !selectedDesign || isDraggingRef.current) return;

        const canvas = designCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Asegurar que el canvas tenga dimensiones válidas
        if (canvas.width === 0 || canvas.height === 0) {
            console.log('🔄 Design canvas has no dimensions, skipping draw');
            return;
        }

        const designImg = new Image();
        designImg.crossOrigin = 'anonymous';

        // Optimizaciones para imágenes pesadas
        designImg.loading = 'eager';
        designImg.decoding = 'async';

        designImg.onload = () => {
            console.log('🔄 Drawing design on canvas:', {
                canvasSize: { width: canvas.width, height: canvas.height },
                designPosition,
                designSize: designSize.scale,
                designRotation,
                imageSize: { width: designImg.width, height: designImg.height }
            });

            const x = (designPosition.x / 100) * canvas.width;
            const y = (designPosition.y / 100) * canvas.height;
            const customScale = selectedDesign.customScale || 1.0;

            // Calcular el tamaño base manteniendo la proporción
            const baseSize = Math.min(canvas.width, canvas.height) * 0.15 * designSize.scale * customScale;

            // Calcular las dimensiones manteniendo la proporción original
            const aspectRatio = designImg.width / designImg.height;
            let drawWidth, drawHeight;

            if (aspectRatio > 1) {
                // Imagen más ancha que alta
                drawWidth = baseSize;
                drawHeight = baseSize / aspectRatio;
            } else {
                // Imagen más alta que ancha o cuadrada
                drawHeight = baseSize;
                drawWidth = baseSize * aspectRatio;
            }

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((designRotation * Math.PI) / 180);

            // Aplicar espejo si está activado
            if (isFlipped) {
                ctx.scale(-1, 1);
            }

            // Dibujar la imagen con suavizado
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(designImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

            ctx.restore();

            setDesignImageLoaded(true);
            console.log('✅ Design drawn successfully with original proportions');
        };
        designImg.onerror = (error) => {
            console.error('❌ Error loading design image:', error);
            setDesignImageLoaded(true);
        };
        designImg.src = selectedDesign.image;
    }, [selectedDesign, designSize, designPosition, designRotation, isFlipped]);

    // Cargar imagen de la prenda cuando cambie
    useEffect(() => {
        if (garmentType) {
            console.log('🔄 Garment type changed, loading image...');
            // Forzar redimensionamiento primero
            setTimeout(() => {
                resizeCanvas();
            }, 50);
            // Luego cargar la imagen
            setTimeout(() => {
                drawGarmentCanvas();
            }, 200);
        }
    }, [garmentType, garmentColor, drawGarmentCanvas, resizeCanvas]);

    // Cargar imagen del diseño cuando cambie
    useEffect(() => {
        if (selectedDesign) {
            setTimeout(() => {
                drawDesignCanvas();
            }, 100);
        }
    }, [selectedDesign, designSize, drawDesignCanvas]);

    // Redibujar diseño cuando cambien posición/rotación
    useEffect(() => {
        if (selectedDesign && !isDragging && designImageLoaded) {
            setTimeout(() => {
                drawDesignCanvas();
            }, 50);
        }
    }, [designPosition, designRotation, selectedDesign, isDragging, designImageLoaded, drawDesignCanvas]);

    // Redimensionar canvas
    useEffect(() => {
        const handleResize = () => {
            console.log('🔄 Window resize detected');
            setTimeout(() => {
                resizeCanvas();
                // Redibujar después del resize
                setTimeout(() => {
                    if (garmentType) {
                        drawGarmentCanvas();
                    }
                    if (selectedDesign) {
                        drawDesignCanvas();
                    }
                }, 100);
            }, 100);
        };

        // También escuchar cambios de orientación en mobile
        const handleOrientationChange = () => {
            console.log('🔄 Orientation change detected');
            setTimeout(() => {
                resizeCanvas();
                // Redibujar después del resize
                setTimeout(() => {
                    if (garmentType) {
                        drawGarmentCanvas();
                    }
                    if (selectedDesign) {
                        drawDesignCanvas();
                    }
                }, 200);
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [resizeCanvas, drawGarmentCanvas, drawDesignCanvas, garmentType, selectedDesign]);

    // Redimensionar cuando cambie el tipo de prenda
    useEffect(() => {
        if (garmentType) {
            setTimeout(() => {
                resizeCanvas();
                // Forzar redibujado después del resize
                setTimeout(() => {
                    drawGarmentCanvas();
                }, 100);
            }, 200);
        }
    }, [garmentType, resizeCanvas, drawGarmentCanvas]);

    // Inicializar canvas al montar el componente
    useEffect(() => {
        const timer = setTimeout(() => {
            resizeCanvas();
            if (garmentType) {
                drawGarmentCanvas();
            }
        }, 100);

        // También forzar redimensionamiento después de un tiempo adicional
        const timer2 = setTimeout(() => {
            resizeCanvas();
            if (garmentType) {
                drawGarmentCanvas();
            }
        }, 500);

        // Efecto adicional para cuando el contenedor esté visible
        const timer3 = setTimeout(() => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    resizeCanvas();
                    if (garmentType) {
                        drawGarmentCanvas();
                    }
                }
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [resizeCanvas, drawGarmentCanvas, garmentType]);

    // Función auxiliar para obtener coordenadas del evento (mouse o touch)
    const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e && e.touches.length > 0) {
            return {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            };
        } else if ('clientX' in e) {
            return {
                clientX: e.clientX,
                clientY: e.clientY
            };
        }
        return { clientX: 0, clientY: 0 };
    };

    // Función auxiliar para iniciar el drag
    const startDrag = (clientX: number, clientY: number) => {
        if (!selectedDesign) return false;

        // Verificar si el touch/click es dentro del área del diseño
        const rect = designCanvasRef.current?.getBoundingClientRect();
        if (!rect) return false;

        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;

        // Calcular la posición del diseño en el canvas
        const designX = (designPosition.x / 100) * rect.width;
        const designY = (designPosition.y / 100) * rect.height;

        // Calcular el tamaño del diseño
        const designSizePixels = Math.min(rect.width, rect.height) * 0.15 * designSize.scale * (selectedDesign.customScale || 1.0);
        const hitRadius = designSizePixels * 0.8; // Área de detección más grande

        // Verificar si el touch/click está dentro del área del diseño
        const distance = Math.sqrt(
            Math.pow(canvasX - designX, 2) + Math.pow(canvasY - designY, 2)
        );

        // Solo permitir drag si el touch/click está dentro del área del diseño
        if (distance > hitRadius) {
            return false; // No iniciar drag si el touch/click está fuera del diseño
        }

        setIsDragging(true);
        isDraggingRef.current = true;

        setDragStart({
            x: clientX - designX,
            y: clientY - designY
        });

        return true;
    };

    // Manejar eventos de mouse
    const handleMouseDown = (e: React.MouseEvent) => {
        const { clientX, clientY } = getEventCoordinates(e);
        if (startDrag(clientX, clientY)) {
            e.preventDefault();
        }
    };

    // Manejar eventos de touch
    const handleTouchStart = (e: React.TouchEvent) => {
        const { clientX, clientY } = getEventCoordinates(e);
        if (startDrag(clientX, clientY)) {
            e.preventDefault();
        }
    };

    // Función auxiliar para manejar el movimiento durante el drag
    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging || !designCanvasRef.current) return;

        // Throttling para evitar demasiadas actualizaciones
        const now = Date.now();
        if (now - lastMoveTime.current < 16) return; // ~60fps
        lastMoveTime.current = now;

        const rect = designCanvasRef.current.getBoundingClientRect();
        const newX = Math.max(10, Math.min(90, ((clientX - dragStart.x) / rect.width) * 100));
        const newY = Math.max(10, Math.min(90, ((clientY - dragStart.y) / rect.height) * 100));

        // Actualizar posición inmediatamente para movimiento en tiempo real
        onPositionChange({ x: newX, y: newY });

        // NO redibujar el canvas durante el drag - solo usar el elemento HTML
        // El canvas se redibujará al soltar
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = getEventCoordinates(e);
        handleMove(clientX, clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const { clientX, clientY } = getEventCoordinates(e);
        handleMove(clientX, clientY);
        e.preventDefault(); // Prevenir scroll durante el drag
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        isDraggingRef.current = false;
        setTimeout(() => {
            drawDesignCanvas();
        }, 100);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        isDraggingRef.current = false;
        setTimeout(() => {
            drawDesignCanvas();
        }, 100);
    };

    const handleRotateLeft = () => {
        const newRotation = designRotation - rotationStep;
        onRotationChange(newRotation < 0 ? 360 + newRotation : newRotation);
    };

    const handleRotateRight = () => {
        onRotationChange((designRotation + rotationStep) % 360);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // Eventos globales para el drag (mouse y touch)
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || !designCanvasRef.current) return;

            const rect = designCanvasRef.current.getBoundingClientRect();
            const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / rect.width) * 100));
            const newY = Math.max(10, Math.min(90, ((e.clientY - dragStart.y) / rect.height) * 100));

            onPositionChange({ x: newX, y: newY });
        };

        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (!isDragging || !designCanvasRef.current || e.touches.length === 0) return;

            const touch = e.touches[0];
            const rect = designCanvasRef.current.getBoundingClientRect();
            const newX = Math.max(10, Math.min(90, ((touch.clientX - dragStart.x) / rect.width) * 100));
            const newY = Math.max(10, Math.min(90, ((touch.clientY - dragStart.y) / rect.height) * 100));

            onPositionChange({ x: newX, y: newY });
            e.preventDefault(); // Prevenir scroll durante el drag
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            isDraggingRef.current = false;
            setTimeout(() => {
                drawDesignCanvas();
            }, 100);
        };

        const handleGlobalTouchEnd = () => {
            setIsDragging(false);
            isDraggingRef.current = false;
            setTimeout(() => {
                drawDesignCanvas();
            }, 100);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
            document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
            document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('touchmove', handleGlobalTouchMove);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, [isDragging, dragStart, onPositionChange, drawDesignCanvas]);

    if (!garmentType) {
        return (
            <div className="bg-gray-50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Maximize2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una prenda</h3>
                <p className="text-gray-500">Elige un tipo de prenda para comenzar a diseñar</p>
            </div>
        );
    }

    if (!selectedDesign) {
        return (
            <div className="bg-gray-50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Maximize2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un diseño</h3>
                <p className="text-gray-500">Elige un diseño para personalizar tu prenda</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Vista previa</h3>
                        <p className="text-sm text-gray-500 mt-1">Personaliza tu diseño</p>
                    </div>
                    {garmentType && hasBackView() && (
                        <button
                            onClick={() => setShowBack(!showBack)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                        >
                            {showBack ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {showBack ? 'Vista frontal' : 'Vista trasera'}
                        </button>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-800">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                            <span className="hidden sm:inline">Arrastra el diseño para moverlo • Usa los controles para rotar</span>
                            <span className="sm:hidden">Toca y arrastra el diseño para moverlo • Usa los controles para rotar</span>
                        </span>
                    </div>
                </div>


                {/* Container con doble canvas optimizado */}
                <div
                    data-testid="mockup-canvas-wrapper"
                    className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border-2 border-gray-200 rounded-xl shadow-inner"
                    style={{
                        width: '100%',
                        aspectRatio: '3/4',
                        maxHeight: '600px',
                        position: 'relative',
                        filter: 'blur(0px)',
                        touchAction: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Indicador de carga mejorado */}
                    {isLoadingGarment && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm z-10 rounded-xl">
                            <div className="text-center bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Cargando prenda...</h4>
                                <p className="text-sm text-gray-600 mb-4">Preparando tu diseño</p>
                                <button
                                    onClick={() => {
                                        console.log('🔄 Force reloading garment image');
                                        setIsLoadingGarment(false);
                                        setTimeout(() => {
                                            drawGarmentCanvas();
                                        }, 100);
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Reintentar
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('🔄 Force canvas resize and reload');
                                        resizeCanvas();
                                        setTimeout(() => {
                                            drawGarmentCanvas();
                                        }, 200);
                                    }}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors ml-2"
                                >
                                    Redimensionar
                                </button>
                            </div>
                        </div>
                    )}
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
                        {/* Canvas de la prenda */}
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
                                zIndex: 1,
                                willChange: 'auto',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                                imageRendering: 'auto',
                                opacity: 1,
                                pointerEvents: 'none',
                                backgroundColor: '#f3f4f6'
                            }}
                        />

                        {/* Debug: Mostrar si no hay imagen */}
                        {!isLoadingGarment && garmentType && (
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                                <div className="text-center text-gray-400">
                                    <div className="text-4xl mb-2">👕</div>
                                    <div className="text-sm">Cargando prenda...</div>
                                    <div className="text-xs mt-2 text-gray-300">
                                        {garmentType.name} - {garmentColor}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Canvas del diseño */}
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
                                cursor: isDragging ? 'grabbing' : 'default',
                                zIndex: 2,
                                opacity: isDragging ? 0.7 : 1,
                                transition: isDragging ? 'none' : 'opacity 0.2s ease',
                                willChange: isDragging ? 'opacity' : 'auto',
                                imageRendering: 'auto',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                                WebkitTouchCallout: 'none',
                                WebkitUserSelect: 'none',
                                KhtmlUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            onMouseMove={(e) => {
                                if (!selectedDesign) return;

                                const rect = designCanvasRef.current?.getBoundingClientRect();
                                if (!rect) return;

                                const canvasX = e.clientX - rect.left;
                                const canvasY = e.clientY - rect.top;

                                const designX = (designPosition.x / 100) * rect.width;
                                const designY = (designPosition.y / 100) * rect.height;

                                const designSizePixels = Math.min(rect.width, rect.height) * 0.15 * designSize.scale * (selectedDesign.customScale || 1.0);

                                const distance = Math.sqrt(
                                    Math.pow(canvasX - designX, 2) + Math.pow(canvasY - designY, 2)
                                );

                                // Cambiar cursor solo cuando está sobre el diseño
                                if (distance <= designSizePixels / 2) {
                                    designCanvasRef.current!.style.cursor = 'grab';
                                } else {
                                    designCanvasRef.current!.style.cursor = 'default';
                                }
                            }}
                        />

                        {/* Elemento HTML para drag suave */}
                        {isDragging && selectedDesign && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${designPosition.x}%`,
                                    top: `${designPosition.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${designRotation}deg) ${isFlipped ? 'scaleX(-1)' : ''}`,
                                    zIndex: 10,
                                    pointerEvents: 'none',
                                    opacity: 1,
                                    width: `${Math.min(containerSize.width, containerSize.height) * 0.15 * designSize.scale * (selectedDesign.customScale || 1.0) / containerSize.width * 100}%`,
                                    height: `${Math.min(containerSize.width, containerSize.height) * 0.15 * designSize.scale * (selectedDesign.customScale || 1.0) / containerSize.height * 100}%`,
                                    backgroundImage: `url(${selectedDesign.image})`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    aspectRatio: 'auto',
                                    transition: 'none',
                                    willChange: 'transform, left, top',
                                    // Optimizaciones para imágenes pesadas
                                    imageRendering: 'auto',
                                    backfaceVisibility: 'hidden',
                                    transformStyle: 'preserve-3d'
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Disclaimer sutil */}
                <div className="mt-4">
                    <div className="text-xs text-gray-500 space-y-1">
                        <p>• Esta previsualización es meramente representativa e ilustrativa y puede diferir del producto final</p>
                        <p>• El logo de Rayen se incluirá automáticamente en la prenda a menos que se especifique una ubicación particular</p>
                        <p>• Los colores, texturas y proporciones pueden variar ligeramente en el producto físico</p>
                    </div>
                </div>

                {/* Controles sutiles */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {/* Controles de rotación y espejo */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <RotateCw className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Rotación: {designRotation}°</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handleRotateLeft}
                                className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                                title="Rotar izquierda"
                            >
                                <RotateCw className="h-4 w-4 transform rotate-180 text-gray-600" />
                            </button>

                            <button
                                onClick={handleRotateRight}
                                className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                                title="Rotar derecha"
                            >
                                <RotateCw className="h-4 w-4 text-gray-600" />
                            </button>

                            <button
                                onClick={handleFlip}
                                className={`p-2 border border-gray-200 rounded-md transition-colors ${isFlipped
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white hover:bg-gray-50 text-gray-600'
                                    }`}
                                title="Espejar horizontalmente"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Selector de paso de rotación - 4 opciones */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">Precisión:</span>
                        <div className="flex space-x-1">
                            {[5, 45, 90, 180].map((step) => (
                                <button
                                    key={step}
                                    onClick={() => setRotationStep(step)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${rotationStep === step
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {step}°
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SmoothCanvasPreview;