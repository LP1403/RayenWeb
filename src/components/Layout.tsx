import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tag,
    LogOut,
    Menu,
    X,
    ExternalLink,
    ShoppingBag,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActiveOrders } from '../hooks/useActiveOrders';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { activeOrdersCount } = useActiveOrders();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Productos', href: '/admin/products', icon: Package },
        { name: 'Categorías', href: '/admin/categories', icon: Tag },
        { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Configuración', href: '/admin/setup', icon: Settings },
    ];

    const handleGoToWeb = () => {
        window.open('/', '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-800 border-r border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            <img
                                src="/logoRayenBlanco.png"
                                alt="Rayen Logo"
                                className="h-6 w-6 object-contain mr-3"
                            />
                            <h1 className="text-xl font-bold text-white">Rayen Admin</h1>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-gray-200"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-6">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-200 ${isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-700 p-4 space-y-2">
                        <button
                            onClick={handleGoToWeb}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                        >
                            <ExternalLink className="mr-3 h-5 w-5" />
                            Ir a la Web
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-gray-800 border-r border-gray-700 shadow-sm">
                    <div className="flex h-16 items-center px-6 bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-lg p-2 mr-3">
                                <img
                                    src="/logoRayenBlanco.png"
                                    alt="Rayen Logo"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                            <h1 className="text-xl font-bold text-white">Rayen Admin</h1>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-6">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            const showBadge = item.name === 'Pedidos' && activeOrdersCount > 0;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-200 ${isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </div>
                                    {showBadge && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                            {activeOrdersCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-700 p-4 space-y-2">
                        <button
                            onClick={handleGoToWeb}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                        >
                            <ExternalLink className="mr-3 h-5 w-5" />
                            Ir a la Web
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-300 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <div className="text-sm text-gray-500">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
