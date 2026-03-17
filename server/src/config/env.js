const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const rawOrigins = process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:5174';
const clientOrigins = rawOrigins
  .split(',')
  .map((it) => it.trim())
  .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: clientOrigins[0] || 'http://localhost:5173',
  clientOrigins,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shopping_platform',
    connectionLimit: 10
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  adminSeed: {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456'
  },
  productSyncUrl: process.env.PRODUCT_SYNC_URL || 'https://dummyjson.com/products?limit=100',
  autoSyncProducts: String(process.env.AUTO_SYNC_PRODUCTS || 'false').toLowerCase() === 'true',
  uploadDir: path.resolve(process.cwd(), 'uploads')
};
