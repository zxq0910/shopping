const syncService = require('../services/syncService');
const { query } = require('../config/db');

(async () => {
  try {
    await query('SELECT 1');
    const result = await syncService.syncProducts();
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
