const { CartItem } = require("../models");

const getCart = async (userId) => {
  return await CartItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
      withRelated: ["product", "product.type", "product.flavour"],
    });
};

const getCartItemByUserAndProduct = async (userId, productId) => {
  return await CartItem.where({
    user_id: userId,
    product_id: productId,
  }).fetch({
    require: false,
  });
};

const getCartByUserId = async (userId) => {
  // collection is to return multiple rows
  return await CartItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
    });
};

//this remove all cartItem by userId
async function removeFromCartByUserId(userId) {
  let cartItems = await getCartByUserId(userId);
  console.log("DAL cartItems", cartItems);
  if (cartItems) {
    await cartItems.destroy();
    console.log("Dal", "deleted cart by user iD");
    return true;
  }
  return false;
}

async function createCartItem(userId, productId, quantity) {
  let cartItem = new CartItem({
    user_id: userId,
    product_id: productId,
    quantity: quantity,
  });
  await cartItem.save();
  return cartItem;
}

async function removeFromCart(userId, productId) {
  let cartItem = await getCartItemByUserAndProduct(userId, productId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
}

async function updateQuantity(userId, productId, newQuantity) {
  //check business logics here, that there is enough stock etc.

  let cartItem = await getCartItemByUserAndProduct(userId, productId);

  if (cartItem) {
    cartItem.set("quantity", newQuantity);
    await cartItem.save();
    return true;
  }
  return false;
}

module.exports = {
  getCart,
  getCartItemByUserAndProduct,
  createCartItem,
  removeFromCart,
  updateQuantity,
  removeFromCartByUserId,
};
