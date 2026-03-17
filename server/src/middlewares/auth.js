const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { jwt: jwtConfig } = require('../config/env');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError('未登录或 token 缺失', 401, 'UNAUTHORIZED'));
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError('token 无效或已过期', 401, 'TOKEN_INVALID'));
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('需要管理员权限', 403, 'FORBIDDEN'));
  }
  return next();
}

module.exports = {
  authenticate,
  authorizeAdmin
};
