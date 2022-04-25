const bookshelf = require("../bookshelf");

const Product = bookshelf.model("Product", {
  tableName: "products",
});

const Flavour = bookshelf.model("Flavour", {
  tableName: "flavours",
});

module.exports = { Product, Flavour };
