const { query } = require('../config/db');

async function getCartByUser(userId) {
  const rows = await query(
    `SELECT ci.id, ci.product_id, ci.quantity, ci.created_at, ci.updated_at,
            p.title, p.price, p.thumbnail, p.stock
     FROM cart_items ci
     INNER JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = :userId
     ORDER BY ci.id DESC`,
    { userId }
  );
  return rows;
}

async function findCartItem(userId, productId) {
  const rows = await query(
    'SELECT id, user_id, product_id, quantity FROM cart_items WHERE user_id = :userId AND product_id = :productId LIMIT 1',
    { userId, productId }
  );
  return rows[0] || null;
}

async function addCartItem(payload) {
  const result = await query(
    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)',
    payload
  );
  return result.insertId;
}

async function updateCartItem(id, userId, quantity) {
  await query(
    'UPDATE cart_items SET quantity = :quantity, updated_at = CURRENT_TIMESTAMP WHERE id = :id AND user_id = :userId',
    { id, userId, quantity }
  );
}

async function removeCartItem(id, userId) {
  await query('DELETE FROM cart_items WHERE id = :id AND user_id = :userId', { id, userId });
}

async function clearCart(userId) {
  await query('DELETE FROM cart_items WHERE user_id = :userId', { userId });
}

module.exports = {
  getCartByUser,
  findCartItem,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
};
