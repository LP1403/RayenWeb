import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import ContactForm from './components/ContactForm';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import DesignWizard from './components/DesignWizard';
import SavedDesigns from './components/SavedDesigns';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { useActiveProducts } from './hooks/useProducts';
import { useAdminAuth } from './hooks/useAdminAuth';
import AdminFloatingButton from './components/AdminFloatingButton';

// Admin imports
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import SetupWizard from './pages/SetupWizard';
import Layout from './components/Layout';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public Routes */}
        <Route path="/*" element={<PublicApp />} />
      </Routes>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </Router>
  );
}

function PublicApp() {
  const { isAdminLoggedIn } = useAdminAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/design" element={<DesignWizard />} />
        <Route path="/saved-designs" element={<SavedDesignsView />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
      {isAdminLoggedIn && <AdminFloatingButton />}
    </>
  );
}

function AdminApp() {
  const { user, loading, isAuthenticated } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated && user ? <Navigate to="/admin/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated && user ? (
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                {/* Cualquier ruta no válida redirige al dashboard */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
    </Routes>
  );
}

function HomeView() {
  const navigate = useNavigate();
  const { products, loading } = useActiveProducts();
  const featuredProducts = products.filter(p => p.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Hero onNavigate={() => navigate('/catalog')} />
      <Carousel products={featuredProducts} onProductClick={p => navigate(`/product/${p.id}`)} />
    </>
  );
}

function CatalogView() {
  const navigate = useNavigate();
  const { products, loading } = useActiveProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ProductCatalog products={products} onProductClick={p => navigate(`/product/${p.id}`)} />
  );
}

function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useActiveProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const product = products.find(p => p.id === id);
  if (!product) return <div className="p-8">Producto no encontrado</div>;
  return <ProductDetail product={product} onBack={() => navigate('/catalog')} />;
}

function SavedDesignsView() {
  const navigate = useNavigate();

  const handleLoadDesign = (design: unknown) => {
    // Navegar al diseñador con los datos del diseño
    navigate('/design', { state: { loadDesign: design } });
  };

  return <SavedDesigns onLoadDesign={handleLoadDesign} />;
}

export default App;