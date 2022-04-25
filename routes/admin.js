const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/orders", (req, res) => {
  res.render("admin/orders");
});

router.get("/products", (req, res) => {
  res.render("admin/products");
});

router.get("/users", (req, res) => {
  res.render("admin/users");
});

module.exports = router;
