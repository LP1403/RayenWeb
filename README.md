# 🚀 Rayen Web

## 📋 **Comandos Principales**

### **Desarrollo:**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

### **Base de Datos:**
```bash
npm run migrate:products      # Migrar productos a Firebase
npm run add:product-numbers   # Agregar números a productos
npm run verify:setup          # Verificar configuración
```

### **Deploy:**
```bash
npm run deploy             # Deploy completo a Firebase
npm run deploy:preview     # Deploy de preview
npm run deploy:rules       # Deploy solo de reglas de seguridad
```

## 🔥 **Firebase Configurado**

- **Proyecto:** `rayenweb-b321c`
- **Base de datos:** Firestore
- **Hosting:** Configurado para la aplicación web
- **Autenticación:** Preparada para admin

## 📁 **Estructura**

```
src/                    # Código fuente
├── components/         # Componentes React
├── pages/             # Páginas de la aplicación
├── config/            # Configuración (Firebase, EmailJS)
├── types/             # Tipos TypeScript
├── services/          # Servicios (Firebase, Storage)
├── hooks/             # Hooks personalizados
├── data/              # Datos estáticos
└── auth/              # Autenticación
```

## 🎯 **Funcionalidades**

- ✅ **Catálogo de productos** con Firebase
- ✅ **Diseñador personalizado** de prendas
- ✅ **Panel de administración** para productos
- ✅ **Sistema de pedidos** completo con gestión de costos
- ✅ **Notificaciones en tiempo real** de pedidos activos
- ✅ **Autenticación** con Firebase Auth
- ✅ **Formulario de contacto** con EmailJS
- ✅ **Responsive design** con Tailwind CSS

## 📦 **Sistema de Pedidos**

El sistema permite a los clientes hacer pedidos desde la web y al administrador gestionarlos:

- **Clientes**: Pueden hacer pedidos con/sin datos de envío
- **Administrador**: Gestiona pedidos, estados, costos y ve ganancias
- **Notificaciones**: Badge en tiempo real de pedidos activos
- **Números únicos**: Cada producto y pedido tiene un identificador

Ver documentación completa en [ORDERS_SYSTEM.md](./ORDERS_SYSTEM.md)

¡Listo para usar! 🔥