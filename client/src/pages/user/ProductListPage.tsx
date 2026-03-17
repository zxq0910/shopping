import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Col, Empty, Pagination, Row, Select, Space, Spin, Input } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { getCategoriesApi, getProductsApi } from '@/api/product';
import { addCartApi } from '@/api/cart';
import { useAppStore } from '@/store/appStore';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export default function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [visibleCount, setVisibleCount] = useState(8);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const setCart = useAppStore((s) => s.setCart);

  const page = Number(params.get('page') || 1);
  const pageSize = Number(params.get('pageSize') || 20);
  const keyword = params.get('keyword') || '';
  const category = params.get('category') || '';
  const sortBy = (params.get('sortBy') as 'price' | 'rating' | 'created_at') || 'created_at';
  const sortOrder = (params.get('sortOrder') as 'asc' | 'desc') || 'desc';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, categoryRes] = await Promise.all([
        getProductsApi({ page, pageSize, keyword, category, sortBy, sortOrder }),
        getCategoriesApi()
      ]);
      setList(productRes.data.list);
      setTotal(productRes.data.total);
      setCategories(categoryRes.data);
      setVisibleCount(8);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, category, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, list.length));
        }
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [list.length]);

  const visibleList = useMemo(() => list.slice(0, visibleCount), [list, visibleCount]);

  const setQuery = (patch: Record<string, string | number>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => next.set(k, String(v)));
    setParams(next);
  };

  const onAddCart = async (product: Product) => {
    const res = await addCartApi({ product_id: product.id, quantity: 1 });
    setCart(res.data.list, res.data.total);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space wrap>
          <Input.Search allowClear placeholder="关键词" defaultValue={keyword} onSearch={(v) => setQuery({ keyword: v, page: 1 })} style={{ width: 220 }} />
          <Select
            placeholder="分类"
            value={category || undefined}
            allowClear
            style={{ width: 180 }}
            onChange={(v) => setQuery({ category: v || '', page: 1 })}
            options={categories.map((it) => ({ label: it, value: it }))}
          />
          <Select
            value={`${sortBy}:${sortOrder}`}
            onChange={(v) => {
              const [s, o] = v.split(':');
              setQuery({ sortBy: s, sortOrder: o, page: 1 });
            }}
            options={[
              { label: '最新', value: 'created_at:desc' },
              { label: '价格升序', value: 'price:asc' },
              { label: '价格降序', value: 'price:desc' },
              { label: '评分降序', value: 'rating:desc' }
            ]}
            style={{ width: 180 }}
          />
        </Space>
      </Card>

      <Spin spinning={loading}>
        {!list.length && <Empty description="暂无数据" />}
        <Row gutter={[12, 12]}>
          {visibleList.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <ProductCard product={item} onAddCart={onAddCart} />
            </Col>
          ))}
        </Row>
        <div ref={observerRef} style={{ height: 1 }} />
      </Spin>

      <Pagination current={page} pageSize={pageSize} total={total} onChange={(p, ps) => setQuery({ page: p, pageSize: ps })} showSizeChanger />
    </Space>
  );
}
