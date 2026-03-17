export interface GlobalConfig {
  dtfCost: number; // Costo de DTF por unidad
  shippingCost: number; // Costo de envío estimado
  updatedAt: Date;
}

export interface UpdateConfigData {
  dtfCost?: number;
  shippingCost?: number;
}

