import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createOrderApi } from '@/api/order';

export default function OrderConfirmPage() {
  const navigate = useNavigate();

  const onFinish = async (values: { receiver_name: string; receiver_phone: string; receiver_address: string }) => {
    const res = await createOrderApi(values);
    navigate(`/orders/${res.data.id}`);
  };

  return (
    <Card title="确认订单" style={{ maxWidth: 680 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="receiver_name" label="收货人" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="receiver_phone" label="联系电话" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="receiver_address" label="收货地址" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Typography.Paragraph type="secondary">提交后将根据购物车内容生成订单并清空购物车。</Typography.Paragraph>
        <Button type="primary" htmlType="submit">提交订单</Button>
      </Form>
    </Card>
  );
}
