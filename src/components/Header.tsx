import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome
      ? 'bg-transparent'
      : 'bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src={isHome ? `${import.meta.env.BASE_URL}logoRayenBlanco.png` : `${import.meta.env.BASE_URL}logoRayenNegro.png`}
              alt="Rayen Logo"
              className="w-16 h-16 object-contain"
            />
            {/*
              <span className="text-2xl font-light tracking-wide text-black">RAYEN</span>
            */}
          </div>

          <nav className="hidden lg:flex items-center space-x-12">
            <button
              onClick={() => navigate('/')}
              className={`text-sm font-light tracking-wide transition-colors ${isHome
                ? 'text-white border-b-2 border-white pb-1'
                : 'text-black border-b-2 border-black pb-1'
                }`}
            >
              HOME
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className={`text-sm font-light tracking-wide transition-colors ${location.pathname === '/catalog'
                ? isHome
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-black border-b-2 border-black pb-1'
                : isHome
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-500 hover:text-black'
                }`}
            >
              SHOP
            </button>
            <button
              onClick={() => navigate('/design')}
              className={`text-sm font-light tracking-wide transition-colors ${location.pathname === '/design'
                ? isHome
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-black border-b-2 border-black pb-1'
                : isHome
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-500 hover:text-black'
                }`}
            >
              DISEÑA
            </button>
            <button
              onClick={() => navigate('/saved-designs')}
              className={`text-sm font-light tracking-wide transition-colors ${location.pathname === '/saved-designs'
                ? isHome
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-black border-b-2 border-black pb-1'
                : isHome
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-500 hover:text-black'
                }`}
            >
              MIS DISEÑOS
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={`text-sm font-light tracking-wide transition-colors ${location.pathname === '/contact'
                ? isHome
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-black border-b-2 border-black pb-1'
                : isHome
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-500 hover:text-black'
                }`}
            >
              CONTACTO
            </button>
          </nav>

          <div className="flex items-center">
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${isHome ? 'text-white' : 'text-black'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isHome ? 'text-white' : 'text-black'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className={`fixed top-20 left-0 right-0 z-50 ${isHome ? 'bg-white/95 backdrop-blur-md' : 'bg-white'} border-b border-gray-200 shadow-lg`}>
            <nav className="px-4 py-6 space-y-4">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-light tracking-wide transition-colors py-2 ${location.pathname === '/'
                    ? isHome
                      ? 'text-black border-b-2 border-black pb-1'
                      : 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                HOME
              </button>
              <button
                onClick={() => {
                  navigate('/catalog');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-light tracking-wide transition-colors py-2 ${location.pathname === '/catalog'
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                SHOP
              </button>
              <button
                onClick={() => {
                  navigate('/design');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-light tracking-wide transition-colors py-2 ${location.pathname === '/design'
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                DISEÑA
              </button>
              <button
                onClick={() => {
                  navigate('/saved-designs');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-light tracking-wide transition-colors py-2 ${location.pathname === '/saved-designs'
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                MIS DISEÑOS
              </button>
              <button
                onClick={() => {
                  navigate('/contact');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-light tracking-wide transition-colors py-2 ${location.pathname === '/contact'
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                CONTACTO
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;