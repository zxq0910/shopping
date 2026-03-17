const { query } = require('../config/db');

function mapOrderBy(sortBy, sortOrder) {
  const whiteList = {
    price: 'price',
    rating: 'rating',
    created_at: 'created_at'
  };
  const column = whiteList[sortBy] || 'created_at';
  const order = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return `${column} ${order}`;
}

async function listProducts(params) {
  const {
    page = 1,
    pageSize = 12,
    keyword = '',
    category,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = params;

  const offset = (page - 1) * pageSize;
  const where = ['1=1'];
  const sqlParams = { offset, pageSize };

  if (keyword) {
    where.push('(title LIKE :keyword OR description LIKE :keyword OR brand LIKE :keyword)');
    sqlParams.keyword = `%${keyword}%`;
  }

  if (category) {
    where.push('category = :category');
    sqlParams.category = category;
  }

  const orderBy = mapOrderBy(sortBy, sortOrder);

  const rows = await query(
    `SELECT id, title, description, price, stock, category, brand, thumbnail, rating, created_at, updated_at
     FROM products
     WHERE ${where.join(' AND ')}
     ORDER BY ${orderBy}
     LIMIT :offset, :pageSize`,
    sqlParams
  );

  const totalRows = await query(
    `SELECT COUNT(*) AS total FROM products WHERE ${where.join(' AND ')}`,
    sqlParams
  );

  return {
    list: rows,
    total: totalRows[0].total,
    page,
    pageSize
  };
}

async function getProductById(id) {
  const rows = await query(
    `SELECT id, title, description, price, stock, category, brand, thumbnail, rating, source_id, created_at, updated_at
     FROM products WHERE id = :id LIMIT 1`,
    { id }
  );
  const product = rows[0];
  if (!product) return null;

  const images = await query(
    'SELECT id, image_url, sort_order FROM product_images WHERE product_id = :id ORDER BY sort_order ASC, id ASC',
    { id }
  );

  return { ...product, images };
}

async function listCategories() {
  return query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category <> "" ORDER BY category ASC');
}

async function createProduct(payload) {
  const result = await query(
    `INSERT INTO products
      (title, description, price, stock, category, brand, thumbnail, rating, source_id)
     VALUES
      (:title, :description, :price, :stock, :category, :brand, :thumbnail, :rating, :source_id)`,
    payload
  );
  return result.insertId;
}

async function updateProduct(id, payload) {
  await query(
    `UPDATE products SET
      title = :title,
      description = :description,
      price = :price,
      stock = :stock,
      category = :category,
      brand = :brand,
      thumbnail = :thumbnail,
      rating = :rating,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = :id`,
    { ...payload, id }
  );
}

async function deleteProduct(id) {
  await query('DELETE FROM products WHERE id = :id', { id });
}

async function clearAllProducts() {
  await query('DELETE FROM product_images');
  await query('DELETE FROM products');
}

async function upsertSourceProduct(product) {
  const existed = await query('SELECT id FROM products WHERE source_id = :sourceId LIMIT 1', { sourceId: String(product.source_id) });
  if (existed[0]) {
    await query(
      `UPDATE products SET
        title = :title,
        description = :description,
        price = :price,
        stock = :stock,
        category = :category,
        brand = :brand,
        thumbnail = :thumbnail,
        rating = :rating,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id`,
      {
        id: existed[0].id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        thumbnail: product.thumbnail,
        rating: product.rating
      }
    );
    return existed[0].id;
  }

  return createProduct(product);
}

async function replaceProductImages(productId, images = []) {
  await query('DELETE FROM product_images WHERE product_id = :productId', { productId });
  for (let i = 0; i < images.length; i += 1) {
    await query(
      'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (:productId, :image_url, :sort_order)',
      { productId, image_url: images[i], sort_order: i }
    );
  }
}

async function listAllProductsWithImage() {
  return query(
    `SELECT p.id, p.title, p.thumbnail, pi.image_url
     FROM products p
     LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
     ORDER BY p.id ASC`
  );
}

module.exports = {
  listProducts,
  getProductById,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  clearAllProducts,
  upsertSourceProduct,
  replaceProductImages,
  listAllProductsWithImage
};
