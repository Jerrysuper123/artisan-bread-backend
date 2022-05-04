const { eq } = require("lodash");

const checkIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    //next middleware, there is not middleware, then show the form
    next();
  } else {
    req.flash("error_messages", "You need to sign in to access this page");
    res.redirect("/users/login");
  }
};

const checkIfOwnerAuthenticated = (req, res, next) => {
  console.log("tom role", req.session.user.role);
  if (req.session.user && req.session.user.role === "owner") {
    //next middleware, there is not middleware, then show the form
    next();
  } else {
    req.flash(
      "error_messages",
      "You do not have right access to this. Approach shop owner for this"
    );
    res.redirect("/products");
  }
};

const jwt = require("jsonwebtoken");

const checkIfAuthenticatedJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    //"bearer JWT" - split to get JWT below
    const token = authHeader.split(" ")[1];
    //reverse the token back to human readable info about user
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        return res.sendStatus(403);
      }
      //store decoded user info into req
      req.user = decodedToken;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  checkIfAuthenticated,
  checkIfOwnerAuthenticated,
  checkIfAuthenticatedJWT,
};
