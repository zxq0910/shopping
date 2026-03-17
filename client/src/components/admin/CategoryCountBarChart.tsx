import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

interface CategoryCount {
  category: string;
  count: number;
}

interface Props {
  data: CategoryCount[];
}

export function CategoryCountBarChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 24, bottom: 56, top: 24 },
      xAxis: {
        type: 'category',
        data: normalized.map((item) => item.category),
        axisLabel: { rotate: 20 }
      },
      yAxis: { type: 'value', name: '商品数' },
      series: [
        {
          type: 'bar',
          data: normalized.map((item) => item.count),
          barMaxWidth: 36,
          itemStyle: {
            color: '#1677ff',
            borderRadius: [6, 6, 0, 0]
          },
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [normalized]);

  return <div ref={chartRef} style={{ width: '100%', height: 420 }} />;
}
