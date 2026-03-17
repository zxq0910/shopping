const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const orderService = require('../services/orderService');

exports.create = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder(req.user.id, req.body);
  success(res, result, '下单成功');
});

exports.list = asyncHandler(async (req, res) => {
  const result = await orderService.listOrders(req.user);
  success(res, result);
});

exports.detail = asyncHandler(async (req, res) => {
  const result = await orderService.getOrderDetail(req.user, Number(req.params.id));
  success(res, result);
});
