# Rayen - E-commerce de Ropa

Una plataforma de e-commerce moderna para la marca Rayen, desarrollada con React, TypeScript y Vite.

## 🚀 Características

- **Catálogo de productos** con vista detallada
- **Diseñador personalizado** con wizard interactivo
- **Mockups realistas** para visualizar diseños
- **Responsive design** optimizado para móviles
- **Navegación fluida** entre secciones

## 🛠️ Tecnologías

- **React 18** + **TypeScript**
- **Vite** para desarrollo y build
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Canvas API** para el diseñador interactivo

## 📦 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/RayenWeb.git
   cd RayenWeb
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

## 🚀 Desarrollo

**Ejecutar en modo desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para Producción

**Generar build de producción:**
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

**Preview del build:**
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Navegación principal
│   ├── Hero.tsx        # Sección hero
│   ├── DesignWizard.tsx # Wizard de diseño
│   └── DesignPreview.tsx # Preview interactivo
├── data/               # Datos estáticos
│   ├── products.ts     # Catálogo de productos
│   └── designData.ts   # Diseños y configuraciones
├── types/              # Definiciones TypeScript
└── App.tsx            # Componente principal
```

## 🎨 Diseñador Personalizado

El proyecto incluye un wizard completo para personalizar prendas:

1. **Selección de prenda** (remera, buzo)
2. **Elección de diseño** de la biblioteca
3. **Preview interactivo** con drag & drop
4. **Personalización** de tamaño, posición y rotación
5. **Checkout** con resumen final

## 🌐 Despliegue

El proyecto está configurado para GitHub Pages con base path `/RayenWeb/`:

- **Desarrollo**: Assets desde `/`
- **Producción**: Assets desde `/RayenWeb/`

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter de código

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado con ❤️ para Rayen**
