const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');
const { ORDER_STATUS } = require('../models/constants');
const AppError = require('../utils/AppError');

async function createOrder(userId, payload) {
  const cartItems = await cartRepository.getCartByUser(userId);
  if (!cartItems.length) {
    throw new AppError('购物车为空，无法下单', 400, 'CART_EMPTY');
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  const orderItems = cartItems.map((item) => ({
    product_id: item.product_id,
    product_title: item.title,
    product_price: item.price,
    quantity: item.quantity,
    product_image: item.thumbnail
  }));

  const orderId = await orderRepository.createOrderWithItems(
    {
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      receiver_name: payload.receiver_name,
      receiver_phone: payload.receiver_phone,
      receiver_address: payload.receiver_address
    },
    orderItems
  );

  await cartRepository.clearCart(userId);
  return orderRepository.getOrderById(orderId, userId);
}

async function listOrders(user) {
  if (user.role === 'admin') {
    return orderRepository.listAllOrders({ offset: 0, limit: 200 });
  }
  const list = await orderRepository.listOrdersByUser(user.id);
  return { list, total: list.length };
}

async function getOrderDetail(user, id) {
  const order = await orderRepository.getOrderById(id, user.role === 'admin' ? null : user.id);
  if (!order) {
    throw new AppError('订单不存在', 404, 'ORDER_NOT_FOUND');
  }
  return order;
}

async function changeOrderStatus(id, status) {
  if (!ORDER_STATUS.includes(status)) {
    throw new AppError('订单状态非法', 400, 'ORDER_STATUS_INVALID');
  }
  await orderRepository.updateOrderStatus(id, status);
}

module.exports = {
  createOrder,
  listOrders,
  getOrderDetail,
  changeOrderStatus
};
