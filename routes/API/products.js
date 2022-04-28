const express = require("express");
const router = express.Router();

const { getAllProducts } = require("../../dal/products");

router.get("/", async (req, res) => {
  res.send(await getAllProducts());
});

module.exports = router;
