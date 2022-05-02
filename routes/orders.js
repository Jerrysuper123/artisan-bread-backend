const express = require("express");
const router = express.Router();
const { getAllOrder } = require("../dal/order_items");

router.get("/", async (req, res) => {
  let allOrder = await getAllOrder();
  console.log(allOrder.toJSON());
  res.render("orders/index", {
    orders: allOrder.toJSON(),
  });
});

module.exports = router;
