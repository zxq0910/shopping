import { Button, Card, Empty, InputNumber, Space, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCartApi, getCartApi, updateCartApi } from '@/api/cart';
import { useAppStore } from '@/store/appStore';
import type { CartItem } from '@/types';

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const items = useAppStore((s) => s.cartItems);
  const setCart = useAppStore((s) => s.setCart);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCartApi();
      setCart(res.data.list, res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0), [items]);

  if (!items.length && !loading) return <Empty description="购物车为空" />;

  return (
    <Card title="购物车" loading={loading}>
      <Table<CartItem>
        rowKey="id"
        dataSource={items}
        pagination={false}
        columns={[
          { title: '商品', dataIndex: 'title' },
          { title: '单价', dataIndex: 'price', render: (v) => `¥${v}` },
          {
            title: '数量',
            dataIndex: 'quantity',
            render: (_, row) => (
              <InputNumber min={1} value={row.quantity} onChange={async (v) => {
                await updateCartApi(row.id, { quantity: Number(v || 1) });
                fetchCart();
              }} />
            )
          },
          { title: '小计', render: (_, row) => `¥${(Number(row.price) * Number(row.quantity)).toFixed(2)}` },
          {
            title: '操作',
            render: (_, row) => <Button danger size="small" onClick={async () => {
              await deleteCartApi(row.id);
              fetchCart();
            }}>删除</Button>
          }
        ]}
      />
      <Space style={{ marginTop: 16 }}>
        <Typography.Text strong>合计: ¥{total.toFixed(2)}</Typography.Text>
        <Button type="primary" onClick={() => navigate('/order/confirm')}>去结算</Button>
      </Space>
    </Card>
  );
}
