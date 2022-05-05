const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");
const { getOrderByUser, getAllOrder } = require("../../dal/order_items");

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
  //cartServices class requires user ID

  let user = req.user;
  console.log(user);
  //   let cart = new CartServices(user.id);
  let orders = await getOrderByUser(user.id);
  res.send({ orders: orders.toJSON() });
});

module.exports = router;
