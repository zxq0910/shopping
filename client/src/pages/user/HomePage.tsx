import { Button, Card, Col, Empty, Input, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsApi } from '@/api/product';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { addCartApi, getCartApi } from '@/api/cart';
import { useAppStore } from '@/store/appStore';

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [hot, setHot] = useState<Product[]>([]);
  const setCart = useAppStore((s) => s.setCart);

  useEffect(() => {
    getProductsApi({ page: 1, pageSize: 8, sortBy: 'rating', sortOrder: 'desc' }).then((res) => setHot(res.data.list));
    getCartApi().then((res) => setCart(res.data.list, res.data.total)).catch(() => undefined);
  }, [setCart]);

  const onAddCart = async (product: Product) => {
    const res = await addCartApi({ product_id: product.id, quantity: 1 });
    setCart(res.data.list, res.data.total);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={3}>在线购物平台</Typography.Title>
        <Space.Compact style={{ width: '100%', maxWidth: 540 }}>
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索商品/品牌" />
          <Button type="primary" onClick={() => navigate(`/search?q=${encodeURIComponent(keyword)}`)}>
            搜索
          </Button>
        </Space.Compact>
      </Card>

      <Card title="热门推荐">
        {!hot.length && <Empty description="暂无商品" />}
        <Row gutter={[12, 12]}>
          {hot.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <ProductCard product={item} onAddCart={onAddCart} />
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  );
}
