import { useState, useEffect } from 'react';
import { OrderService } from '../services/orderService';
import { Order } from '../types/order';

export const useActiveOrders = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a pedidos activos en tiempo real
    const unsubscribe = OrderService.subscribeToActiveOrders((orders) => {
      setActiveOrders(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    activeOrders,
    activeOrdersCount: activeOrders.length,
    loading
  };
};

