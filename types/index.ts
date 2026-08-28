export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  calories?: number;
  allergens?: string[];
  rating?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  icon?: string;
}