// Configuración de EmailJS
// Para configurar:
// 1. Ve a https://www.emailjs.com/
// 2. Crea una cuenta gratuita
// 3. Crea un servicio de email (Gmail, Outlook, etc.)
// 4. Crea un template de email
// 5. Reemplaza los valores de abajo con tus credenciales

export const EMAILJS_CONFIG = {
    // Reemplazar con tus credenciales de EmailJS
    SERVICE_ID: 'service_jp69paw',
    TEMPLATE_ID: 'template_iintx9p',
    PUBLIC_KEY: 'pvGg-P1iSyk-OnYdr',

    // Email de destino
    TO_EMAIL: 'rayenco.business@gmail.com'
};

// Template de email sugerido para EmailJS:
/*
Asunto: Nuevo mensaje de contacto - {{from_name}}

Hola,

Has recibido un nuevo mensaje de contacto desde tu sitio web:

Nombre: {{from_name}}
Email: {{from_email}}
Mensaje: {{message}}

---
Enviado desde Rayen Web
*/
