import { useProducts } from '../hooks/useProducts';
import { useActiveCategories } from '../hooks/useCategories';

const Dashboard = () => {
    const { products, loading } = useProducts();
    const { categories } = useActiveCategories();

    // Debug: Log products
    console.log('Dashboard - products:', products);
    console.log('Dashboard - loading:', loading);


    const stats = [
        {
            name: 'Total Productos',
            value: products.length.toString(),
            change: '+2',
            changeType: 'positive',
        },
        {
            name: 'Productos Activos',
            value: products.filter(p => p.isActive).length.toString(),
            change: '+1',
            changeType: 'positive',
        },
        {
            name: 'Productos Inactivos',
            value: products.filter(p => !p.isActive).length.toString(),
            change: '0',
            changeType: 'neutral',
        },
        {
            name: 'Stock Total',
            value: products.reduce((sum, p) => sum + p.stock, 0).toString(),
            change: '+5',
            changeType: 'positive',
        },
    ];

    const recentProducts = products.slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-gray-900 min-h-screen p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="mt-2 text-blue-100">
                            Bienvenido al panel de administración de Rayen
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-sm text-blue-100">Total de productos</div>
                            <div className="text-2xl font-bold">{products.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="bg-blue-100 rounded-lg p-3">
                                    <img
                                        src="/logoRayenNegro.png"
                                        alt="Rayen Logo"
                                        className="h-6 w-6 object-contain"
                                    />
                                </div>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-400 truncate">
                                        {stat.name}
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-bold text-white">
                                            {stat.value}
                                        </div>
                                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' :
                                            stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {stat.change}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Products */}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Productos Recientes</h2>
                    </div>
                </div>

                <div className="p-6">
                    {recentProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                <img
                                    src="/logoRayenNegro.png"
                                    alt="Rayen Logo"
                                    className="h-8 w-8 object-contain"
                                />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                            <p className="text-gray-500 mb-4">
                                Comienza agregando tu primer producto para gestionar tu catálogo.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoría</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {recentProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {(() => {
                                                    const category = categories.find(cat => cat.slug === product.category);
                                                    
                                                    return (
                                                        <span 
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                                            style={category && category.color ? {
                                                                backgroundColor: `${category.color}20`,
                                                                color: category.color,
                                                                borderColor: category.color
                                                            } : undefined}
                                                        >
                                                            {category && category.icon && `${category.icon} `}
                                                            {category ? category.name : product.category}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white">
                                                    ${product.price.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white">
                                                    {product.stock}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="bg-blue-100 rounded-lg p-3">
                                <img
                                    src="/logoRayenNegro.png"
                                    alt="Rayen Logo"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Gestión de Productos</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra tu catálogo de productos
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="bg-green-100 rounded-lg p-3">
                                <img
                                    src="/logoRayenNegro.png"
                                    alt="Rayen Logo"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Revisa las métricas de tu tienda
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="bg-blue-100 rounded-lg p-3">
                                <img
                                    src="/logoRayenNegro.png"
                                    alt="Rayen Logo"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Usuarios</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestiona usuarios y permisos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
