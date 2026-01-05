# Configuración de Límites de Subida

## Archivo: `uploadLimits.ts`

Este archivo contiene la configuración parametrizable para los límites de subida de archivos personalizados.

### Configuración Actual (Por Defecto)

```typescript
export const defaultUploadLimits: UploadLimits = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxWidth: 2000, // 2000px
  maxHeight: 2000, // 2000px
  minWidth: 100, // 100px
  minHeight: 100, // 100px
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
  maxFiles: 1
};
```

### Cómo Modificar los Límites

#### 1. Cambiar Tamaño Máximo de Archivo
```typescript
// Para 10MB
maxFileSize: 10 * 1024 * 1024, // 10MB

// Para 2MB
maxFileSize: 2 * 1024 * 1024, // 2MB
```

#### 2. Cambiar Dimensiones Máximas
```typescript
// Para imágenes más grandes
maxWidth: 4000, // 4000px
maxHeight: 4000, // 4000px

// Para imágenes más pequeñas
maxWidth: 1000, // 1000px
maxHeight: 1000, // 1000px
```

#### 3. Cambiar Dimensiones Mínimas
```typescript
// Para imágenes más pequeñas
minWidth: 50, // 50px
minHeight: 50, // 50px

// Para imágenes más grandes
minWidth: 200, // 200px
minHeight: 200, // 200px
```

#### 4. Agregar/Quitar Formatos
```typescript
// Agregar WebP
allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'],

// Solo PNG y JPG
allowedFormats: ['image/png', 'image/jpeg'],
```

#### 5. Permitir Múltiples Archivos
```typescript
// Para permitir hasta 3 archivos
maxFiles: 3
```

### Uso en el Componente

```typescript
import { defaultUploadLimits } from '../config/uploadLimits';

// Usar configuración por defecto
<CustomDesignUpload 
  onDesignUpload={handleUpload}
  onRemove={handleRemove}
/>

// Usar configuración personalizada
const customLimits = {
  ...defaultUploadLimits,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxWidth: 3000, // 3000px
  maxHeight: 3000, // 3000px
};

<CustomDesignUpload 
  onDesignUpload={handleUpload}
  onRemove={handleRemove}
  limits={customLimits}
/>
```

### Validaciones Implementadas

1. **Tamaño de Archivo**: Verifica que no exceda el límite
2. **Formato**: Verifica que esté en la lista de formatos permitidos
3. **Dimensiones**: Verifica que esté dentro de los límites min/max
4. **Cantidad**: Verifica que no exceda el número máximo de archivos

### Mensajes de Error

Los mensajes de error son automáticos y se muestran en español:
- "El archivo es demasiado grande. Máximo permitido: XMB"
- "Formato no permitido. Formatos válidos: ..."
- "La imagen es demasiado pequeña. Mínimo: XxYpx"
- "La imagen es demasiado grande. Máximo: XxYpx"
