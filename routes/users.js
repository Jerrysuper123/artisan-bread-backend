const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require("../models");

const {
  createRegistrationForm,
  createLoginForm,
  bootstrapField,
} = require("../forms");

router.get("/register", (req, res) => {
  // display the registration form
  const registerForm = createRegistrationForm();
  res.render("users/register", {
    form: registerForm.toHTML(bootstrapField),
  });
});

router.post("/register", (req, res) => {
  const registerForm = createRegistrationForm();

  registerForm.handle(req, {
    //my guess: req.body = form.data
    success: async (form) => {
      const user = new User({
        //we do not need “confirmed_password”, so we type all out
        username: form.data.username,
        password: form.data.password,
        email: form.data.email,
      });
      await user.save();
      //show flash message to user when created successfully
      req.flash("success_messages", "User signed up successfully!");
      res.redirect("/users/login");
    },
    //display the form again validator errors to users
    error: (form) => {
      res.render("users/register", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

/*for user login */
router.get("/login", (req, res) => {
  const loginForm = createLoginForm();
  res.render("users/login", {
    form: loginForm.toHTML(bootstrapField),
  });
});

router.post("/login", async (req, res) => {
  const loginForm = createLoginForm();

  loginForm.handle(req, {
    success: async (form) => {
      // process the login

      // ...find the user by email and password
      let user = await User.where({
        email: form.data.email,
      }).fetch({
        //if required: true if there is no error, it will throw the exception, i want to handle the error below
        require: false,
      });

      if (!user) {
        req.flash(
          "error_messages",
          "Sorry, the authentication details you provided does not work."
        );

        //below should be
        res.redirect("/users/login");
      } else {
        // check if the password matches

        if (user.get("password") === form.data.password) {
          // add to the session that login succeed

          // store the user details
          req.session.user = {
            //technically we just need session id
            //the session will store user info when user log in successfully
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email"),
          };
          req.flash(
            "success_messages",
            "Welcome back, " + user.get("username")
          );
          //if success you can redirect it back to anywhere you want
          //below should be req.redirect();
          res.redirect("/products");
        } else {
          req.flash(
            "error_messages",
            "Sorry, the authentication details you provided does not work."
          );
          res.redirect("/users/login");
        }
      }
    },
    error: (form) => {
      req.flash(
        "error_messages",
        "There are some problems logging you in. Please fill in the form again"
      );
      res.render("users/login", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/logout", (req, res) => {
  //remove session data
  let name = req.session.user.username;
  req.session.user = null;
  req.flash("success_messages", `Goodbye ${name}!`);
  res.redirect("/users/login");
});

module.exports = router;
