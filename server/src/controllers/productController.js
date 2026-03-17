const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const syncService = require('../services/syncService');
const productService = require('../services/productService');
const AppError = require('../utils/AppError');

exports.list = asyncHandler(async (req, res) => {
  const result = await productService.listProducts({
    page: Number(req.query.page || 1),
    pageSize: Number(req.query.pageSize || 12),
    keyword: req.query.keyword || '',
    category: req.query.category || '',
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'desc'
  });
  success(res, result);
});

exports.detail = asyncHandler(async (req, res) => {
  const product = await productService.getProductDetail(Number(req.params.id));
  if (!product) throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');
  success(res, product);
});

exports.categories = asyncHandler(async (req, res) => {
  const result = await productService.getCategories();
  success(res, result);
});

exports.search = asyncHandler(async (req, res) => {
  const result = await productService.listProducts({
    page: Number(req.query.page || 1),
    pageSize: Number(req.query.pageSize || 12),
    keyword: req.query.q || '',
    category: req.query.category || '',
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'desc'
  });
  success(res, result);
});

exports.sync = asyncHandler(async (req, res) => {
  const result = await syncService.syncProducts();
  success(res, result, '商品同步完成');
});
