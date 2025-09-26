import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import ContactForm from './components/ContactForm';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import DesignWizard from './components/DesignWizard';
import { products } from './data/products';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/design" element={<DesignWizard />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
    </Router>
  );
}

function HomeView() {
  const navigate = useNavigate();
  const featuredProducts = products.filter(p => p.featured);
  return (
    <>
      <Hero onNavigate={() => navigate('/catalog')} />
      <Carousel products={featuredProducts} onProductClick={p => navigate(`/product/${p.id}`)} />
    </>
  );
}

function CatalogView() {
  const navigate = useNavigate();
  return (
    <ProductCatalog products={products} onProductClick={p => navigate(`/product/${p.id}`)} />
  );
}

function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  if (!product) return <div className="p-8">Producto no encontrado</div>;
  return <ProductDetail product={product} onBack={() => navigate('/catalog')} />;
}

export default App;