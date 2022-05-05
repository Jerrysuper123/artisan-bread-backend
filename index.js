const express = require("express");
const cors = require("cors");
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

// cors has to be enabled before session
app.use(cors());

//use sessions before all routes
app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// app.use(csrf());
const csrfInstance = csrf();
app.use(function (req, res, next) {
  if (
    req.url.slice(0, 5) === "/api/" ||
    req.url === "/api/checkout/process_payment"
  ) {
    return next();
  }
  // only use csrf when url does not include /api/
  csrfInstance(req, res, next);
});

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

  //we only pass csrfToken to hbs when there is, /api/ does not have csrf token
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
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

const landingRoutes = require("./routes/landing");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const cloudinaryRoutes = require("./routes/cloudinary");
const cartRoutes = require("./routes/shoppingCart");
// const checkOutRoutes = require("./routes/API/checkout");
const api = {
  products: require("./routes/API/products"),
  shoppingCart: require("./routes/API/cart"),
  search: require("./routes/API/searchEngine"),
  checkout: require("./routes/API/checkout"),
  users: require("./routes/API/users"),
  order: require("./routes/API/order"),
};
const { checkIfAuthenticated } = require("./middlewares");
async function main() {
  //landing page redirect to /users/login route
  app.use("/", landingRoutes);
  app.use("/products", checkIfAuthenticated, productRoutes);
  app.use("/orders", orderRoutes);
  app.use("/users", userRoutes);
  app.use("/cloudinary", cloudinaryRoutes);
  app.use("/cart", cartRoutes);

  //the above routes parse req.body by caolan form into form.data
  //API route parse req.body into JSON format for API route only
  //express.json() is to parse incoming payload which is json from axios
  app.use("/api/products", express.json(), api.products);
  app.use("/api/cart", express.json(), api.shoppingCart);
  app.use("/api/order", express.json(), api.order);
  app.use("/api/search", express.json(), api.search);
  // webhooks does not work well with express.json(), so do not inlude express.json() on this route
  app.use("/api/checkout", api.checkout);
  app.use("/api/users", express.json(), api.users);
}

main();

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
