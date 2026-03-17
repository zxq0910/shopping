const { query } = require('../config/db');

async function upsertProductEmbedding(payload) {
  const existed = await query('SELECT id FROM product_embeddings WHERE product_id = :product_id LIMIT 1', { product_id: payload.product_id });
  if (existed[0]) {
    await query(
      `UPDATE product_embeddings
       SET image_url = :image_url, embedding_json = :embedding_json, created_at = CURRENT_TIMESTAMP
       WHERE product_id = :product_id`,
      payload
    );
    return existed[0].id;
  }
  const result = await query(
    'INSERT INTO product_embeddings (product_id, image_url, embedding_json) VALUES (:product_id, :image_url, :embedding_json)',
    payload
  );
  return result.insertId;
}

async function listEmbeddings() {
  return query(
    `SELECT pe.id, pe.product_id, pe.image_url, pe.embedding_json,
            p.title, p.price, p.thumbnail, p.category, p.rating
     FROM product_embeddings pe
     INNER JOIN products p ON p.id = pe.product_id`
  );
}

module.exports = {
  upsertProductEmbedding,
  listEmbeddings
};
