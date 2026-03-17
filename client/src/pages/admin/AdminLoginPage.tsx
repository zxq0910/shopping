import { Button, Card, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/api/auth';
import { useAppStore } from '@/store/appStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);

  const onFinish = async (values: { email: string; password: string }) => {
    const res = await loginApi(values);
    if (res.data.user.role !== 'admin') {
      message.error('当前账号不是管理员');
      return;
    }
    setAuth(res.data.token, res.data.user);
    navigate('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card title="管理员登录" style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="管理员邮箱" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Button type="primary" htmlType="submit" block>登录</Button>
        </Form>
      </Card>
    </div>
  );
}
