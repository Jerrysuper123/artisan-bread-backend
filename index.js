const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

//use sessions before all routes
app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(csrf());
// middleware to handle csrf error, first arg is the error
app.use(function (err, req, res, next) {
  //if the error code is whatever, we flash the message then redirect back
  //below error is a specific error for custom error message

  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_messages", "The form has expired. Please try again");
    //it is like press back button in browser
    res.redirect("back");
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  //req.csrfToken generates a new token
  //then made available to res hbs
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());

//use flash for all req, res
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

//passing user info to all hbs pages
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cloudinaryRoutes = require("./routes/cloudinary");
const { checkIfAuthenticated } = require("./middlewares");
async function main() {
  //   app.get("/", (req, res) => {
  //     res.send("alive");
  //   });
  app.use("/admin", adminRoutes);
  app.use("/products", checkIfAuthenticated, productRoutes);
  app.use("/users", userRoutes);
  app.use("/cloudinary", cloudinaryRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
