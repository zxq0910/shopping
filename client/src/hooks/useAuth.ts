import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';

export function useAuth() {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);

  return useMemo(() => ({
    token,
    user,
    isLogin: Boolean(token),
    isAdmin: user?.role === 'admin'
  }), [token, user]);
}
