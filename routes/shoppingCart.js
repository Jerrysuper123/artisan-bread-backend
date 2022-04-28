const express = require("express");
const router = express.Router();

// const CartServices = require('../services/cart_services');
const CartServices = require("../services/cart_services");

router.get("/", async (req, res) => {
  //cartServices class requires user ID
  let cart = new CartServices(req.session.user.id);
  res.render("carts/index", {
    //below getCart is a function in class to get all related data from db
    shoppingCart: (await cart.getCart()).toJSON(),
  });
});

router.get("/:product_id/add", async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  await cart.addToCart(req.params.product_id, 1);
  req.flash("success_messages", "Successfully added to cart");
  res.redirect("/products");
});

router.get("/:product_id/remove", async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  //params is in the url /id/remove when user clicked remove button
  await cart.remove(req.params.product_id);
  req.flash("success_messages", "Item has been removed");
  res.redirect("/cart");
});

router.post("/:product_id/quantity/update", async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  //update the quantity of the product

  await cart.setQuantity(req.params.product_id, req.body.newQuantity);
  req.flash("success_messages", "Quantity updated");
  res.redirect("/cart");
});

module.exports = router;
