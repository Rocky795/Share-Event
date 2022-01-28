const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressErrors = require("../utils/ExpressErrors");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const Review = require("../models/review");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    // It's taking review from show page
    const review = new Review(req.body.review);
    review.author = req.user._id;
    // It is linking review to campground Id
    campground.reviews.push(review);
    // Saving that review
    await review.save();
    //Saving the change that we link the review to it
    await campground.save();
    req.flash("success", "sucessfully made a new campground");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    // console.log(reviews);
    // console.log(review);
    res.redirect(`/campground/${id}`);
  })
);

module.exports = router;
