export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  thumbnail: string;
  rating: number;
  images?: Array<{ id: number; image_url: string; sort_order: number }>;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_title: string;
  product_price: number;
  quantity: number;
  product_image: string;
}

export interface Order {
  id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  created_at: string;
  items?: OrderItem[];
}
