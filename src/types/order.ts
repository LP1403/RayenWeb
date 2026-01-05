export type OrderStatus = 
  | 'pending' // Pedido recibido, esperando datos del cliente
  | 'processing' // Cliente proporcionó datos, en proceso
  | 'completed' // Pedido completado
  | 'cancelled'; // Pedido cancelado

export interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productNumber?: number; // Número identificador del producto
  productName: string;
  productImage: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitCost: number; // Costo unitario del producto
  unitPrice: number; // Precio de venta unitario
  totalPrice: number; // Precio total de venta
}

export interface OrderCosts {
  productCost: number; // Costo del producto
  dtfCost: number; // Costo de DTF
  laborCost: number; // Mano de obra (antes handlingCost/gestión)
  shippingCost: number; // Costo de envío
  totalCost: number; // Costo total
  sellingPrice: number; // Precio de venta
  profit: number; // Ganancia
}

export interface Order {
  id: string;
  orderNumber: number; // Número identificador único del pedido
  items: OrderItem[];
  customerInfo: CustomerInfo;
  status: OrderStatus;
  costs: OrderCosts;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface CreateOrderData {
  items: Omit<OrderItem, 'totalPrice'>[];
  customerInfo?: CustomerInfo;
  notes?: string;
}

export interface UpdateOrderData {
  customerInfo?: CustomerInfo;
  status?: OrderStatus;
  costs?: Partial<OrderCosts>;
  notes?: string;
}

