const bookshelf = require("../bookshelf");

const Product = bookshelf.model("Product", {
  tableName: "products",
  //flavour f indicates that one product has 1 flavour
  //below f is to access the relavant row in flavour
  flavour() {
    return this.belongsTo("Flavour");
  },
  type() {
    return this.belongsTo("Type");
  },
  ingredients() {
    return this.belongsToMany("Ingredient");
  },
});

const Flavour = bookshelf.model("Flavour", {
  tableName: "flavours",
  //products f indicates that 1 flavour can appear in multiple products
  products() {
    return this.hasMany("Product");
  },
});

const Type = bookshelf.model("Type", {
  tableName: "types",
  products() {
    return this.hasMany("Product");
  },
});

const Ingredient = bookshelf.model("Ingredient", {
  tableName: "ingredients",
  products() {
    return this.belongsToMany("Product");
  },
});

/*users */
const User = bookshelf.model("User", {
  tableName: "users",
});

const CartItem = bookshelf.model("CartItem", {
  tableName: "cart_items",
  product() {
    return this.belongsTo("Product");
  },
});

const OrderItem = bookshelf.model("OrderItem", {
  tableName: "order_items",
  product() {
    return this.belongsTo("Product");
  },
  user() {
    return this.belongsTo("User");
  },
});

module.exports = {
  Product,
  Flavour,
  Type,
  Ingredient,
  User,
  CartItem,
  OrderItem,
};
