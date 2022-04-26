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

module.exports = {
  checkIfAuthenticated,
  checkIfOwnerAuthenticated,
};
