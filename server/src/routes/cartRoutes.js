const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');
const { cartCreateValidator, cartUpdateValidator, idParamValidator } = require('../middlewares/validators');

const router = express.Router();

router.use(authenticate);
router.get('/', cartController.list);
router.post('/', cartCreateValidator, validateRequest, cartController.add);
router.put('/:id', cartUpdateValidator, validateRequest, cartController.update);
router.delete('/:id', idParamValidator, validateRequest, cartController.remove);

module.exports = router;
