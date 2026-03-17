import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div style={{ minHeight: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size="large" />
    </div>
  );
}
