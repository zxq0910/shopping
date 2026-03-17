const fs = require('fs');
const path = require('path');
const { uploadDir } = require('../config/env');

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

function getUploadPath(fileName) {
  return path.join(uploadDir, fileName);
}

module.exports = {
  ensureUploadDir,
  getUploadPath
};
