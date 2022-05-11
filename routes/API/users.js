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

//base url/api/users/register
router.post("/register", async (req, res) => {
  // console.log(req.body);
  try {
    let usernameInput = req.body.username;
    let passwordInput = req.body.password;
    let emailInput = req.body.email;
    console.log(req.body);

    if (validationRegistration(usernameInput, emailInput, passwordInput)) {
      const user = new User({
        username: usernameInput,
        password: getHashedPassword(passwordInput),
        email: emailInput,
      });
      await user.save();
      res.sendStatus(200);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(422);
  }
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

//validate registration
const validationRegistration = (usernameInput, emailInput, passwordInput) => {
  let noValidateError = true;
  // console.log("username", typeof username);

  if (usernameInput === "") {
    console.log("empty string");
    noValidateError = false;
  }

  if (emailInput === "" || !validateEmail(emailInput)) {
    console.log("invalid email");
    noValidateError = false;
  }

  let passw = /^[A-Za-z]\w{7,14}$/;
  if (passwordInput === "" || !String(passwordInput).match(passw)) {
    console.log("invalid password");
    noValidateError = false;
  }

  if (noValidateError) {
    console.log("validated success");
  }

  return noValidateError;
};

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
