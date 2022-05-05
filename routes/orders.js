const express = require("express");
const router = express.Router();
const { createSearchOrderForm, bootstrapField } = require("../forms");
const { OrderItem, User } = require("../models");
const {
  getAllOrder,
  removeFromOrderByOrderId,
  updateOrderStatus,
} = require("../dal/order_items");

router.get("/", async (req, res) => {
  // console.log(allOrder.toJSON());
  let searchForm = createSearchOrderForm();

  let o = OrderItem.collection();

  searchForm.handle(req, {
    empty: async (form) => {
      let orders = await o.fetch({
        withRelated: ["product", "product.type", "product.flavour", "user"],
      });
      res.render("orders/index", {
        orders: orders.toJSON(),
        form: searchForm.toHTML(bootstrapField),
      });
    },
    error: async (form) => {
      let orders = await o.fetch({
        withRelated: ["product", "product.type", "product.flavour", "user"],
      });
      res.render("orders/index", {
        orders: orders.toJSON(),
        form: searchForm.toHTML(bootstrapField),
      });
    },
    success: async (form) => {
      if (form.data.date) {
        o = o.where("order_date", "like", "%" + req.query.date + "%");
      }
      if (form.data.order_status) {
        console.log(form.data.order_status);
        o = o.where("order_status", "like", "%" + req.query.order_status + "%");
      }
      //for user might need to loop thru user table and return the user id
      if (form.data.user_name) {
        let userCollection = await User.collection();

        userCollection = userCollection.where(
          "username",
          "like",
          "%" + req.query.user_name + "%"
        );
        let userRow = await userCollection.fetch();
        let userId = userRow.toJSON()[0].id;
        // console.log(userId);
        o = o.where("user_id", "=", userId);
      }
      let orders = await o.fetch({
        withRelated: ["product", "product.type", "product.flavour", "user"],
      });
      res.render("orders/index", {
        orders: orders.toJSON(),
        form: searchForm.toHTML(bootstrapField),
      });
    },
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
