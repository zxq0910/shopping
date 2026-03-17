import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '@/api/auth';
import { useAppStore } from '@/store/appStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);

  const onFinish = async (values: { username: string; email: string; password: string }) => {
    const res = await registerApi(values);
    setAuth(res.data.token, res.data.user);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card style={{ width: 420 }}>
        <Typography.Title level={3}>用户注册</Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Button htmlType="submit" type="primary" block>
            注册
          </Button>
          <div style={{ marginTop: 12 }}>
            已有账号？<Link to="/login">去登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
