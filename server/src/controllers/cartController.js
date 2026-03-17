const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const cartService = require('../services/cartService');

exports.list = asyncHandler(async (req, res) => {
  const result = await cartService.getCart(req.user.id);
  success(res, result);
});

exports.add = asyncHandler(async (req, res) => {
  await cartService.addCart(req.user.id, Number(req.body.product_id), Number(req.body.quantity));
  const result = await cartService.getCart(req.user.id);
  success(res, result, '加入购物车成功');
});

exports.update = asyncHandler(async (req, res) => {
  await cartService.updateCart(req.user.id, Number(req.params.id), Number(req.body.quantity));
  const result = await cartService.getCart(req.user.id);
  success(res, result, '购物车更新成功');
});

exports.remove = asyncHandler(async (req, res) => {
  await cartService.removeCart(req.user.id, Number(req.params.id));
  const result = await cartService.getCart(req.user.id);
  success(res, result, '删除成功');
});
