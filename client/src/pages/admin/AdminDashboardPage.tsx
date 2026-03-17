import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Empty, Skeleton, Space, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { adminProductsApi } from '@/api/admin';
import { CategoryCountBarChart } from '@/components/admin/CategoryCountBarChart';

interface ProductLike {
  category?: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductLike[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminProductsApi({ page: 1, pageSize: 1000 })
      .then((res) => {
        if (mounted) {
          setProducts(res.data.list || []);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categoryData = useMemo(() => {
    const counter = new Map<string, number>();
    products.forEach((item) => {
      const key = (item.category || '未分类').trim() || '未分类';
      counter.set(key, (counter.get(key) || 0) + 1);
    });

    return Array.from(counter.entries()).map(([category, count]) => ({ category, count }));
  }, [products]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card>
        <Space size={24} wrap>
          <Statistic title="管理入口" value="在线购物后台" />
          <Button onClick={() => navigate('/admin/products')}>管理商品</Button>
          <Button onClick={() => navigate('/admin/orders')}>管理订单</Button>
          <Button onClick={() => navigate('/admin/users')}>管理用户</Button>
        </Space>
      </Card>

      <Card title="商品分类统计（柱状图）">
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : categoryData.length ? (
          <CategoryCountBarChart data={categoryData} />
        ) : (
          <Empty description="暂无商品数据，请先同步商品" />
        )}
      </Card>
    </Space>
  );
}
