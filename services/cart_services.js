const cartDataLayer = require("../dal/cart_items");

class CartServices {
  constructor(user_id) {
    this.user_id = user_id;
  }

  async addToCart(productId, quantity) {
    let cartItem = await cartDataLayer.getCartItemByUserAndProduct(
      this.user_id,
      productId
    );

    if (cartItem) {
      return await cartDataLayer.updateQuantity(
        this.user_id,
        productId,
        // something is a bit weird here
        cartItem.get("quantity") + 1
      );
    } else {
      let newCartItem = cartDataLayer.createCartItem(
        this.user_id,
        productId,
        quantity
      );
      return newCartItem;
    }
  }

  async remove(productId) {
    return await cartDataLayer.removeFromCart(this.user_id, productId);
  }

  async clearCartByUser() {
    let cartItems = (await cartDataLayer.getCart(this.user_id)).toJSON();
    if (cartItems) {
      let productIdArray = [];
      for (let item of cartItems) {
        productIdArray.push(item.product_id);
      }

      for (let productId of productIdArray) {
        await this.remove(productId);
      }
    }
  }

  async setQuantity(productId, quantity) {
    return await cartDataLayer.updateQuantity(
      this.user_id,
      productId,
      quantity
    );
  }

  async getCart() {
    return await cartDataLayer.getCart(this.user_id);
  }
}

module.exports = CartServices;
