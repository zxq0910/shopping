import { Card, Empty, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersApi } from '@/api/order';
import type { Order } from '@/types';

const colorMap: Record<string, string> = { pending: 'gold', paid: 'blue', shipped: 'cyan', completed: 'green', cancelled: 'red' };

export default function MyOrdersPage() {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getOrdersApi().then((res) => setList(res.data.list)).finally(() => setLoading(false));
  }, []);

  if (!list.length && !loading) return <Empty description="暂无订单" />;

  return (
    <Card title="我的订单" loading={loading}>
      <Table<Order>
        rowKey="id"
        dataSource={list}
        columns={[
          { title: '订单号', dataIndex: 'id' },
          { title: '金额', dataIndex: 'total_amount', render: (v) => `¥${v}` },
          { title: '状态', dataIndex: 'status', render: (v) => <Tag color={colorMap[v] || 'default'}>{v}</Tag> },
          { title: '收货人', dataIndex: 'receiver_name' },
          { title: '下单时间', dataIndex: 'created_at' },
          { title: '操作', render: (_, row) => <a onClick={() => navigate(`/orders/${row.id}`)}>详情</a> }
        ]}
      />
    </Card>
  );
}
