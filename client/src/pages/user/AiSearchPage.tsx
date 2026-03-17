import { Button, Card, Empty, Space, Table, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { useState } from 'react';
import { matchImageApi, uploadImageApi } from '@/api/aiSearch';

interface MatchItem {
  product_id: number;
  title: string;
  price: number;
  thumbnail: string;
  similarity: number;
}

export default function AiSearchPage() {
  const [filePath, setFilePath] = useState('');
  const [list, setList] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const props: UploadProps = {
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const res = await uploadImageApi(file as File);
        setFilePath(res.data.filePath);
        onSuccess?.(res, new XMLHttpRequest());
      } catch (error) {
        onError?.(error as Error);
      }
    }
  };

  return (
    <Card title="AI 图片搜商品">
      <Space direction="vertical" size={12}>
        <Upload {...props}><Button>上传图片</Button></Upload>
        <Button type="primary" disabled={!filePath} loading={loading} onClick={async () => {
          setLoading(true);
          try {
            const res = await matchImageApi({ filePath, topN: 10 });
            setList(res.data);
          } finally {
            setLoading(false);
          }
        }}>开始匹配</Button>
      </Space>
      {!list.length ? <Empty style={{ marginTop: 20 }} description="上传图片后进行匹配" /> : (
        <Table style={{ marginTop: 20 }} rowKey="product_id" dataSource={list} pagination={false} columns={[
          { title: '图片', dataIndex: 'thumbnail', render: (v) => <img src={v} style={{ width: 56, height: 56, objectFit: 'cover' }} loading="lazy" /> },
          { title: '商品', dataIndex: 'title' },
          { title: '价格', dataIndex: 'price', render: (v) => `¥${v}` },
          { title: '相似度', dataIndex: 'similarity' }
        ]} />
      )}
    </Card>
  );
}
