const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const aiSearchService = require('../services/aiSearchService');
const AppError = require('../utils/AppError');

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('请上传图片', 400, 'FILE_REQUIRED');
  }
  const relativePath = path.join('uploads', req.file.filename).replaceAll('\\', '/');
  success(res, {
    filePath: relativePath,
    url: `/uploads/${req.file.filename}`
  });
});

exports.match = asyncHandler(async (req, res) => {
  const filePath = req.body.filePath;
  if (!filePath) {
    throw new AppError('filePath 不能为空', 400, 'FILE_PATH_REQUIRED');
  }
  const result = await aiSearchService.matchByUploadFile(path.resolve(process.cwd(), filePath), Number(req.body.topN || 10));
  success(res, result);
});
