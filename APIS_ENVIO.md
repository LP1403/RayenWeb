# APIs de Envío y Logística en Argentina

Documentación sobre proveedores de logística con APIs disponibles para integrar en la plataforma.

## Proveedores Principales

### 1. Correo Argentino

**Características:**
- API oficial disponible
- Principalmente para seguimiento de envíos
- Cotización limitada en plan gratuito
- Requiere contrato comercial para acceso completo a cotizaciones automáticas

**Documentación:**
- URL: https://www.correoargentino.com.ar/desarrolladores
- Servicios: Seguimiento, cotización (limitada), generación de etiquetas

**Limitaciones:**
- Proceso de registro puede ser lento
- Acceso completo requiere ser cliente corporativo
- Documentación menos actualizada

---

### 2. Andreani (⭐ Recomendado)

**Características:**
- API REST moderna y bien documentada
- Ambiente de testing gratuito (sandbox)
- Cotización de costos según origen, destino y peso
- Seguimiento de envíos en tiempo real
- Generación de etiquetas

**Ventajas:**
- Mejor documentación técnica
- Más fácil de integrar
- Respuesta rápida del equipo de soporte
- No requiere contrato previo para testing

**Documentación:**
- URL: https://developers.andreani.com/
- Portal de desarrolladores: https://developers.andreani.com/documentacion

**Endpoints principales:**
- `POST /v1/tarifas` - Cotizar envío
- `POST /v1/envios` - Crear envío
- `GET /v1/envios/{numeroDeEnvio}` - Seguimiento

**Ejemplo de cotización:**
```json
POST /v1/tarifas
{
  "cpDestino": "1406",
  "cpOrigen": "1000",
  "peso": 1,
  "valorDeclarado": 5000,
  "bultos": [
    {
      "valorDeclarado": 5000,
      "peso": 1
    }
  ]
}
```

**Respuesta esperada:**
```json
{
  "tarifaConIva": 2500.50,
  "tarifaSinIva": 2066.94,
  "plazoEntrega": "2-3 días hábiles"
}
```

---

### 3. OCA E-Pak

**Características:**
- API REST disponible
- Permite calcular tarifas según destino
- Seguimiento de envíos
- Generación de órdenes

**Requisitos:**
- Necesitas ser cliente corporativo para acceso completo
- Proceso de alta más burocrático

**Documentación:**
- URL: https://www.oca.com.ar/clientes-corporativos
- Soporte: Contacto comercial necesario

**Limitaciones:**
- Menos documentación pública
- Requiere aprobación comercial
- Más orientado a grandes volúmenes

---

## Soluciones Agregadoras

### Envío Pack (⭐⭐ Muy Recomendado)

**¿Qué es?**
- Plataforma que agrega múltiples couriers argentinos
- API unificada para cotizar con todos los proveedores a la vez
- Compara precios automáticamente

**Proveedores incluidos:**
- Andreani
- OCA
- Correo Argentino
- Cruz del Sur
- DHL
- FedEx
- Y más

**Ventajas:**
- Una sola integración para todos los couriers
- Comparación automática de precios
- Dashboard para gestión de envíos
- Webhooks para seguimiento
- Ambiente de sandbox gratuito

**Planes:**
- **Free**: Limitado, pero útil para testing
- **Pago**: Por volumen de envíos o comisión por operación

**Documentación:**
- URL: https://enviopack.com/
- API Docs: https://developers.enviopack.com/

**Ejemplo de cotización:**
```javascript
POST /cotizar
{
  "origen": {
    "codigoPostal": "1000"
  },
  "destino": {
    "codigoPostal": "1406"
  },
  "paquetes": [
    {
      "peso": 1,
      "alto": 10,
      "ancho": 20,
      "largo": 30,
      "valorDeclarado": 5000
    }
  ]
}
```

**Respuesta:**
```json
{
  "cotizaciones": [
    {
      "correo": "andreani",
      "servicio": "Estandar",
      "precio": 2500.50,
      "plazoEntrega": "2-3 días"
    },
    {
      "correo": "oca",
      "servicio": "OCA Pak",
      "precio": 2300.00,
      "plazoEntrega": "3-4 días"
    }
  ]
}
```

---

## Recomendación de Implementación

### Fase 1: Actual (Implementado ✅)
- Costo de envío fijo configurable desde el dashboard
- Se muestra al cliente en el detalle del producto
- Simple y funcional para empezar

### Fase 2: Integración Básica
**Opción A - Andreani directo:**
```typescript
// src/services/shippingService.ts
export class ShippingService {
  static async calculateShipping(
    originPostalCode: string,
    destPostalCode: string,
    weight: number
  ): Promise<number> {
    const response = await fetch('https://api.andreani.com/v1/tarifas', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANDREANI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpOrigen: originPostalCode,
        cpDestino: destPostalCode,
        peso: weight,
        valorDeclarado: 0
      })
    });
    
    const data = await response.json();
    return data.tarifaConIva;
  }
}
```

**Opción B - Envío Pack (Mejor para escalar):**
```typescript
export class ShippingService {
  static async calculateShipping(
    destPostalCode: string,
    weight: number
  ): Promise<ShippingQuote[]> {
    const response = await fetch('https://api.enviopack.com/cotizar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ENVIOPACK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        origen: { codigoPostal: "1000" },
        destino: { codigoPostal: destPostalCode },
        paquetes: [{ peso: weight, alto: 10, ancho: 20, largo: 30 }]
      })
    });
    
    const data = await response.json();
    return data.cotizaciones.map(c => ({
      carrier: c.correo,
      price: c.precio,
      estimatedDays: c.plazoEntrega
    }));
  }
}
```

### Fase 3: Experiencia Avanzada
- Permitir al cliente ingresar código postal antes de ver el precio final
- Mostrar opciones de envío (estándar, express, retiro en sucursal)
- Calcular en tiempo real según la dirección
- Integrar seguimiento automático del envío

---

## Comparación Rápida

| Proveedor | Sandbox Gratis | Fácil Integración | Requiere Contrato | Múltiples Couriers |
|-----------|----------------|-------------------|-------------------|-------------------|
| Correo Argentino | ⚠️ Limitado | ⭐⭐ | Sí (para producción) | No |
| Andreani | ✅ Sí | ⭐⭐⭐⭐ | No (para testing) | No |
| OCA | ⚠️ Limitado | ⭐⭐ | Sí | No |
| Envío Pack | ✅ Sí | ⭐⭐⭐⭐⭐ | No | ✅ Todos |

---

## Próximos Pasos Sugeridos

1. **Registrarse en Andreani Developers** (o Envío Pack)
2. **Obtener API Key para sandbox**
3. **Crear servicio de cotización** (`src/services/shippingService.ts`)
4. **Modificar ProductDetail** para calcular envío en tiempo real (opcional)
5. **Agregar campo de código postal** en OrderModal para cotización dinámica
6. **Guardar la cotización** en el pedido para tracking

---

## Notas Importantes

- Todos los proveedores requieren **peso estimado del producto** para cotizar
- El **código postal** es obligatorio para cotización precisa
- Considera agregar campo `weight` en la tabla de productos
- Para testing, usa códigos postales de CABA/GBA (1000-1499)
- La mayoría de APIs tienen **rate limits** en planes gratuitos

---

## Contacto Comercial

- **Andreani**: api@andreani.com
- **Envío Pack**: hola@enviopack.com
- **OCA**: atencion.clientes@oca.com.ar
- **Correo Argentino**: corporativos@correoargentino.com.ar
