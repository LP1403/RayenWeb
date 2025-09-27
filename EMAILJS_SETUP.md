# 📧 Configuración de EmailJS para Envío de Emails

## 🚀 Pasos para Configurar EmailJS (Gratuito)

### 1. **Crear Cuenta en EmailJS**
- Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
- Haz clic en "Sign Up" y crea una cuenta gratuita
- **Plan Gratuito**: 200 emails/mes

### 2. **Configurar Servicio de Email**
- En el dashboard, ve a "Email Services"
- Haz clic en "Add New Service"
- Selecciona tu proveedor de email:
  - **Gmail** (recomendado)
  - **Outlook**
  - **Yahoo**
- Sigue las instrucciones para conectar tu cuenta
- **Anota el Service ID** (ej: `service_abc123`)

### 3. **Crear Template de Email**
- Ve a "Email Templates"
- Haz clic en "Create New Template"
- Usa este template:

```
Asunto: Nuevo mensaje de contacto - {{from_name}}

Hola,

Has recibido un nuevo mensaje de contacto desde tu sitio web Rayen:

**Nombre:** {{from_name}}
**Email:** {{from_email}}
**Mensaje:** {{message}}

---
Enviado desde Rayen Web
```

- **Anota el Template ID** (ej: `template_xyz789`)

### 4. **Obtener Public Key**
- Ve a "Account" → "General"
- Copia tu **Public Key** (ej: `user_abc123def456`)

### 5. **Configurar el Proyecto**
- Abre `src/config/emailjs.ts`
- Reemplaza los valores:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',        // Tu Service ID
  TEMPLATE_ID: 'template_xyz789',     // Tu Template ID
  PUBLIC_KEY: 'user_abc123def456',    // Tu Public Key
  TO_EMAIL: 'rayenco.business@gmail.com'
};
```

### 6. **Probar el Formulario**
- Ejecuta `npm run dev`
- Ve a la sección de contacto
- Envía un mensaje de prueba
- Revisa tu email `rayenco.business@gmail.com`