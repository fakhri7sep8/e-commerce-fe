export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: Category | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  product: Product;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'done';
  user?: {
    id: string;
    name: string;
    email: string;
    role?: 'customer' | 'admin';
  };
  items: OrderItem[];
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}
