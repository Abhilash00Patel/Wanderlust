const User = require("../models/user")

module.exports.getSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>{
    try{
     let {username, email, password}= req.body
     let newUser = new User({email, username})
  const registerdUser =   await  User.register(newUser, password)
      req.login(registerdUser, (err,next)=>{
          if(err){
             next(err)
          }
          req.flash("success", `Welcome to wanderlust!  <b>${username}</b>`)
        res.redirect("/listings")
      })
     
    } catch(err){
           req.flash("error", err.message)
           res.redirect("/signup")
    } 
 }

 module.exports.getLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}



module.exports.login =  (req,res)=>{
    let {username} = req.body 
    req.flash("success" , `Welcome Back to wanderlust "${username}"`)
     let redirectUrl = res.locals.redirectUrl || "/listings"
      res.redirect(redirectUrl)
    
 }

 module.exports.logout =  (req,res,next)=>{
    req.logout((err)=>{
        if(err){
       return  next()
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
}