const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const authService = require('../services/authService');

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  success(res, result, '注册成功');
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  success(res, result, '登录成功');
});

exports.profile = asyncHandler(async (req, res) => {
  const result = await authService.profile(req.user.id);
  success(res, result);
});
