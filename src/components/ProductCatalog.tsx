import React, { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductCatalogProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onProductClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      'all': 'Todos',
      'remera': 'Remeras',
      'buzo': 'Buzos',
      'pantalon': 'Pantalones',
      'short': 'Shorts',
      'campera': 'Camperas'
    };
    return names[category] || category;
  };

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-light tracking-[0.2em] text-gray-500 mb-4 block">COLECCIÓN</span>
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Todos los Productos
          </h2>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 space-y-6 sm:space-y-0">
          <div className="flex items-center">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-sm font-light tracking-wide transition-colors ${
                    selectedCategory === category
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${
                viewMode === 'grid' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${
                viewMode === 'list' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className={`group cursor-pointer bg-white overflow-hidden transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[3/4]'
              }`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
                         style={{ backgroundColor: color.toLowerCase() === 'negro' ? '#000' : 
                                                  color.toLowerCase() === 'blanco' ? '#fff' : 
                                                  color.toLowerCase() === 'gris' ? '#6b7280' : '#d1d5db' }}>
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
                
                {viewMode === 'list' && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                )}
                
                <button className="text-sm text-black hover:text-gray-600 transition-colors font-light tracking-wide">
                  VER DETALLES
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 font-light">
              No hay productos disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;