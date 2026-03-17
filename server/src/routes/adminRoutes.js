const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');
const { adminProductValidator, idParamValidator, orderStatusValidator } = require('../middlewares/validators');

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', adminController.users);
router.get('/orders', adminController.orders);
router.put('/orders/:id/status', orderStatusValidator, validateRequest, adminController.updateOrderStatus);
router.get('/products', adminController.products);
router.post('/products', adminProductValidator, validateRequest, adminController.createProduct);
router.put('/products/:id', idParamValidator.concat(adminProductValidator), validateRequest, adminController.updateProduct);
router.delete('/products/:id', idParamValidator, validateRequest, adminController.deleteProduct);

module.exports = router;
