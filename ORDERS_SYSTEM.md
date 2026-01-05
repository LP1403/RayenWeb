# 📦 Sistema de Gestión de Pedidos - Rayen Web

## 🎯 Descripción

Sistema completo de gestión de pedidos que permite a los clientes realizar pedidos desde la web y al administrador gestionarlos desde el backoffice.

## ✨ Características Implementadas

### Para Clientes:
- ✅ Botón "LO QUIERO" en detalle de productos
- ✅ Modal para confirmar pedido con/sin datos de envío
- ✅ Captura opcional de datos del cliente (nombre, teléfono, dirección, etc.)
- ✅ Registro automático del pedido en Firebase

### Para Administradores:
- ✅ Menú "Pedidos" en el panel de administración
- ✅ Vista completa de todos los pedidos
- ✅ Filtros por estado (Pendiente, En Proceso, Completado, Cancelado)
- ✅ Notificación visual de pedidos activos (badge animado)
- ✅ Gestión de estados de pedidos
- ✅ Vista detallada de cada pedido
- ✅ Edición de costos (envío y gestión)
- ✅ Cálculo automático de ganancias
- ✅ Estadísticas en tiempo real

### Sistema:
- ✅ Números identificadores únicos para productos y pedidos
- ✅ Actualización en tiempo real con Firebase
- ✅ Reglas de seguridad de Firestore y Storage actualizadas
- ✅ Sistema de contadores incrementales

## 🚀 Pasos para Activar el Sistema

### 1. Desplegar las Reglas de Firebase

Primero, despliega las reglas actualizadas de Firestore y Storage:

```bash
npm run deploy:rules
```

O manualmente:

```bash
firebase deploy --only firestore:rules,storage:rules
```

### 2. Agregar Números a Productos Existentes

Ejecuta el script para agregar números identificadores a los productos existentes:

```bash
npm run add:product-numbers
```

Este script:
- Agrega un `productNumber` único a cada producto (empezando desde 1001)
- Crea/actualiza el contador de productos
- Inicializa el contador de pedidos

### 3. Verificar la Configuración

Verifica que todo esté funcionando correctamente:

```bash
npm run verify:setup
```

## 📋 Estructura de Datos

### Producto (Product)
```typescript
{
  id: string;
  productNumber: number;  // Nuevo: Identificador numérico
  name: string;
  category: string;
  price: number;
  // ... otros campos
}
```

### Pedido (Order)
```typescript
{
  id: string;
  orderNumber: number;  // Identificador único del pedido
  items: [{
    productId: string;
    productNumber: number;
    productName: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }];
  customerInfo: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  costs: {
    productCost: number;
    shippingCost: number;
    handlingCost: number;
    totalCost: number;
    sellingPrice: number;
    profit: number;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

## 🎨 Flujo de Trabajo

### Cliente:
1. Navega al detalle de un producto
2. Selecciona talle y color
3. Hace clic en "LO QUIERO"
4. Ve modal de confirmación con resumen
5. Puede:
   - Confirmar pedido sin datos (solo notifica al admin)
   - Agregar datos de envío ahora
6. El pedido se registra en Firebase

### Administrador:
1. Ve notificación de pedidos activos en el menú
2. Accede a "Pedidos" en el panel
3. Ve todos los pedidos con filtros
4. Puede:
   - Ver detalles completos del pedido
   - Cambiar el estado del pedido
   - Editar costos de envío y gestión
   - Ver ganancias calculadas automáticamente
   - Eliminar pedidos si es necesario

## 💰 Gestión de Costos

El sistema calcula automáticamente:

- **Costo del Producto**: Precio base del producto
- **Costo de Envío**: Editable por el admin
- **Costo de Gestión**: Editable por el admin
- **Costo Total**: Suma de todos los costos
- **Precio de Venta**: Lo que paga el cliente
- **Ganancia**: Precio de Venta - Costo Total

## 🔔 Notificaciones

- Badge rojo animado en el menú "Pedidos" cuando hay pedidos activos
- Contador en tiempo real de pedidos pendientes y en proceso
- Actualización automática sin necesidad de recargar

## 🔒 Seguridad

### Firestore Rules:
- Clientes pueden crear pedidos (sin autenticación)
- Solo admins autenticados pueden leer/modificar pedidos
- Contadores accesibles para escritura (necesario para incrementos)

### Storage Rules:
- Lectura pública de imágenes
- Solo admins pueden subir/modificar imágenes

## 📱 Componentes Creados

### Frontend (Cliente):
- `OrderModal.tsx` - Modal para confirmar pedidos
- Modificaciones en `ProductDetail.tsx`

### Backend (Admin):
- `Orders.tsx` - Página principal de gestión de pedidos
- `useActiveOrders.ts` - Hook para pedidos en tiempo real
- Modificaciones en `Layout.tsx` para notificaciones

### Servicios:
- `orderService.ts` - Servicio completo de gestión de pedidos
- Modificaciones en `productService.ts` para números de producto

### Tipos:
- `order.ts` - Tipos TypeScript para pedidos

### Scripts:
- `add-product-numbers.js` - Agregar números a productos existentes

## 🎯 Próximas Mejoras Sugeridas

1. **Notificaciones por Email**: Enviar email al admin cuando hay un nuevo pedido
2. **WhatsApp Integration**: Integración directa con API de WhatsApp Business
3. **Historial de Estados**: Guardar cambios de estado con timestamps
4. **Reportes**: Generar reportes de ventas y ganancias
5. **Búsqueda**: Buscar pedidos por número, cliente, producto
6. **Exportar**: Exportar pedidos a CSV/Excel
7. **Múltiples Items**: Permitir agregar varios productos al pedido
8. **Carrito de Compras**: Implementar carrito antes de confirmar pedido

## 📞 Soporte

Si tienes problemas:

1. Verifica que las reglas de Firebase estén desplegadas
2. Asegúrate de haber ejecutado el script de números de producto
3. Revisa la consola del navegador para errores
4. Verifica que Firebase esté correctamente configurado

## 🎉 ¡Listo!

El sistema de pedidos está completamente funcional y listo para usar. Los clientes pueden hacer pedidos y tú puedes gestionarlos desde el panel de administración.

