const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schema.js");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressErrors = require("../utils/ExpressErrors");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campground = await Campground.find({});
    // console.log(campground);
    res.render("campground/index", { campground });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campground/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    // if (!campground) throw new ExpressErrors("Campground not found", 404);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "sucessfully made a new campground");
    res.redirect(`/campground/${campground._id}`);

    nextTick(e);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campground");
    }
    // console.log(campground);
    res.render("campground/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campground");
    }

    res.render("campground/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "sucessfully made a new campground");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,

  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    const camp = await Campground.findByIdAndDelete(id);

    res.redirect("/campground");
  })
);

module.exports = router;
