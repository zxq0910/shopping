const productRepository = require('../repositories/productRepository');

async function listProducts(params) {
  return productRepository.listProducts(params);
}

async function getProductDetail(id) {
  return productRepository.getProductById(id);
}

async function getCategories() {
  const rows = await productRepository.listCategories();
  return rows.map((it) => it.category).filter(Boolean);
}

module.exports = {
  listProducts,
  getProductDetail,
  getCategories
};
