import React, { useState } from 'react';
import { ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');

  const handleWhatsAppOrder = () => {
    const message = `Hola, quiero este producto: ${product.name}${selectedSize ? ` - Talle: ${selectedSize}` : ''
      }${selectedColor ? ` - Color: ${selectedColor}` : ''}`;

    const whatsappUrl = `https://wa.me/5491123910260?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Determinar imágenes a mostrar según el color seleccionado
  const imagesToShow = product.imagesByColor && selectedColor && product.imagesByColor[selectedColor]
    ? product.imagesByColor[selectedColor]
    : product.images;

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-black transition-colors mb-12 group font-light"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>VOLVER</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                  <div className="w-full h-full bg-gray-300 rounded" />
                </div>
              )}
              <img
                src={imagesToShow[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {imagesToShow.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (selectedImage !== index) {
                      setImageLoading(true);
                      setTimeout(() => {
                        setSelectedImage(index);
                      }, 250); // 250ms de skeleton antes de mostrar la imagen
                    }
                  }}
                  className={`aspect-square overflow-hidden border transition-colors ${selectedImage === index ? 'border-black border-2' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-black mb-6">
                {product.name}
              </h1>

              <p className="text-3xl font-light text-black mb-8">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed font-light">
                {product.description}
              </p>

              {product.material && (
                <div>
                  <span className="font-light text-black">Material: </span>
                  <span className="text-gray-600 font-light">{product.material}</span>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-light tracking-wide text-black mb-4 uppercase">Talle</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-3 border font-light transition-colors ${selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 text-gray-600 hover:border-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-light tracking-wide text-black mb-4 uppercase">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-3 border font-light transition-colors ${selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 text-gray-600 hover:border-black'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-black text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors"
            >
              <span>LO QUIERO</span>
            </button>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-gray-400" />
                <div>
                  <div className="font-light text-black text-sm">Envío gratis</div>
                  <div className="text-xs text-gray-500">En CABA y GBA</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-gray-400" />
                <div>
                  <div className="font-light text-black text-sm">Garantía</div>
                  <div className="text-xs text-gray-500">30 días</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-gray-400" />
                <div>
                  <div className="font-light text-black text-sm">Cambios</div>
                  <div className="text-xs text-gray-500">Sin costo</div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            {product.care && (
              <div className="bg-gray-50 p-6">
                <h4 className="font-light text-black mb-3 text-sm tracking-wide uppercase">Cuidados</h4>
                <p className="text-sm text-gray-600 font-light">{product.care}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;