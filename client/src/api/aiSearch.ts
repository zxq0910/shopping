import { request } from './request';
import type { ApiResponse } from '@/types';

export function uploadImageApi(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return request.post<any, ApiResponse<{ filePath: string; url: string }>>('/ai-search/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function matchImageApi(payload: { filePath: string; topN?: number }) {
  return request.post<any, ApiResponse<Array<{ product_id: number; title: string; price: number; thumbnail: string; similarity: number }>>>(
    '/ai-search/match',
    payload
  );
}
