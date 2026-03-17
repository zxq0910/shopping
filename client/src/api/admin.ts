import { request } from './request';
import type { ApiResponse, Product, UserInfo } from '@/types';

type ProductPayload = Omit<Partial<Product>, 'images'> & { images?: string[] };

export function adminUsersApi(params: { page?: number; pageSize?: number }) {
  return request.get<any, ApiResponse<{ list: UserInfo[]; total: number }>>('/admin/users', { params });
}

export function adminOrdersApi(params: { page?: number; pageSize?: number }) {
  return request.get<any, ApiResponse<{ list: any[]; total: number }>>('/admin/orders', { params });
}

export function adminUpdateOrderStatusApi(id: number, status: string) {
  return request.put<any, ApiResponse<boolean>>(`/admin/orders/${id}/status`, { status });
}

export function adminProductsApi(params: { page?: number; pageSize?: number; keyword?: string }) {
  return request.get<any, ApiResponse<{ list: Product[]; total: number }>>('/admin/products', { params });
}

export function adminCreateProductApi(payload: ProductPayload) {
  return request.post<any, ApiResponse<Product>>('/admin/products', payload);
}

export function adminUpdateProductApi(id: number, payload: ProductPayload) {
  return request.put<any, ApiResponse<Product>>(`/admin/products/${id}`, payload);
}

export function adminDeleteProductApi(id: number) {
  return request.delete<any, ApiResponse<boolean>>(`/admin/products/${id}`);
}
