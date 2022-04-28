const express = require("express");
const router = express.Router();

// const CartServices = require('../services/cart_services');
const CartServices = require("../../services/cart_services");

router.get("/", async (req, res) => {
  //cartServices class requires user ID
  //   let cart = new CartServices(req.session.user.id);
  // default to 2 who is tom
  let cart = new CartServices(2);
  res.send(
    //below getCart is a function in class to get all related data from db
    (await cart.getCart()).toJSON()
  );
});

router.get("/:product_id/add", async (req, res) => {
  //   let cart = new CartServices(req.session.user.id);
  let cart = new CartServices(2);
  console.log("from api", req.params.product_id);
  await cart.addToCart(req.params.product_id, 1);
});

router.get("/:product_id/remove", async (req, res) => {
  //   let cart = new CartServices(req.session.user.id);
  let cart = new CartServices(2);
  //params is in the url /id/remove when user clicked remove button
  await cart.remove(req.params.product_id);
});

router.post("/:product_id/quantity/update", async (req, res) => {
  //   let cart = new CartServices(req.session.user.id);
  let cart = new CartServices(2);
  //update the quantity of the product
  console.log("fromAPI", req.body);

  await cart.setQuantity(req.params.product_id, req.body.newQuantity);
});

module.exports = router;
