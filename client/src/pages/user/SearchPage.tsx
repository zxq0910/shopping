import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductListPage from './ProductListPage';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const q = params.get('q');
    if (q && !params.get('keyword')) {
      const next = new URLSearchParams(params);
      next.set('keyword', q);
      next.delete('q');
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  return <ProductListPage />;
}
