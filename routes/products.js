const express = require("express");
const router = express.Router();
const { Product } = require("../models");

router.get("/", async (req, res) => {
  // console.log("product class", Product);
  let products = await Product.collection().fetch();
  res.render("admin/products", {
    products: products.toJSON(),
  });
});

module.exports = router;
