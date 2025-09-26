export interface Product {
  id: number;
  name: string;
  category: 'remera' | 'buzo' | 'pantalon' | 'short' | 'campera';
  sizes: Array<'S' | 'M' | 'L' | 'XL' | 'XXL'>;
  colors: string[];
  price: number;
  images: string[];
  description: string;
  featured: boolean;
  material?: string;
  care?: string;
  carouselImages?: string[];
  imagesByColor?: {
    [color: string]: string[];
  };
}