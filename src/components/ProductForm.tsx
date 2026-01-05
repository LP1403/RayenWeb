import { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Product, CreateProductData } from '../types/Product';
import { uploadProductImages } from '../services/imageService';
import { useActiveCategories } from '../hooks/useCategories';

interface ProductFormProps {
    product?: Product | null;
    onSubmit: (data: CreateProductData) => void;
    onClose: () => void;
}

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
    const { categories, loading: categoriesLoading } = useActiveCategories();

    const [formData, setFormData] = useState<CreateProductData>({
        name: '',
        category: categories.length > 0 ? categories[0].slug : 'remera',
        price: 0,
        cost: 0,
        description: '',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#FFFFFF', '#000000'],
        stock: 0
    });

    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('#000000');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState<{ [color: string]: File[] }>({});
    const [uploadingImages, setUploadingImages] = useState(false);

    useEffect(() => {
        if (product) {
            console.log('🔍 ProductForm Debug:');
            console.log('Product:', product);
            console.log('Product.imagesByColor:', product.imagesByColor);
            console.log('Product.colors:', product.colors);
            console.log('Product.images:', product.images);

            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                cost: product.cost || 0,
                description: product.description,
                images: product.images,
                sizes: product.sizes,
                colors: product.colors,
                stock: product.stock,
                imagesByColor: product.imagesByColor || {}
            });
        }
    }, [product]);

    // Actualizar categoría por defecto cuando se cargan las categorías
    useEffect(() => {
        if (categories.length > 0 && !product) {
            setFormData(prev => ({
                ...prev,
                category: categories[0].slug
            }));
        }
    }, [categories, product]);

    const handleImageUpload = (color: string, files: FileList) => {
        const newFiles = Array.from(files);
        setImageFiles(prev => ({
            ...prev,
            [color]: [...(prev[color] || []), ...newFiles]
        }));
    };

    const removeImage = (color: string, index: number) => {
        setImageFiles(prev => ({
            ...prev,
            [color]: prev[color]?.filter((_, i) => i !== index) || []
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadingImages(true);

        try {
            let finalFormData = { ...formData };

            // Si hay imágenes nuevas, subirlas
            if (Object.keys(imageFiles).length > 0) {
                const uploadedImages = await uploadProductImages(
                    formData.name,
                    formData.colors,
                    imageFiles
                );

                // Actualizar las URLs de las imágenes
                finalFormData.images = uploadedImages.mainImages.map(img => img.url);

                // Crear imagesByColor con las URLs subidas
                const imagesByColor: { [color: string]: string[] } = {};
                Object.entries(uploadedImages.imagesByColor).forEach(([color, images]) => {
                    imagesByColor[color] = images.map(img => img.url);
                });

                // Agregar carouselImages si no existe
                if (uploadedImages.carouselImages.length > 0) {
                    (finalFormData as CreateProductData & { carouselImages?: string[] }).carouselImages = uploadedImages.carouselImages.map(img => img.url);
                }
            }

            await onSubmit(finalFormData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
            setUploadingImages(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'cost' || name === 'stock' ? Number(value) : value
        }));
    };

    const addSize = () => {
        if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
            setFormData(prev => ({
                ...prev,
                sizes: [...prev.sizes, newSize.trim()]
            }));
            setNewSize('');
        }
    };

    const removeSize = (sizeToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter(size => size !== sizeToRemove)
        }));
    };

    const addColor = () => {
        if (!formData.colors.includes(newColor)) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, newColor]
            }));
        }
    };

    const removeColor = (colorToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(color => color !== colorToRemove)
        }));
    };



    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
                <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white">
                            {product ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-200"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre del producto
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="input-primary"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Remera Gato Negro"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Categoría
                                </label>
                                <select
                                    name="category"
                                    required
                                    className="input-primary"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    disabled={categoriesLoading}
                                >
                                    {categoriesLoading ? (
                                        <option value="">Cargando categorías...</option>
                                    ) : (
                                        categories.map((category) => (
                                            <option key={category.id} value={category.slug}>
                                                {category.icon && `${category.icon} `}{category.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Costo del Producto
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        name="cost"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="input-primary pl-8"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Costo interno del producto</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Precio de Venta
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="input-primary pl-8"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Precio que paga el cliente</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                required
                                min="0"
                                className="input-primary"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={3}
                                className="input-primary resize-none"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe el producto..."
                            />
                        </div>

                        {/* Talles */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Talles disponibles
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.sizes.map((size) => (
                                    <span
                                        key={size}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {size}
                                        <button
                                            type="button"
                                            onClick={() => removeSize(size)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nuevo talle"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className="btn-secondary flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Agregar
                                </button>
                            </div>
                        </div>

                        {/* Colores */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Colores disponibles
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.colors.map((color) => (
                                    <span
                                        key={color}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full mr-2 border"
                                            style={{ backgroundColor: color }}
                                        />
                                        {color}
                                        <button
                                            type="button"
                                            onClick={() => removeColor(color)}
                                            className="ml-2 text-gray-600 hover:text-gray-800"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    className="w-12 h-10 border border-gray-300 rounded"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={addColor}
                                    className="btn-secondary flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Agregar
                                </button>
                            </div>
                        </div>

                        {/* Imágenes por Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Imágenes por Color
                            </label>
                            {formData.colors.map((color) => (
                                <div key={color} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center mb-3">
                                        <div
                                            className="w-6 h-6 rounded-full mr-3 border"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="font-medium text-gray-700">
                                            Imágenes para {color}
                                        </span>
                                    </div>

                                    {/* Debug info */}
                                    <div className="text-xs text-gray-400 mb-2">
                                        Debug - Color: {color} |
                                        imagesByColor exists: {formData.imagesByColor ? 'Yes' : 'No'} |
                                        imagesByColor[color] exists: {formData.imagesByColor?.[color] ? 'Yes' : 'No'} |
                                        imagesByColor[color] length: {formData.imagesByColor?.[color]?.length || 0}
                                    </div>

                                    {/* Imágenes actuales */}
                                    {(() => {
                                        // Intentar usar imagesByColor primero
                                        if (formData.imagesByColor && formData.imagesByColor[color] && formData.imagesByColor[color].length > 0) {
                                            return (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500 mb-2">Imágenes actuales (por color):</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {formData.imagesByColor[color].map((imagePath, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={imagePath.startsWith('http') ? imagePath : `/${imagePath}`}
                                                                    alt={`Imagen ${index + 1}`}
                                                                    className="w-full h-24 object-cover rounded border"
                                                                    onError={(e) => {
                                                                        console.log('Error loading image:', imagePath);
                                                                        e.currentTarget.style.display = 'none';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded border flex items-center justify-center">
                                                                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        Imagen actual
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // Fallback: usar imágenes generales si no hay imagesByColor
                                        if (formData.images && formData.images.length > 0) {
                                            return (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500 mb-2">Imágenes actuales (generales):</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {formData.images.map((imagePath, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={imagePath.startsWith('http') ? imagePath : `/${imagePath}`}
                                                                    alt={`Imagen ${index + 1}`}
                                                                    className="w-full h-24 object-cover rounded border"
                                                                    onError={(e) => {
                                                                        console.log('Error loading image:', imagePath);
                                                                        e.currentTarget.style.display = 'none';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded border flex items-center justify-center">
                                                                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        Imagen actual
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return null;
                                    })()}

                                    {/* Nuevas imágenes subidas */}
                                    {imageFiles[color] && imageFiles[color].length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            {imageFiles[color].map((file, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(color, index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Subir nuevas imágenes */}
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Subir imágenes
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files && handleImageUpload(color, e.target.files)}
                                            />
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {imageFiles[color]?.length || 0} imágenes
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || uploadingImages}
                                className="btn-primary"
                            >
                                {uploadingImages ? 'Subiendo imágenes...' :
                                    isSubmitting ? 'Guardando...' :
                                        (product ? 'Actualizar' : 'Crear')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
