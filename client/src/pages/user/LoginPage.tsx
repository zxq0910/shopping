import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi, profileApi } from '@/api/auth';
import { useAppStore } from '@/store/appStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);

  const onFinish = async (values: { email: string; password: string }) => {
    const res = await loginApi(values);
    setAuth(res.data.token, res.data.user);
    const profile = await profileApi();
    setAuth(res.data.token, profile.data);
    navigate(profile.data.role === 'admin' ? '/admin' : '/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card style={{ width: 380 }}>
        <Typography.Title level={3}>用户登录</Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Button htmlType="submit" type="primary" block>
            登录
          </Button>
          <div style={{ marginTop: 12 }}>
            还没有账号？<Link to="/register">去注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
