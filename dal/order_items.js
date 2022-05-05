const { OrderItem } = require("../models");

const getAllOrder = async () => {
  return await OrderItem.collection().fetch({
    withRelated: ["product", "product.type", "product.flavour", "user"],
  });
};

const getOrderByUser = async (userId) => {
  return await OrderItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
      withRelated: ["product", "product.type", "product.flavour"],
    });
};

const getOrderItemByUserAndProduct = async (userId, productId) => {
  return await OrderItem.where({
    user_id: userId,
    product_id: productId,
  }).fetch({
    require: false,
  });
};

const getOrderByOrderId = async (orderId) => {
  return await OrderItem.where({
    id: orderId,
    // product_id: productId,
  }).fetch({
    require: false,
  });
};

async function createOrderItem(
  orderDate,
  orderQuantity,
  userId,
  productId,
  shippingAddress
) {
  let orderItem = new OrderItem({
    order_date: orderDate,
    quantity: orderQuantity,
    user_id: userId,
    product_id: productId,
    shipping_address: shippingAddress,
  });
  await orderItem.save();
  return orderItem;
}

async function removeFromOrderByOrderId(orderId) {
  let orderItem = await getOrderByOrderId(orderId);
  if (orderItem) {
    await orderItem.destroy();
    return true;
  }
  return false;
}

async function removeFromOrder(userId, productId) {
  let orderItem = await getOrderItemByUserAndProduct(userId, productId);
  if (orderItem) {
    await orderItem.destroy();
    return true;
  }
  return false;
}

async function updateOrderStatus(orderId, newOrderStatus) {
  let orderItem = await getOrderByOrderId(orderId);
  if (orderItem) {
    orderItem.set("order_status", newOrderStatus);
    await orderItem.save();
    return true;
  }
  return false;
}

module.exports = {
  getAllOrder,
  getOrderByUser,
  getOrderItemByUserAndProduct,
  createOrderItem,
  removeFromOrder,
  updateOrderStatus,
  removeFromOrderByOrderId,
};
