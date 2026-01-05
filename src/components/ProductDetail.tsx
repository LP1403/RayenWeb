import React, { useState } from 'react';
import { ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../types/Product';
import { getAvailableSizes, isSizeAvailable } from '../config/sizes';
import { useImageUrl } from '../hooks/useImageUrl';
import OrderModal from './OrderModal';
import { OrderService } from '../services/orderService';
import { CustomerInfo } from '../types/order';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppOrder = () => {
    const message = `Hola, quiero este producto: ${product.name}${selectedSize ? ` - Talle: ${selectedSize}` : ''
      }${selectedColor ? ` - Color: ${selectedColor}` : ''}`;

    const whatsappUrl = `https://wa.me/5491123910260?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOrderClick = () => {
    if (!selectedSize) {
      alert('Por favor selecciona un talle');
      return;
    }
    if (!selectedColor) {
      alert('Por favor selecciona un color');
      return;
    }
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (customerInfo: CustomerInfo) => {
    try {
      setIsSubmitting(true);

      // Crear el pedido
      const orderId = await OrderService.createOrder({
        items: [{
          productId: product.id,
          productNumber: product.productNumber,
          productName: product.name,
          productImage: product.images[0],
          selectedSize,
          selectedColor,
          quantity: 1,
          unitCost: product.cost || 0, // Costo del producto
          unitPrice: product.price // Precio de venta
        }],
        customerInfo,
        notes: ''
      });

      console.log('Pedido creado exitosamente:', orderId);
      
      // Cerrar el modal
      setIsOrderModalOpen(false);
      
      // Mostrar mensaje de éxito
      alert('¡Pedido registrado exitosamente! Nos pondremos en contacto contigo pronto.');
      
      // También enviar por WhatsApp como backup
      handleWhatsAppOrder();

    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Hubo un error al registrar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determinar imágenes a mostrar según el color seleccionado
  const imagesToShow = product.imagesByColor && selectedColor && product.imagesByColor[selectedColor]
    ? product.imagesByColor[selectedColor]
    : product.images;

  // Hook para obtener la URL de la imagen principal
  const mainImageUrl = useImageUrl(imagesToShow[selectedImage]);

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
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Cargando imagen...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {imagesToShow.map((image, index) => (
                <ProductImageThumbnail
                  key={index}
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                  isSelected={selectedImage === index}
                  onClick={() => {
                    if (selectedImage !== index) {
                      setImageLoading(true);
                      setTimeout(() => {
                        setSelectedImage(index);
                      }, 250); // 250ms de skeleton antes de mostrar la imagen
                    }
                  }}
                />
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
                {getAvailableSizes().map((sizeConfig) => {
                  const isAvailable = isSizeAvailable(sizeConfig.name);
                  const isSelected = selectedSize === sizeConfig.name;
                  const isDisabled = !isAvailable;

                  // Verificar si hay información específica de stock para este producto
                  const productSizeInfo = product.sizeInfo?.[sizeConfig.name];
                  const hasStock = productSizeInfo?.available ?? isAvailable;
                  const stockCount = productSizeInfo?.stock;

                  return (
                    <button
                      key={sizeConfig.id}
                      onClick={() => hasStock && setSelectedSize(sizeConfig.name)}
                      disabled={!hasStock}
                      className={`px-4 py-3 border font-light transition-colors ${isSelected
                        ? 'border-black bg-black text-white'
                        : !hasStock
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:border-black'
                        }`}
                    >
                      {sizeConfig.name}
                      {stockCount !== undefined && hasStock && (
                        <span className="text-xs text-gray-500 ml-1">({stockCount})</span>
                      )}
                      {!hasStock && (
                        <span className="text-xs text-gray-400 ml-1">
                          {productSizeInfo ? '(Agotado)' : '(Próximamente)'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <p className="text-xs text-gray-500 mt-2">
                  Talle seleccionado: {selectedSize}
                  {product.sizeInfo?.[selectedSize]?.stock !== undefined && (
                    <span className="ml-2">
                      (Stock: {product.sizeInfo[selectedSize].stock} unidades)
                    </span>
                  )}
                </p>
              )}
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
              onClick={handleOrderClick}
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'PROCESANDO...' : 'LO QUIERO'}</span>
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

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
        productName={product.name}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        price={product.price}
      />
    </div>
  );
};

// Componente para las miniaturas de imágenes
interface ProductImageThumbnailProps {
  image: string;
  alt: string;
  isSelected: boolean;
  onClick: () => void;
}

const ProductImageThumbnail: React.FC<ProductImageThumbnailProps> = ({
  image,
  alt,
  isSelected,
  onClick
}) => {
  const imageUrl = useImageUrl(image);

  return (
    <button
      onClick={onClick}
      className={`aspect-square overflow-hidden border transition-colors ${isSelected ? 'border-black border-2' : 'border-gray-200 hover:border-gray-300'
        }`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Cargando...</span>
        </div>
      )}
    </button>
  );
};

export default ProductDetail;