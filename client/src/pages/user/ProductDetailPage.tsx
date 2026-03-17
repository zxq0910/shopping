import { Carousel, Card, Descriptions, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetailApi } from '@/api/product';
import { addCartApi } from '@/api/cart';
import { useAppStore } from '@/store/appStore';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const setCart = useAppStore((s) => s.setCart);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductDetailApi(Number(id)).then((res) => setProduct(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (!product) return <Card loading={loading} />;

  return (
    <Card title={product.title} loading={loading}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Carousel autoplay>
          {(product.images?.length ? product.images.map((it) => it.image_url) : [product.thumbnail]).map((img) => (
            <img key={img} src={img} alt={product.title} style={{ height: 360, objectFit: 'contain', width: '100%' }} loading="lazy" />
          ))}
        </Carousel>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="价格">¥{product.price}</Descriptions.Item>
          <Descriptions.Item label="库存">{product.stock}</Descriptions.Item>
          <Descriptions.Item label="分类">{product.category}</Descriptions.Item>
          <Descriptions.Item label="品牌">{product.brand}</Descriptions.Item>
          <Descriptions.Item label="描述">{product.description}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" onClick={async () => {
          const res = await addCartApi({ product_id: product.id, quantity: 1 });
          setCart(res.data.list, res.data.total);
        }}>
          加入购物车
        </Button>
      </Space>
    </Card>
  );
}
