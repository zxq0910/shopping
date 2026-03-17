const { query } = require('../config/db');

async function findByEmail(email) {
  const rows = await query('SELECT id, username, email, password, role, avatar, created_at, updated_at FROM users WHERE email = :email LIMIT 1', { email });
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query('SELECT id, username, email, role, avatar, created_at, updated_at FROM users WHERE id = :id LIMIT 1', { id });
  return rows[0] || null;
}

async function createUser(payload) {
  const sql = `INSERT INTO users (username, email, password, role, avatar)
               VALUES (:username, :email, :password, :role, :avatar)`;
  const result = await query(sql, payload);
  return result.insertId;
}

async function listUsers({ offset, limit }) {
  const rows = await query(
    `SELECT id, username, email, role, avatar, created_at, updated_at
     FROM users ORDER BY id DESC LIMIT :offset, :limit`,
    { offset, limit }
  );
  const totalRows = await query('SELECT COUNT(*) AS total FROM users');
  return { list: rows, total: totalRows[0].total };
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  listUsers
};
