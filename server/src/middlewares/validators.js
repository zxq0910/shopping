const { body, query, param } = require('express-validator');

const registerValidator = [
  body('username').trim().isLength({ min: 2, max: 32 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 64 })
];

const loginValidator = [body('email').isEmail(), body('password').isLength({ min: 6, max: 64 })];

const productListValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('keyword').optional().isString(),
  query('category').optional().isString(),
  query('sortBy').optional().isIn(['price', 'rating', 'created_at']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

const idParamValidator = [param('id').isInt({ min: 1 })];

const cartCreateValidator = [
  body('product_id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1, max: 100 })
];

const cartUpdateValidator = [
  param('id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 0, max: 100 })
];

const orderCreateValidator = [
  body('receiver_name').trim().isLength({ min: 2, max: 50 }),
  body('receiver_phone').trim().isLength({ min: 6, max: 30 }),
  body('receiver_address').trim().isLength({ min: 6, max: 255 })
];

const adminProductValidator = [
  body('title').isString().isLength({ min: 1, max: 255 }),
  body('description').optional().isString(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('category').isString().isLength({ min: 1, max: 120 }),
  body('brand').optional().isString(),
  body('thumbnail').optional().isString(),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('images').optional().isArray()
];

const orderStatusValidator = [
  param('id').isInt({ min: 1 }),
  body('status').isIn(['pending', 'paid', 'shipped', 'completed', 'cancelled'])
];

module.exports = {
  registerValidator,
  loginValidator,
  productListValidator,
  idParamValidator,
  cartCreateValidator,
  cartUpdateValidator,
  orderCreateValidator,
  adminProductValidator,
  orderStatusValidator
};
