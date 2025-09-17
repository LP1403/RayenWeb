import React from 'react';
import { ShoppingBag, Menu, Search, User, Heart } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-light tracking-wide text-black">RAYENCO</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-12">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-light tracking-wide transition-colors hover:text-black ${
                currentSection === 'home' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`text-sm font-light tracking-wide transition-colors hover:text-black ${
                currentSection === 'catalog' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500'
              }`}
            >
              SHOP
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`text-sm font-light tracking-wide transition-colors hover:text-black ${
                currentSection === 'contact' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500'
              }`}
            >
              CONTACT
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden md:block p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="hidden md:block p-2 hover:bg-gray-50 rounded-full transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </button>
            <button className="hidden md:block p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="lg:hidden p-2">
              <Menu className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;