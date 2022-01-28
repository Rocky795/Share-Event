const express = require("express");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const { session } = require("passport");

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await new User({ email, username });
      const registerUser = await User.register(user, password);
      req.login(registerUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to YelpCamp");
        res.redirect("/campground");
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = "/" || req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  req.flash("success", "Good Bye");
  res.redirect("/");
});

module.exports = router;
