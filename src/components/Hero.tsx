import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/portadas web-15.jpg"
          alt="Fashion Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mb-6">
          <span className="text-sm font-light tracking-[0.2em] text-white/80">NUEVA COLECCIÓN</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8">
          URBAN
          <span className="block font-extralight">ESSENTIALS</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Descubre piezas únicas que definen tu estilo personal.
          Calidad excepcional en cada detalle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
          <button
            onClick={() => onNavigate('catalog')}
            className="group bg-white text-black px-12 py-4 font-light tracking-wide text-sm hover:bg-gray-100 transition-all duration-300 flex items-center space-x-3"
          >
            <span>EXPLORAR COLECCIÓN</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-16 bg-white/50">
          <div className="w-px h-8 bg-white animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;