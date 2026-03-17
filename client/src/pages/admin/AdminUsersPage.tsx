import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { adminUsersApi } from '@/api/admin';

export default function AdminUsersPage() {
  const [list, setList] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminUsersApi({ page: 1, pageSize: 200 }).then((res) => setList(res.data.list)).finally(() => setLoading(false));
  }, []);

  return (
    <Table
      rowKey="id"
      dataSource={list}
      loading={loading}
      virtual
      scroll={{ y: 520 }}
      columns={[
        { title: 'ID', dataIndex: 'id', width: 90 },
        { title: '用户名', dataIndex: 'username', width: 160 },
        { title: '邮箱', dataIndex: 'email', width: 280 },
        { title: '角色', dataIndex: 'role', width: 120 },
        { title: '创建时间', dataIndex: 'created_at' }
      ]}
    />
  );
}
