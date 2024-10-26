const express = require("express");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const {listingSchema} = require("../schema")
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users")


router.route("/signup")
.get(userController.getSignupForm )
.post( wrapAsync(userController.signup))

router.route("/login")
.get(userController.getLoginForm )
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login" , failureFlash: true}), userController.login)


router.get("/logout", userController.logout)

module.exports = router


