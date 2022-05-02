const express = require("express");
const router = express.Router();
const {
  getAllOrder,
  removeFromOrderByOrderId,
  updateOrderStatus,
} = require("../dal/order_items");

router.get("/", async (req, res) => {
  let allOrder = await getAllOrder();
  console.log(allOrder.toJSON());
  res.render("orders/index", {
    orders: allOrder.toJSON(),
  });
});

router.get("/:orderId/delete", async (req, res) => {
  await removeFromOrderByOrderId(req.params.orderId);
  req.flash("success_messages", "Order item has been removed");
  res.redirect("/orders");
});

router.post("/orderstatus/:orderId/update", async (req, res) => {
  let newOrderStatus = req.body.order_status;
  // console.log("new", newOrderStatus);
  await updateOrderStatus(req.params.orderId, newOrderStatus);
  req.flash("success_messages", "Order status has been updated");
  res.redirect("/orders");
});

module.exports = router;
