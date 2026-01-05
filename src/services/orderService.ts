import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, CreateOrderData, UpdateOrderData, OrderStatus, OrderCosts } from '../types/order';
import { ConfigService } from './configService';

const ORDERS_COLLECTION = 'orders';
const COUNTERS_COLLECTION = 'counters';

export class OrderService {
  // Obtener el siguiente número de pedido
  private static async getNextOrderNumber(): Promise<number> {
    const counterRef = doc(db, COUNTERS_COLLECTION, 'orderCounter');
    const counterSnap = await getDoc(counterRef);

    if (!counterSnap.exists()) {
      // Crear el contador si no existe
      await updateDoc(counterRef, { count: 1 });
      return 1;
    }

    const currentCount = counterSnap.data().count || 0;
    const nextNumber = currentCount + 1;
    await updateDoc(counterRef, { count: nextNumber });
    return nextNumber;
  }

  // Calcular costos del pedido
  private static calculateOrderCosts(
    productCost: number,
    sellingPrice: number,
    dtfCost: number = 0,
    laborCost: number = 0,
    shippingCost: number = 0
  ): OrderCosts {
    const totalCost = productCost + dtfCost + laborCost + shippingCost;
    const profit = sellingPrice - totalCost;

    return {
      productCost,
      dtfCost,
      laborCost,
      shippingCost,
      totalCost,
      sellingPrice,
      profit
    };
  }

  // Crear nuevo pedido
  static async createOrder(orderData: CreateOrderData): Promise<string> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const now = new Date();
      const orderNumber = await this.getNextOrderNumber();

      // Obtener el costo de DTF de la configuración global
      const dtfCost = await ConfigService.getDtfCost();

      // Calcular totalPrice para cada item (precio de venta * cantidad)
      const itemsWithTotal = orderData.items.map(item => ({
        ...item,
        totalPrice: item.unitPrice * item.quantity // Precio de venta total
      }));

      // Calcular el costo total del producto (usando unitCost)
      const productCost = itemsWithTotal.reduce((sum, item) => {
        return sum + (item.unitCost * item.quantity);
      }, 0);

      // Calcular el precio de venta total
      const sellingPrice = itemsWithTotal.reduce((sum, item) => {
        return sum + item.totalPrice;
      }, 0);

      // Calcular costos iniciales (sin mano de obra ni envío aún)
      const costs = this.calculateOrderCosts(
        productCost,
        sellingPrice,
        dtfCost,
        0, // laborCost inicial
        0  // shippingCost inicial
      );

      const docRef = await addDoc(ordersRef, {
        orderNumber,
        items: itemsWithTotal,
        customerInfo: orderData.customerInfo || {},
        status: 'pending' as OrderStatus,
        costs,
        createdAt: now,
        updatedAt: now,
        notes: orderData.notes || ''
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Obtener todos los pedidos
  static async getAllOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  // Obtener pedido por ID
  static async getOrderById(id: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, id);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const data = orderSnap.data();
        return {
          id: orderSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  // Actualizar pedido
  static async updateOrder(id: string, orderData: UpdateOrderData): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, id);
      const updateData: any = {
        ...orderData,
        updatedAt: new Date(),
      };

      // Si el estado cambió a completed, agregar fecha de completado
      if (orderData.status === 'completed') {
        updateData.completedAt = new Date();
      }

      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Actualizar costos del pedido
  static async updateOrderCosts(
    id: string,
    laborCost: number,
    shippingCost: number,
    productCost?: number,
    dtfCost?: number
  ): Promise<void> {
    try {
      const order = await this.getOrderById(id);
      if (!order) throw new Error('Order not found');

      // Usar los costos proporcionados o los del pedido
      const finalProductCost = productCost !== undefined ? productCost : (order.costs.productCost || 0);
      const finalDtfCost = dtfCost !== undefined ? dtfCost : (order.costs.dtfCost || 0);

      const costs = this.calculateOrderCosts(
        finalProductCost,
        order.costs.sellingPrice,
        finalDtfCost,
        laborCost,
        shippingCost
      );

      await this.updateOrder(id, { costs });
    } catch (error) {
      console.error('Error updating order costs:', error);
      throw error;
    }
  }

  // Eliminar pedido
  static async deleteOrder(id: string): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, id);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Obtener pedidos por estado
  static async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const q = query(
        ordersRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw error;
    }
  }

  // Obtener pedidos pendientes y en proceso
  static async getActiveOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const q = query(
        ordersRef,
        where('status', 'in', ['pending', 'processing']),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error getting active orders:', error);
      throw error;
    }
  }

  // Suscribirse a cambios en tiempo real
  static subscribeToOrders(callback: (orders: Order[]) => void) {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];

      callback(orders);
    });
  }

  // Suscribirse a pedidos activos
  static subscribeToActiveOrders(callback: (orders: Order[]) => void) {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where('status', 'in', ['pending', 'processing']),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];

      callback(orders);
    });
  }

  // Obtener estadísticas de pedidos
  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    totalProfit: number;
  }> {
    try {
      const orders = await this.getAllOrders();

      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.costs.sellingPrice, 0),
        totalProfit: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.costs.profit, 0),
      };

      return stats;
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw error;
    }
  }
}

