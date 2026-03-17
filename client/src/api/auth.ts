import { request } from './request';
import type { ApiResponse, UserInfo } from '@/types';

export function registerApi(payload: { username: string; email: string; password: string }) {
  return request.post<any, ApiResponse<{ user: UserInfo; token: string }>>('/auth/register', payload);
}

export function loginApi(payload: { email: string; password: string }) {
  return request.post<any, ApiResponse<{ user: UserInfo; token: string }>>('/auth/login', payload);
}

export function profileApi() {
  return request.get<any, ApiResponse<UserInfo>>('/auth/profile');
}
