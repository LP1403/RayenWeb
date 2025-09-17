import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import ContactForm from './components/ContactForm';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import { products } from './data/products';
import { Product } from './types/Product';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    setSelectedProduct(null);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
  };

  const featuredProducts = products.filter(p => p.featured);

  if (selectedProduct) {
    return (
      <>
        <Header onNavigate={handleNavigate} currentSection={currentSection} />
        <ProductDetail product={selectedProduct} onBack={handleBackToCatalog} />
      </>
    );
  }

  return (
    <>
      <Header onNavigate={handleNavigate} currentSection={currentSection} />
      
      {currentSection === 'home' && (
        <>
          <Hero onNavigate={handleNavigate} />
          <Carousel products={featuredProducts} onProductClick={handleProductClick} />
        </>
      )}
      
      {currentSection === 'catalog' && (
        <ProductCatalog 
          products={products} 
          onProductClick={handleProductClick}
        />
      )}
      
      {currentSection === 'contact' && (
        <ContactForm onNavigate={handleNavigate} />
      )}
    </>
  );
}

export default App;