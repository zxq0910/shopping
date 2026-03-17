const userRepository = require('../repositories/userRepository');
const productRepository = require('../repositories/productRepository');
const orderRepository = require('../repositories/orderRepository');
const AppError = require('../utils/AppError');

async function getUsers(params) {
  const page = Number(params.page || 1);
  const pageSize = Number(params.pageSize || 20);
  return userRepository.listUsers({
    offset: (page - 1) * pageSize,
    limit: pageSize
  });
}

async function getOrders(params) {
  const page = Number(params.page || 1);
  const pageSize = Number(params.pageSize || 20);
  return orderRepository.listAllOrders({
    offset: (page - 1) * pageSize,
    limit: pageSize
  });
}

async function getProducts(params) {
  return productRepository.listProducts(params);
}

async function createProduct(payload) {
  const id = await productRepository.createProduct({
    ...payload,
    source_id: payload.source_id || `manual-${Date.now()}`
  });
  if (Array.isArray(payload.images) && payload.images.length) {
    await productRepository.replaceProductImages(id, payload.images);
  }
  return productRepository.getProductById(id);
}

async function updateProduct(id, payload) {
  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');
  }
  await productRepository.updateProduct(id, payload);
  if (Array.isArray(payload.images)) {
    await productRepository.replaceProductImages(id, payload.images);
  }
  return productRepository.getProductById(id);
}

async function deleteProduct(id) {
  await productRepository.deleteProduct(id);
}

module.exports = {
  getUsers,
  getOrders,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
