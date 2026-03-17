const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { db } = require('../config/env');

(async () => {
  let sql = fs.readFileSync(path.resolve(__dirname, '../../../sql/seed.sql'), 'utf8');
  sql = sql.replace(/shopping_platform/g, db.database);

  const connection = await mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    multipleStatements: true
  });

  try {
    await connection.query(sql);
    console.log(`Seed data imported successfully into: ${db.database}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed import failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
})();
