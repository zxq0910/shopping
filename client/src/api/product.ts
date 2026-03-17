import { request } from './request';
import type { ApiResponse, Product } from '@/types';

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  sortBy?: 'price' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export function getProductsApi(params: ProductQuery) {
  return request.get<any, ApiResponse<{ list: Product[]; total: number; page: number; pageSize: number }>>('/products', { params });
}

export function getProductDetailApi(id: number) {
  return request.get<any, ApiResponse<Product>>(`/products/${id}`);
}

export function getCategoriesApi() {
  return request.get<any, ApiResponse<string[]>>('/products/categories');
}

export function searchProductsApi(params: { q: string; page?: number; pageSize?: number; category?: string }) {
  return request.get<any, ApiResponse<{ list: Product[]; total: number; page: number; pageSize: number }>>('/products/search', { params });
}

export function syncProductsApi() {
  return request.post<any, ApiResponse<{ total: number; embeddingResult: { total: number; failed: number } }>>('/products/sync');
}
