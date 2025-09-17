import { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: 1,
    name: "Remera Básica Premium",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro", "Blanco", "Gris"],
    price: 15900,
    images: [
      "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
      "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg"
    ],
    description: "Remera de algodón 100% premium, perfecta para el uso diario. Corte clásico que sienta bien en cualquier ocasión. Confeccionada con materiales de alta calidad que garantizan durabilidad y comodidad.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador."
  },
  {
    id: 2,
    name: "Remera Oversize Urban",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro", "Beige", "Verde Oliva"],
    price: 18500,
    images: [
      "https://images.pexels.com/photos/1261422/pexels-photo-1261422.jpeg",
      "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg",
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"
    ],
    description: "Remera con corte oversize para un look urbano y moderno. Tejido de alta calidad que mantiene su forma y color después de múltiples lavados. Ideal para combinar con cualquier outfit casual.",
    featured: true,
    material: "Mezcla de Algodón y Poliéster",
    care: "Lavar a máquina con colores similares. Secar a temperatura media."
  }
];