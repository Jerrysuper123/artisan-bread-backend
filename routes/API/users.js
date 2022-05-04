const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      username: user.get("username"),
      id: user.get("id"),
      email: user.get("email"),
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const { User } = require("../../models");

//base url/api/users/login
router.post("/login", async (req, res) => {
  let user = await User.where({
    email: req.body.email,
  }).fetch({
    require: false,
  });

  //compare password, if there is such email in db
  if (user && user.get("password") == getHashedPassword(req.body.password)) {
    //generate access token and send over api
    let accessToken = generateAccessToken(user);
    res.send({
      accessToken,
    });
  } else {
    res.send({
      error: "Wrong email or password",
    });
  }
});

//base url/api/users/profile
//if authenticated, req.user = decoded user info from JWT
router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
  const user = req.user;
  res.send(user);
});

module.exports = router;
