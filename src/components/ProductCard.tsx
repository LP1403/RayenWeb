import React from 'react';
import { Product } from '../types/Product';
import { useImageUrl } from '../hooks/useImageUrl';

interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
    onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, onClick }) => {
    const imageUrl = useImageUrl(product.images[product.catalogImageIndex ?? 0]);

    return (
        <div
            onClick={() => onClick(product)}
            className={`group cursor-pointer bg-white overflow-hidden transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                }`}
        >
            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[3/4]'
                }`}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Cargando imagen...</span>
                    </div>
                )}
            </div>

            <div className={`py-6 ${viewMode === 'list' ? 'flex-1 px-6' : 'text-center'}`}>
                <h3 className="text-lg font-light text-black mb-2 group-hover:text-gray-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-lg font-light text-black mb-4">
                    ${product.price.toLocaleString()}
                </p>

                <div className={`flex ${viewMode === 'list' ? 'justify-start' : 'justify-center'} items-center space-x-2 mb-4`}>
                    {product.colors.slice(0, 3).map((color, index) => (
                        <div key={index} className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                                backgroundColor: color.toLowerCase() === 'negro' ? '#000' :
                                    color.toLowerCase() === 'blanco' ? '#fff' :
                                        color.toLowerCase() === 'gris' ? '#6b7280' : '#d1d5db'
                            }}>
                        </div>
                    ))}
                    {product.colors.length > 3 && (
                        <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                    )}
                </div>

                <div className={`flex ${viewMode === 'list' ? 'justify-start' : 'justify-center'} items-center space-x-1 mb-4`}>
                    {product.sizes.slice(0, 4).map((size, index) => (
                        <span key={index} className="text-xs text-gray-500 border border-gray-200 px-2 py-1">
                            {size}
                        </span>
                    ))}
                    {product.sizes.length > 4 && (
                        <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
                    )}
                </div>

                <div className={`flex ${viewMode === 'list' ? 'justify-start' : 'justify-center'} items-center space-x-2`}>
                    <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                    </span>
                    {product.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Destacado
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
