import { Product } from '../types/Product';

export const products: Product[] = [
  // {
  //   id: 1,
  //   name: "Remera Básica Premium",
  //   category: "remera",
  //   sizes: ["S", "M", "L", "XL", "XXL"],
  //   colors: ["Negro", "Blanco", "Gris"],
  //   price: 15900,
  //   images: [
  //     "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
  //     "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
  //     "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg"
  //   ],
  //   description: "Remera de algodón 100% premium, perfecta para el uso diario. Corte clásico que sienta bien en cualquier ocasión. Confeccionada con materiales de alta calidad que garantizan durabilidad y comodidad.",
  //   featured: true,
  //   material: "100% Algodón Premium",
  //   care: "Lavar a máquina con agua fría. No usar blanqueador.",
  //   carouselImages: [
  //     "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
  //     "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg"

  {
    id: 2,
    name: "Buzo Gato Psycho",
    category: "buzo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 25000,
    images: [
      `${import.meta.env.BASE_URL}Mock up buzo gato negro-Espalda Negro.jpg`,
      `${import.meta.env.BASE_URL}Mock up buzo gato negro-frente Negro.jpg`
    ],
    imagesByColor: {
      "Negro": [
        `${import.meta.env.BASE_URL}Mock up buzo gato negro-Espalda Negro.jpg`,
        `${import.meta.env.BASE_URL}Mock up buzo gato negro-frente Negro.jpg`
      ]
    },
    description: "Buzo de algodón premium con diseño exclusivo de gato en color negro, marrón o beige. Ideal para quienes buscan comodidad y estilo en una prenda versátil para cualquier ocasión.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      `${import.meta.env.BASE_URL}Mock up buzo gato negro-Espalda Negro.jpg`,
      `${import.meta.env.BASE_URL}Mock up buzo gato negro-frente Negro.jpg`
    ]
  },
  {
    id: 3,
    name: "Buzo Gato Colores",
    category: "buzo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Marrón", "Beige"],
    price: 25000,
    images: [
      `${import.meta.env.BASE_URL}Mock buzo gato lentes-Marron osc.jpg`,
      `${import.meta.env.BASE_URL}Mock buzo gato lentes-frente Marron osc.jpg`
    ],
    imagesByColor: {
      "Marrón": [
        `${import.meta.env.BASE_URL}Mock buzo gato lentes-Marron osc.jpg`,
        `${import.meta.env.BASE_URL}Mock buzo gato lentes-frente Marron osc.jpg`
      ],
      "Beige": [
        `${import.meta.env.BASE_URL}Mock buzo gato lentes-Beige.jpg`,
        `${import.meta.env.BASE_URL}Mock buzo gato lentes-Beige frente.jpg`
      ]
    },
    description: "Buzo de algodón premium con diseño exclusivo de gato en color negro, marrón o beige. Ideal para quienes buscan comodidad y estilo en una prenda versátil para cualquier ocasión.",
    featured: false,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      `${import.meta.env.BASE_URL}Mock buzo gato lentes-Marron osc.jpg`,
      `${import.meta.env.BASE_URL}Mock buzo gato lentes-frente Marron osc.jpg`
    ]
  },
  {
    id: 4,
    name: "Buzo Serpiente Negro",
    category: "buzo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 27000,
    images: [
      `${import.meta.env.BASE_URL}Mock buzo serpiente-Espalda.jpg`,
      `${import.meta.env.BASE_URL}Mock buzo serpiente-frente.jpg`
    ],
    description: "Buzo negro con diseño de serpiente, confeccionado en algodón premium. Perfecto para quienes buscan un estilo audaz y cómodo.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      `${import.meta.env.BASE_URL}Mock buzo serpiente-Espalda.jpg`,
      `${import.meta.env.BASE_URL}Mock buzo serpiente-frente.jpg`
    ]
  },
  // Eliminado porque está incluido en el producto anterior con variantes de color
  {
    id: 6,
    name: "Remera Flor Negra",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 18000,
    images: [
      `${import.meta.env.BASE_URL}Mock up remera negra frente-Flor.jpg`,
      `${import.meta.env.BASE_URL}Mock up remera negra espalda-Flor.jpg`
    ],
    description: "Remera negra con diseño de flor, confeccionada en algodón premium. Elegancia y comodidad en una sola prenda.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      `${import.meta.env.BASE_URL}Mock up remera negra frente-Flor.jpg`,
      `${import.meta.env.BASE_URL}Mock up remera negra espalda-Flor.jpg`
    ]
  },
  {
    id: 7,
    name: "Remera Araña Negra",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 18000,
    images: [
      `${import.meta.env.BASE_URL}Mock up remera negra espalda-Araña.jpg`,
      `${import.meta.env.BASE_URL}Mock up remera negra frente-Araña.jpg`
    ],
    description: "Remera negra con diseño de araña, confeccionada en algodón premium. Un toque de originalidad para tu outfit diario.",
    featured: false,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      `${import.meta.env.BASE_URL}Mock up remera negra espalda-Araña.jpg`,
      `${import.meta.env.BASE_URL}Mock up remera negra frente-Araña.jpg`
    ]
  },
  {
    id: 8,
    name: "Remera Gato Color",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 18000,
    images: [
      `${import.meta.env.BASE_URL}Mock remera gato color-Frente Negro.jpg`,
      `${import.meta.env.BASE_URL}Mock remera gato color-Negro.jpg`
    ],
    imagesByColor: {
      /*"Blanco": [
        "/Mock remera gato color- blanco frente.jpg",
        "/Mock remera gato color- blanco.jpg"
      ],
      "Verde": [
        "/Mock remera gato color- verde frente osc.jpg",
        "/Mock remera gato color- verde osc.jpg"
      ],*/
      "Negro": [
        `${import.meta.env.BASE_URL}Mock remera gato color-Frente Negro.jpg`,
        `${import.meta.env.BASE_URL}Mock remera gato color-Negro.jpg`
      ]
    },
    description: "Remera Gato Color",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      `${import.meta.env.BASE_URL}Mock remera gato color-Negro.jpg`,
      `${import.meta.env.BASE_URL}Mock remera gato color-Frente Negro.jpg`
    ]
  }
];