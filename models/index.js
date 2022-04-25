const bookshelf = require("../bookshelf");

const Product = bookshelf.model("Product", {
  tableName: "products",
  //flavour f indicates that one product has 1 flavour
  flavour() {
    return this.belongsTo("Flavour");
  },
});

const Flavour = bookshelf.model("Flavour", {
  tableName: "flavours",
  //products f indicates that 1 flavour can appear in multiple products
  products() {
    return this.hasMany("Product");
  },
});

module.exports = { Product, Flavour };
