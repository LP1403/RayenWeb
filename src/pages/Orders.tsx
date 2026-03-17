import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { OrderService } from '../services/orderService';
import { ConfigService } from '../services/configService';
import { ProductService } from '../services/productService';
import { Order, OrderStatus, CustomerInfo } from '../types/order';
import { useToastContext } from '../context/ToastContext';

const Orders: React.FC = () => {
  const toast = useToastContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditCostsModal, setShowEditCostsModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editingCosts, setEditingCosts] = useState({ shipping: 0, labor: 0 });
  const [editingCustomerInfo, setEditingCustomerInfo] = useState<CustomerInfo>({});

  useEffect(() => {
    // Suscribirse a cambios en tiempo real
    const unsubscribe = OrderService.subscribeToOrders((ordersData) => {
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await OrderService.updateOrder(orderId, { status: newStatus });
      toast.success('Estado actualizado', 'El estado del pedido se actualizó correctamente');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error', 'No se pudo actualizar el estado del pedido');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) return;
    
    try {
      await OrderService.deleteOrder(orderId);
      toast.success('Pedido eliminado', 'El pedido se eliminó correctamente');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error', 'No se pudo eliminar el pedido');
    }
  };

  const handleUpdateCosts = async (productCost: number, dtfCost: number) => {
    if (!selectedOrder) return;

    try {
      await OrderService.updateOrderCosts(
        selectedOrder.id,
        editingCosts.labor,
        editingCosts.shipping,
        productCost,
        dtfCost
      );
      setShowEditCostsModal(false);
      setSelectedOrder(null);
      toast.success('Costos actualizados', 'Los costos del pedido se actualizaron correctamente');
    } catch (error) {
      console.error('Error updating costs:', error);
      toast.error('Error', 'No se pudieron actualizar los costos');
    }
  };

  const openEditCostsModal = (order: Order) => {
    setSelectedOrder(order);
    setEditingCosts({
      shipping: order.costs.shippingCost,
      labor: order.costs.laborCost
    });
    setShowEditCostsModal(true);
  };

  const openEditCustomerModal = (order: Order) => {
    setSelectedOrder(order);
    setEditingCustomerInfo(order.customerInfo || {});
    setShowEditCustomerModal(true);
  };

  const handleUpdateCustomerInfo = async () => {
    if (!selectedOrder) return;

    try {
      await OrderService.updateOrder(selectedOrder.id, {
        customerInfo: editingCustomerInfo
      });
      setShowEditCustomerModal(false);
      setSelectedOrder(null);
      toast.success('Información actualizada', 'Los datos del cliente se actualizaron correctamente');
    } catch (error) {
      console.error('Error updating customer info:', error);
      toast.error('Error', 'No se pudo actualizar la información del cliente');
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'En Proceso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const activeOrdersCount = orders.filter(o => 
    o.status === 'pending' || o.status === 'processing'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-gray-400 mt-1">
            Gestiona los pedidos de los clientes
          </p>
        </div>
        {activeOrdersCount > 0 && (
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{activeOrdersCount} pedidos activos</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pedidos"
          value={orders.length}
          icon={<Package className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pendientes"
          value={orders.filter(o => o.status === 'pending').length}
          icon={<Clock className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <StatsCard
          title="En Proceso"
          value={orders.filter(o => o.status === 'processing').length}
          icon={<Package className="w-6 h-6" />}
          color="bg-blue-600"
        />
        <StatsCard
          title="Completados"
          value={orders.filter(o => o.status === 'completed').length}
          icon={<CheckCircle className="w-6 h-6" />}
          color="bg-green-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
            label="Todos"
            count={orders.length}
          />
          <FilterButton
            active={filterStatus === 'pending'}
            onClick={() => setFilterStatus('pending')}
            label="Pendientes"
            count={orders.filter(o => o.status === 'pending').length}
          />
          <FilterButton
            active={filterStatus === 'processing'}
            onClick={() => setFilterStatus('processing')}
            label="En Proceso"
            count={orders.filter(o => o.status === 'processing').length}
          />
          <FilterButton
            active={filterStatus === 'completed'}
            onClick={() => setFilterStatus('completed')}
            label="Completados"
            count={orders.filter(o => o.status === 'completed').length}
          />
          <FilterButton
            active={filterStatus === 'cancelled'}
            onClick={() => setFilterStatus('cancelled')}
            label="Cancelados"
            count={orders.filter(o => o.status === 'cancelled').length}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay pedidos con este estado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-white">
                            #{order.orderNumber}
                          </div>
                          {order.items[0].productNumber && (
                            <div className="text-xs text-gray-400">
                              Prod: #{order.items[0].productNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {order.customerInfo.name || 'Sin datos'}
                      </div>
                      {order.customerInfo.phone && (
                        <div className="text-xs text-gray-400">
                          {order.customerInfo.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {order.items[0].productName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.items[0].selectedSize} - {order.items[0].selectedColor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        ${order.costs.sellingPrice.toLocaleString()}
                      </div>
                      {order.costs.profit !== 0 && (
                        <div className={`text-xs ${order.costs.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          Ganancia: ${order.costs.profit.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)} border-none`}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">En Proceso</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {order.createdAt.toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditCostsModal(order)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="Editar costos"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          onEditCustomer={() => {
            setShowDetailsModal(false);
            openEditCustomerModal(selectedOrder);
          }}
        />
      )}

      {/* Edit Costs Modal */}
      {showEditCostsModal && selectedOrder && (
        <EditCostsModal
          order={selectedOrder}
          costs={editingCosts}
          onCostsChange={setEditingCosts}
          onSave={(productCost, dtfCost) => handleUpdateCosts(productCost, dtfCost)}
          onClose={() => {
            setShowEditCostsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Edit Customer Info Modal */}
      {showEditCustomerModal && selectedOrder && (
        <EditCustomerInfoModal
          customerInfo={editingCustomerInfo}
          onCustomerInfoChange={setEditingCustomerInfo}
          onSave={handleUpdateCustomerInfo}
          onClose={() => {
            setShowEditCustomerModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg text-white`}>
        {icon}
      </div>
    </div>
  </div>
);

// Filter Button Component
const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}> = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {label} ({count})
  </button>
);

// Order Details Modal
const OrderDetailsModal: React.FC<{
  order: Order;
  onClose: () => void;
  onEditCustomer: () => void;
}> = ({ order, onClose, onEditCustomer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Detalles del Pedido #{order.orderNumber}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Información del Cliente
            </h3>
            <button
              onClick={onEditCustomer}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            {order.customerInfo.name ? (
              <>
                <InfoRow icon={<User />} label="Nombre" value={order.customerInfo.name} />
                {order.customerInfo.phone && (
                  <InfoRow icon={<Phone />} label="Teléfono" value={order.customerInfo.phone} />
                )}
                {order.customerInfo.email && (
                  <InfoRow icon={<Mail />} label="Email" value={order.customerInfo.email} />
                )}
                {order.customerInfo.address && (
                  <InfoRow icon={<MapPin />} label="Dirección" value={order.customerInfo.address} />
                )}
                {order.customerInfo.city && (
                  <InfoRow label="Ciudad" value={order.customerInfo.city} />
                )}
                {order.customerInfo.postalCode && (
                  <InfoRow label="Código Postal" value={order.customerInfo.postalCode} />
                )}
                {order.customerInfo.notes && (
                  <InfoRow label="Notas" value={order.customerInfo.notes} />
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm">Sin información de contacto</p>
            )}
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Productos
          </h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.productName}</h4>
                  <p className="text-sm text-gray-400">
                    {item.selectedSize} - {item.selectedColor}
                  </p>
                  {item.productNumber && (
                    <p className="text-xs text-gray-500">Prod #: {item.productNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    ${item.unitPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Costs */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Costos
          </h3>
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <CostRow label="Costo del Producto" value={order.costs.productCost} />
            <CostRow label="Costo de DTF" value={order.costs.dtfCost} />
            <CostRow label="Mano de Obra" value={order.costs.laborCost} />
            <CostRow label="Costo de Envío" value={order.costs.shippingCost} />
            <div className="border-t border-gray-600 pt-2 mt-2">
              <CostRow label="Costo Total" value={order.costs.totalCost} bold />
            </div>
            <CostRow label="Precio de Venta" value={order.costs.sellingPrice} bold />
            <CostRow 
              label="Ganancia" 
              value={order.costs.profit} 
              bold 
              color={order.costs.profit > 0 ? 'text-green-400' : 'text-red-400'}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Edit Costs Modal
const EditCostsModal: React.FC<{
  order: Order;
  costs: { shipping: number; labor: number };
  onCostsChange: (costs: { shipping: number; labor: number }) => void;
  onSave: (productCost: number, dtfCost: number) => void;
  onClose: () => void;
}> = ({ order, costs, onCostsChange, onSave, onClose }) => {
  const [currentDtfCost, setCurrentDtfCost] = useState(0);
  const [actualProductCost, setActualProductCost] = useState<number | null>(null);
  const [loadingProductCost, setLoadingProductCost] = useState(true);

  useEffect(() => {
    // Cargar el costo de DTF actual desde la configuración
    const loadDtfCost = async () => {
      try {
        const dtfCost = await ConfigService.getDtfCost();
        setCurrentDtfCost(dtfCost);
      } catch (error) {
        console.error('Error loading DTF cost:', error);
        // Si hay error, usar el del pedido o 0
        setCurrentDtfCost(order.costs.dtfCost || 0);
      }
    };
    
    // Cargar el costo actual del producto
    const loadProductCost = async () => {
      if (order.items && order.items.length > 0) {
        const productId = order.items[0].productId;
        try {
          const product = await ProductService.getProductById(productId);
          if (product && product.cost !== undefined) {
            setActualProductCost(product.cost);
          }
        } catch (error) {
          console.error('Error loading product cost:', error);
        }
      }
      setLoadingProductCost(false);
    };
    
    loadDtfCost();
    loadProductCost();
  }, [order.costs.dtfCost, order.items]);

  // Usar el costo actual del producto si está disponible, sino el del pedido
  const productCost = actualProductCost !== null ? actualProductCost : (order.costs.productCost || 0);
  const dtfCost = currentDtfCost;
  const totalCost = productCost + dtfCost + costs.labor + costs.shipping;
  const profit = order.costs.sellingPrice - totalCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
        <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Editar Costos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!loadingProductCost && actualProductCost !== null && actualProductCost !== order.costs.productCost && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
              <p className="text-xs text-yellow-300">
                <strong>⚠️ Aviso:</strong> El costo del producto se actualizó a ${actualProductCost.toLocaleString()} (antes era ${(order.costs.productCost || 0).toLocaleString()}). Se usará el costo actual para el cálculo.
              </p>
            </div>
          )}
          
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              <strong>ℹ️ Nota:</strong> El Costo de DTF (${dtfCost.toLocaleString()}) se configura globalmente. El costo del producto se toma del valor actual en Productos.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mano de Obra
            </label>
            <input
              type="number"
              value={costs.labor}
              onChange={(e) => onCostsChange({ ...costs, labor: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Costo de Envío
            </label>
            <input
              type="number"
              value={costs.shipping}
              onChange={(e) => onCostsChange({ ...costs, shipping: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <CostRow label="Costo del Producto" value={productCost} />
            <CostRow label="Costo de DTF" value={dtfCost} />
            <CostRow label="Mano de Obra" value={costs.labor} />
            <CostRow label="Costo de Envío" value={costs.shipping} />
            <div className="border-t border-gray-600 pt-2 mt-2">
              <CostRow label="Costo Total" value={totalCost} bold />
            </div>
            <CostRow label="Precio de Venta" value={order.costs.sellingPrice} bold />
            <CostRow 
              label="Ganancia" 
              value={profit} 
              bold 
              color={profit > 0 ? 'text-green-400' : 'text-red-400'}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(productCost, dtfCost)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Customer Info Modal
const EditCustomerInfoModal: React.FC<{
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ customerInfo, onCustomerInfoChange, onSave, onClose }) => {
  const handleChange = (field: keyof CustomerInfo, value: string) => {
    onCustomerInfoChange({ ...customerInfo, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Editar Información del Cliente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nombre Completo
            </label>
            <input
              type="text"
              value={customerInfo.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Teléfono
              </label>
              <input
                type="tel"
                value={customerInfo.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={customerInfo.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Dirección
            </label>
            <input
              type="text"
              value={customerInfo.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Calle y número"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={customerInfo.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ciudad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                value={customerInfo.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notas
            </label>
            <textarea
              value={customerInfo.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas adicionales sobre la entrega o el pedido..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoRow: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-2 text-sm">
    {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-white flex-1">{value}</span>
  </div>
);

const CostRow: React.FC<{
  label: string;
  value: number | undefined;
  bold?: boolean;
  color?: string;
}> = ({ label, value, bold, color }) => (
  <div className="flex justify-between text-sm">
    <span className={`text-gray-300 ${bold ? 'font-semibold' : ''}`}>{label}:</span>
    <span className={`${color || 'text-white'} ${bold ? 'font-semibold' : ''}`}>
      ${(value || 0).toLocaleString()}
    </span>
  </div>
);

export default Orders;

