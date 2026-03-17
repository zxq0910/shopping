const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`接口不存在: ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || '服务器错误'
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = {
  notFound,
  errorHandler
};
