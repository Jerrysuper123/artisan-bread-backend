const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("landing page");
});

module.exports = router;