const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');
const { productListValidator, idParamValidator } = require('../middlewares/validators');

const router = express.Router();

router.get('/', productListValidator, validateRequest, productController.list);
router.get('/categories', productController.categories);
router.get('/search', productController.search);
router.get('/:id', idParamValidator, validateRequest, productController.detail);
router.post('/sync', authenticate, authorizeAdmin, productController.sync);

module.exports = router;
