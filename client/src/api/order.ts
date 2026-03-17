import { request } from './request';
import type { ApiResponse, Order } from '@/types';

export function createOrderApi(payload: { receiver_name: string; receiver_phone: string; receiver_address: string }) {
  return request.post<any, ApiResponse<Order>>('/orders', payload);
}

export function getOrdersApi() {
  return request.get<any, ApiResponse<{ list: Order[]; total: number }>>('/orders');
}

export function getOrderDetailApi(id: number) {
  return request.get<any, ApiResponse<Order>>(`/orders/${id}`);
}
