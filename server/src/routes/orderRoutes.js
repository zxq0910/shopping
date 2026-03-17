const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');
const { orderCreateValidator, idParamValidator } = require('../middlewares/validators');

const router = express.Router();

router.use(authenticate);
router.post('/', orderCreateValidator, validateRequest, orderController.create);
router.get('/', orderController.list);
router.get('/:id', idParamValidator, validateRequest, orderController.detail);

module.exports = router;
