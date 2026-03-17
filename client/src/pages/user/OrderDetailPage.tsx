import { Card, Descriptions, Empty, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetailApi } from '@/api/order';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderDetailApi(Number(id)).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (!order && !loading) return <Empty description="订单不存在" />;

  return (
    <Card title={`订单详情 #${id}`} loading={loading}>
      {order && (
        <>
          <Descriptions bordered>
            <Descriptions.Item label="订单金额">¥{order.total_amount}</Descriptions.Item>
            <Descriptions.Item label="状态">{order.status}</Descriptions.Item>
            <Descriptions.Item label="收货人">{order.receiver_name}</Descriptions.Item>
            <Descriptions.Item label="电话">{order.receiver_phone}</Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>{order.receiver_address}</Descriptions.Item>
          </Descriptions>
          <Table style={{ marginTop: 16 }} rowKey="id" pagination={false} dataSource={order.items || []} columns={[
            { title: '商品', dataIndex: 'product_title' },
            { title: '单价', dataIndex: 'product_price', render: (v) => `¥${v}` },
            { title: '数量', dataIndex: 'quantity' },
            { title: '小计', render: (_, row) => `¥${(Number(row.product_price) * Number(row.quantity)).toFixed(2)}` }
          ]} />
        </>
      )}
    </Card>
  );
}
