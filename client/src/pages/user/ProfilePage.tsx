import { Avatar, Card, Descriptions } from 'antd';
import { useAppStore } from '@/store/appStore';

export default function ProfilePage() {
  const user = useAppStore((s) => s.user);

  return (
    <Card title="个人中心" style={{ maxWidth: 720 }}>
      <Avatar size={72} src={user?.avatar} style={{ marginBottom: 16 }} />
      <Descriptions bordered>
        <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
