import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types/Product';

interface CarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const Carousel: React.FC<CarouselProps> = ({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
  };

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-light tracking-[0.2em] text-gray-500 mb-4 block">DESTACADOS</span>
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Nuevos Arrivals
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Descubre las últimas piezas de nuestra colección cuidadosamente seleccionadas
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className="relative group cursor-pointer" onClick={() => onProductClick(product)}>
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                      <img
                        src={product.carouselImages && product.carouselImages.length > 0 ? product.carouselImages[0] : product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>

                    <div className="pt-6 text-center">
                      <h3 className="text-xl font-light text-black mb-2">{product.name}</h3>
                      <p className="text-lg text-gray-900 font-light">${product.price.toLocaleString()}</p>
                      <div className="flex justify-center items-center space-x-2 mt-3">
                        {product.colors.slice(0, 3).map((color, index) => (
                          <div key={index} className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: color.toLowerCase() === 'negro' ? '#000' :
                                color.toLowerCase() === 'blanco' ? '#fff' :
                                  color.toLowerCase() === 'gris' ? '#6b7280' : '#d1d5db'
                            }}>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/3 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 shadow-lg transition-all duration-300 group"
          >
            <ChevronLeft className="h-5 w-5 text-black" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/3 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 shadow-lg transition-all duration-300 group"
          >
            <ChevronRight className="h-5 w-5 text-black" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-px transition-all duration-300 ${index === currentIndex ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400 w-4'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;