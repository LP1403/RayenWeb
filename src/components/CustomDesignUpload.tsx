import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { UploadLimits, defaultUploadLimits, validateFile, validateImageDimensions, formatFileSize } from '../config/uploadLimits';

interface CustomDesignUploadProps {
    onDesignUpload: (file: File, previewUrl: string) => void;
    onRemove: () => void;
    limits?: UploadLimits;
    className?: string;
}

const CustomDesignUpload: React.FC<CustomDesignUploadProps> = ({
    onDesignUpload,
    onRemove,
    limits = defaultUploadLimits,
    className = ''
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Función para procesar el archivo
    const processFile = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            // Validar archivo
            const fileValidation = validateFile(file, limits);
            if (!fileValidation.valid) {
                setError(fileValidation.error!);
                setIsUploading(false);
                return;
            }

            // Crear preview
            const url = URL.createObjectURL(file);

            // Validar dimensiones si es una imagen
            if (file.type.startsWith('image/')) {
                const img = new Image();
                img.onload = () => {
                    const dimensionValidation = validateImageDimensions(img.width, img.height, limits);
                    if (!dimensionValidation.valid) {
                        setError(dimensionValidation.error!);
                        URL.revokeObjectURL(url);
                        setIsUploading(false);
                        return;
                    }

                    // Todo válido, proceder
                    setPreviewUrl(url);
                    setUploadedFile(file);
                    onDesignUpload(file, url);
                    setIsUploading(false);
                };
                img.onerror = () => {
                    setError('Error al cargar la imagen');
                    URL.revokeObjectURL(url);
                    setIsUploading(false);
                };
                img.src = url;
            } else {
                // Para SVG u otros formatos
                setPreviewUrl(url);
                setUploadedFile(file);
                onDesignUpload(file, url);
                setIsUploading(false);
            }
        } catch (err) {
            setError('Error al procesar el archivo');
            setIsUploading(false);
        }
    }, [limits, onDesignUpload]);

    // Manejar drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, [processFile]);

    // Manejar click en input
    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, [processFile]);

    // Manejar click en área de drop
    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Remover archivo
    const handleRemove = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setUploadedFile(null);
        setError(null);
        onRemove();
    }, [previewUrl, onRemove]);

    return (
        <div className={`w-full ${className}`}>
            {/* Área de subida */}
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={limits.allowedFormats.join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                    multiple={limits.maxFiles > 1}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                        <p className="text-sm text-gray-600">Procesando archivo...</p>
                    </div>
                ) : previewUrl ? (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview del diseño"
                                className="max-w-32 max-h-32 object-contain rounded-lg shadow-sm"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Diseño cargado</span>
                        </div>
                        {uploadedFile && (
                            <div className="text-xs text-gray-500">
                                {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Sube tu diseño personalizado
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Arrastra y suelta o haz clic para seleccionar
                            </p>
                        </div>
                        <div className="text-xs text-gray-400">
                            <p>Formatos: {limits.allowedFormats.join(', ')}</p>
                            <p>Máximo: {formatFileSize(limits.maxFileSize)}</p>
                            <p>Dimensiones: {limits.minWidth}x{limits.minHeight} - {limits.maxWidth}x{limits.maxHeight}px</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Información del archivo cargado */}
            {uploadedFile && !error && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-700">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Diseño personalizado cargado</span>
                    </div>
                    <div className="mt-1 text-xs text-green-600">
                        {uploadedFile.name} • {formatFileSize(uploadedFile.size)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDesignUpload;
