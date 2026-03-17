const app = require('./app');
const { port, autoSyncProducts, db } = require('./config/env');
const { query } = require('./config/db');
const authService = require('./services/authService');
const syncService = require('./services/syncService');

async function bootstrap() {
  await query('SELECT 1');
  await authService.ensureAdminAccount();

  const countRows = await query('SELECT COUNT(*) AS total FROM products');
  const productsCount = Number(countRows[0]?.total || 0);

  if (productsCount === 0 || autoSyncProducts) {
    try {
      await syncService.syncProducts();
      console.log('[sync] 商品同步完成');
    } catch (error) {
      console.warn('[sync] 自动同步失败:', error.message);
    }
  }

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Server bootstrap failed:', error.message);
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error(`[hint] MySQL 账号密码错误，请检查 server/.env: DB_USER=${db.user}, DB_PASSWORD`);
  }
  if (error.code === 'ER_BAD_DB_ERROR') {
    console.error('[hint] 数据库不存在，请先执行: npm run db:init -w server');
  }
  process.exit(1);
});
