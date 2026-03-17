import { Layout, Menu, Badge, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ShoppingCartOutlined, UserOutlined, CameraOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/appStore';
import { getCartApi } from '@/api/cart';
import styles from './UserLayout.module.css';

const { Header, Content } = Layout;

export function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useAppStore((s) => s.cartItems.length);
  const logout = useAppStore((s) => s.logout);
  const setCart = useAppStore((s) => s.setCart);

  useEffect(() => {
    getCartApi().then((res) => setCart(res.data.list, res.data.total)).catch(() => undefined);
  }, [setCart]);

  const selected = location.pathname.startsWith('/products')
    ? '/products'
    : location.pathname.startsWith('/orders')
    ? '/orders'
    : location.pathname;

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>Shop React</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selected]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/', icon: <HomeOutlined />, label: '首页' },
            { key: '/products', icon: <UnorderedListOutlined />, label: '商品' },
            { key: '/ai-search', icon: <CameraOutlined />, label: 'AI 识图' },
            { key: '/orders', icon: <UserOutlined />, label: '我的订单' },
            {
              key: '/cart',
              icon: (
                <Badge count={cartCount} size="small">
                  <ShoppingCartOutlined />
                </Badge>
              ),
              label: '购物车'
            }
          ]}
        />
        <Button onClick={() => { logout(); navigate('/login'); }}>退出</Button>
      </Header>
      <Content className={styles.content}><Outlet /></Content>
    </Layout>
  );
}
