const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('参数校验失败', 422, JSON.stringify(errors.array())));
  }
  return next();
}

module.exports = { validateRequest };
