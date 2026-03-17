import { Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { adminOrdersApi, adminUpdateOrderStatusApi } from '@/api/admin';

const options = ['pending', 'paid', 'shipped', 'completed', 'cancelled'].map((s) => ({ label: s, value: s }));

export default function AdminOrdersPage() {
  const [list, setList] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await adminOrdersApi({ page: 1, pageSize: 100 });
      setList(res.data.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={list}
      columns={[
        { title: '订单号', dataIndex: 'id' },
        { title: '用户', dataIndex: 'username' },
        { title: '金额', dataIndex: 'total_amount', render: (v) => `¥${v}` },
        { title: '状态', dataIndex: 'status', render: (v) => <Tag>{v}</Tag> },
        { title: '变更状态', render: (_, row) => <Select style={{ width: 140 }} options={options} value={row.status} onChange={async (status) => {
          await adminUpdateOrderStatusApi(row.id, status);
          fetchList();
        }} /> }
      ]}
    />
  );
}
