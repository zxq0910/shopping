const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { db } = require('../config/env');

async function runSqlFile(relativePath) {
  const sqlPath = path.resolve(__dirname, relativePath);
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Allow reusing SQL with a custom DB_NAME from .env
  sql = sql.replace(/shopping_platform/g, db.database);

  const connection = await mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    multipleStatements: true
  });

  try {
    await connection.query(sql);
  } finally {
    await connection.end();
  }
}

(async () => {
  try {
    await runSqlFile('../../../sql/init.sql');
    console.log(`Database initialized successfully: ${db.database}`);
    process.exit(0);
  } catch (error) {
    console.error('Database init failed:', error.message);
    process.exit(1);
  }
})();
