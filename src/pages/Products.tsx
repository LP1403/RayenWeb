import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useActiveCategories } from '../hooks/useCategories';
import ProductForm from '../components/ProductForm';
import { Product, CreateProductData } from '../types/Product';
import { useImageUrl } from '../hooks/useImageUrl';

const Products = () => {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
    const { categories } = useActiveCategories();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Debug: Log products
    console.log('Products component - products:', products);
    console.log('Products component - loading:', loading);
    console.log('Products component - error:', error);


    // Filtrar productos
    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const handleCreateProduct = async (productData: CreateProductData) => {
        try {
            await createProduct({
                ...productData,
                isActive: true
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleUpdateProduct = async (id: string, productData: CreateProductData) => {
        try {
            await updateProduct(id, productData);
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await deleteProduct(id);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await updateProduct(id, { isActive: !isActive });
        } catch (error) {
            console.error('Error toggling product status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Productos</h1>
                    <p className="mt-1 text-sm text-gray-300">
                        Gestiona tu catálogo de productos
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="input-primary pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                            <img
                                src="/logoRayenNegro.png"
                                alt="Rayen Logo"
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                        <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Costo / Precio
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center">
                                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-bold text-sm">
                                                    #{product.productNumber || '---'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <ProductImage
                                                    product={product}
                                                    className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-semibold text-gray-900 truncate">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {product.description.substring(0, 60)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const category = categories.find(cat => cat.slug === product.category);
                                                
                                                return (
                                                    <span 
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize"
                                                        style={category && category.color ? {
                                                            backgroundColor: `${category.color}20`,
                                                            color: category.color,
                                                            borderColor: category.color
                                                        } : undefined}
                                                    >
                                                        {category && category.icon && `${category.icon} `}
                                                        {category ? category.name : product.category}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-medium">Costo:</span> ${(product.cost || 0).toLocaleString()}
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    <span className="font-medium text-gray-500">Precio:</span> ${product.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {product.stock} unidades
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar producto"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(product.id, product.isActive)}
                                                    className={`p-2 rounded-lg transition-colors ${product.isActive
                                                        ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                                        }`}
                                                    title={product.isActive ? 'Desactivar producto' : 'Activar producto'}
                                                >
                                                    {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <ProductForm
                    onSubmit={handleCreateProduct}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Edit Product Form Modal */}
            {editingProduct && (
                <ProductForm
                    product={editingProduct}
                    onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    );
};

// Componente para mostrar la imagen del producto
interface ProductImageProps {
    product: Product;
    className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, className }) => {
    const imageUrl = useImageUrl(product.images[0]);

    if (!product.images || product.images.length === 0) {
        return (
            <div className={`${className} bg-gray-200 flex items-center justify-center`}>
                <span className="text-gray-400 text-xs">Sin imagen</span>
            </div>
        );
    }

    return (
        <>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={product.name}
                    className={className}
                />
            ) : (
                <div className={`${className} bg-gray-200 flex items-center justify-center`}>
                    <span className="text-gray-400 text-xs">Cargando...</span>
                </div>
            )}
        </>
    );
};

export default Products;
