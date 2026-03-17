import { useEffect } from 'react';
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { adminUpdateProductApi } from '@/api/admin';
import { getProductDetailApi } from '@/api/product';

interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  thumbnail: string;
  rating?: number;
  images?: string;
}

export default function AdminProductEditPage() {
  const [form] = Form.useForm<ProductFormValues>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getProductDetailApi(Number(id)).then((res) => {
      form.setFieldsValue({
        ...res.data,
        images: (res.data.images || []).map((it) => it.image_url).join('\n')
      });
    });
  }, [id, form]);

  const onFinish = async (values: ProductFormValues) => {
    if (!id) return;
    const images = String(values.images || '').split('\n').map((it) => it.trim()).filter(Boolean);
    await adminUpdateProductApi(Number(id), { ...values, images, rating: Number(values.rating || 0) });
    navigate('/admin/products');
  };

  return (
    <Card title={`编辑商品 #${id}`}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="商品标题" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="price" label="价格" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="stock" label="库存" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="category" label="分类" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="brand" label="品牌"><Input /></Form.Item>
        <Form.Item name="thumbnail" label="缩略图 URL" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="rating" label="评分"><InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="images" label="图片 URL（每行一个）"><Input.TextArea rows={4} /></Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form>
    </Card>
  );
}
