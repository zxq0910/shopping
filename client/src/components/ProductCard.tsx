import { memo } from 'react';
import { Card, Rate, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  onAddCart?: (product: Product) => void;
}

function ProductCardRaw({ product, onAddCart }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      cover={<img className={styles.cover} src={product.thumbnail} alt={product.title} loading="lazy" />}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className={styles.title}>{product.title}</div>
      <div className={styles.meta}>
        <Tag color="blue">{product.category}</Tag>
        <Rate disabled allowHalf value={product.rating} style={{ fontSize: 14 }} />
      </div>
      <div className={styles.footer}>
        <strong>¥{product.price}</strong>
        <Button
          size="small"
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            onAddCart?.(product);
          }}
        >
          加入购物车
        </Button>
      </div>
    </Card>
  );
}

export const ProductCard = memo(ProductCardRaw);
