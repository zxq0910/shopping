import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DashboardOutlined, ShoppingOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ padding: 16, fontWeight: 700 }}>后台管理</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/admin', icon: <DashboardOutlined />, label: '控制台' },
            { key: '/admin/products', icon: <ShoppingOutlined />, label: '商品管理' },
            { key: '/admin/orders', icon: <OrderedListOutlined />, label: '订单管理' },
            { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理' }
          ]}
        />
      </Sider>
      <Content style={{ padding: 16 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
