import { request } from './request';
import type { ApiResponse, CartItem } from '@/types';

export function getCartApi() {
  return request.get<any, ApiResponse<{ list: CartItem[]; total: number }>>('/cart');
}

export function addCartApi(payload: { product_id: number; quantity: number }) {
  return request.post<any, ApiResponse<{ list: CartItem[]; total: number }>>('/cart', payload);
}

export function updateCartApi(id: number, payload: { quantity: number }) {
  return request.put<any, ApiResponse<{ list: CartItem[]; total: number }>>(`/cart/${id}`, payload);
}

export function deleteCartApi(id: number) {
  return request.delete<any, ApiResponse<{ list: CartItem[]; total: number }>>(`/cart/${id}`);
}
