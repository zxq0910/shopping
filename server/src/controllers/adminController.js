const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const adminService = require('../services/adminService');
const orderService = require('../services/orderService');

exports.users = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  success(res, result);
});

exports.orders = asyncHandler(async (req, res) => {
  const result = await adminService.getOrders(req.query);
  success(res, result);
});

exports.products = asyncHandler(async (req, res) => {
  const result = await adminService.getProducts({
    page: Number(req.query.page || 1),
    pageSize: Number(req.query.pageSize || 20),
    keyword: req.query.keyword || '',
    category: req.query.category || '',
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'desc'
  });
  success(res, result);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const result = await adminService.createProduct(req.body);
  success(res, result, '新增商品成功');
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const result = await adminService.updateProduct(Number(req.params.id), req.body);
  success(res, result, '商品更新成功');
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await adminService.deleteProduct(Number(req.params.id));
  success(res, true, '商品删除成功');
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  await orderService.changeOrderStatus(Number(req.params.id), req.body.status);
  success(res, true, '订单状态已更新');
});
