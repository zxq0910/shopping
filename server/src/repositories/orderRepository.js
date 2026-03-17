const { pool, query } = require('../config/db');

async function createOrderWithItems(order, items) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders
        (user_id, total_amount, status, receiver_name, receiver_phone, receiver_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order.user_id, order.total_amount, order.status, order.receiver_name, order.receiver_phone, order.receiver_address]
    );

    const orderId = orderResult.insertId;
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items
          (order_id, product_id, product_title, product_price, quantity, product_image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_title, item.product_price, item.quantity, item.product_image]
      );
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listOrdersByUser(userId) {
  return query(
    `SELECT id, user_id, total_amount, status, receiver_name, receiver_phone, receiver_address, created_at, updated_at
     FROM orders WHERE user_id = :userId ORDER BY id DESC`,
    { userId }
  );
}

async function listAllOrders({ offset, limit }) {
  const rows = await query(
    `SELECT o.id, o.user_id, o.total_amount, o.status, o.receiver_name, o.receiver_phone, o.receiver_address,
            o.created_at, o.updated_at, u.username, u.email
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     ORDER BY o.id DESC LIMIT :offset, :limit`,
    { offset, limit }
  );
  const totalRows = await query('SELECT COUNT(*) AS total FROM orders');
  return { list: rows, total: totalRows[0].total };
}

async function getOrderById(id, userId) {
  const where = userId ? 'id = :id AND user_id = :userId' : 'id = :id';
  const params = userId ? { id, userId } : { id };
  const rows = await query(
    `SELECT id, user_id, total_amount, status, receiver_name, receiver_phone, receiver_address, created_at, updated_at
     FROM orders WHERE ${where} LIMIT 1`,
    params
  );
  const order = rows[0];
  if (!order) return null;

  const items = await query(
    `SELECT id, order_id, product_id, product_title, product_price, quantity, product_image
     FROM order_items WHERE order_id = :id ORDER BY id ASC`,
    { id }
  );
  return { ...order, items };
}

async function updateOrderStatus(id, status) {
  await query('UPDATE orders SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id', { id, status });
}

module.exports = {
  createOrderWithItems,
  listOrdersByUser,
  listAllOrders,
  getOrderById,
  updateOrderStatus
};
