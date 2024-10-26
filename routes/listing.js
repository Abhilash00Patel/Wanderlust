const express = require("express");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const {listingSchema} = require("../schema")
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing")
const {isLoggedIn} = require("../middleware")
const {isOwner} = require("../middleware");
const { populate } = require("../models/review");
const multer = require("multer");
const listingsController = require("../controllers/listings")
const {storage} = require("../cloudConfig")
const upload = multer({storage})

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

router.route("/")
.get( wrapAsync(listingsController.index))
.post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingsController.postListing))


router.get("/new",isLoggedIn,listingsController.createListing)

router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put( isLoggedIn,upload.single("listing[image]"),wrapAsync(listingsController.updateListing))
.delete(isLoggedIn,isOwner ,wrapAsync(listingsController.destroyListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsController.editForm))

module.exports = router;

