const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");

// const CartServices = require('../services/cart_services');
const CartServices = require("../../services/cart_services");

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
  //cartServices class requires user ID
  let user = req.user;
  console.log(user);
  //   let cart = new CartServices(req.session.user.id);
  // default to 2 who is tom
  let cart = new CartServices(user.id);
  res.send(
    //below getCart is a function in class to get all related data from db
    (await cart.getCart()).toJSON()
  );
});

router.get("/:product_id/add", checkIfAuthenticatedJWT, async (req, res) => {
  //   let cart = new CartServices(req.session.user.id);
  let user = req.user;
  console.log(user);
  let cart = new CartServices(user.id);
  console.log("from api", req.params.product_id);
  await cart.addToCart(req.params.product_id, 1);
  res.sendStatus(200);
});

router.get("/:product_id/remove", checkIfAuthenticatedJWT, async (req, res) => {
  //   let cart = new CartServices(req.session.user.id);
  let user = req.user;
  let cart = new CartServices(user.id);
  //params is in the url /id/remove when user clicked remove button
  await cart.remove(req.params.product_id);
  res.sendStatus(200);
});

router.post(
  "/:product_id/quantity/update",
  checkIfAuthenticatedJWT,
  async (req, res) => {
    //   let cart = new CartServices(req.session.user.id);
    let user = req.user;
    let cart = new CartServices(user.id);
    //update the quantity of the product
    console.log("fromAPI", req.body);

    await cart.setQuantity(req.params.product_id, req.body.newQuantity);
    res.sendStatus(200);
  }
);

module.exports = router;
