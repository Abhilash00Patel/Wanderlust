const express = require("express");
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/wrapAsync")
const {reviewSchema} = require("../schema")
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing")
const Review = require("../models/review");
const {isAuthor,isLoggedIn}  = require("../middleware")
const reviewsController = require("../controllers/reviews")

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}
 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.postReview))

router.delete("/:reviewId" ,isLoggedIn,isAuthor,wrapAsync (reviewsController.deleteReview))



module.exports = router;


