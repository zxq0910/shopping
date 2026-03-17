const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../utils/AppError');

async function getCart(userId) {
  const list = await cartRepository.getCartByUser(userId);
  const total = list.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  return { list, total };
}

async function addCart(userId, productId, quantity) {
  const product = await productRepository.getProductById(productId);
  if (!product) throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');

  const existed = await cartRepository.findCartItem(userId, productId);
  if (existed) {
    await cartRepository.updateCartItem(existed.id, userId, existed.quantity + quantity);
    return existed.id;
  }

  return cartRepository.addCartItem({ user_id: userId, product_id: productId, quantity });
}

async function updateCart(userId, id, quantity) {
  if (quantity <= 0) {
    await cartRepository.removeCartItem(id, userId);
    return;
  }
  await cartRepository.updateCartItem(id, userId, quantity);
}

async function removeCart(userId, id) {
  await cartRepository.removeCartItem(id, userId);
}

module.exports = {
  getCart,
  addCart,
  updateCart,
  removeCart
};
