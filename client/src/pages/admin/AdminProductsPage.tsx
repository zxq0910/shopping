import { useEffect, useState } from 'react';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { adminDeleteProductApi, adminProductsApi } from '@/api/admin';
import { syncProductsApi } from '@/api/product';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await adminProductsApi({ page: 1, pageSize: 100, keyword });
      setList(res.data.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [keyword]);

  return (
    <Card
      title="商品管理"
      extra={<Space>
        <Button onClick={() => navigate('/admin/products/new')} type="primary">新增商品</Button>
        <Button onClick={async () => { await syncProductsApi(); fetchList(); }}>同步远程商品</Button>
      </Space>}
    >
      <Input.Search placeholder="搜索商品" allowClear onSearch={setKeyword} style={{ marginBottom: 12, width: 260 }} />
      <Table<Product>
        rowKey="id"
        loading={loading}
        dataSource={list}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 80 },
          { title: '商品名', dataIndex: 'title' },
          { title: '价格', dataIndex: 'price', render: (v) => `¥${v}` },
          { title: '库存', dataIndex: 'stock' },
          { title: '分类', dataIndex: 'category' },
          { title: '操作', render: (_, row) => <Space>
              <a onClick={() => navigate(`/admin/products/${row.id}/edit`)}>编辑</a>
              <Popconfirm title="确认删除该商品？" onConfirm={async () => { await adminDeleteProductApi(row.id); fetchList(); }}>
                <a>删除</a>
              </Popconfirm>
            </Space> }
        ]}
      />
    </Card>
  );
}
