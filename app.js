if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express()
const mongoose = require('mongoose'); 
const path = require("path")
const methodOverride = require("method-override")
const ejsmate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError");
require("./schema")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy  =   require("passport-local")
const User = require("./models/user")
const listingsRouter = require("./routes/listing")
const reviewsRouter = require("./routes/review");
const usersRouter = require("./routes/user");
require('console');



let port = 3000;
app.set("view engine" , "ejs")
app.set("views" , path.join(__dirname , "/views"))
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsmate)
app.use(express.static(path.join(__dirname, "/public")))


const dbUrl = process.env.ATLASDB_URL

async function main() {
  await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("database connected")
}).catch(err => console.log(err));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter: 24* 3600,
})

store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE ",err )
})

const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 1000* 60 *60* 24 * 7 ,
        maxAge: 1000* 60 *60* 24 * 7  , 
        httpOnly: true,
    }
}


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());      

passport.use(new LocalStrategy(User.authenticate()))

app.listen(port, ()=>{
    console.log("app is listening")
    
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})

app.get("/", (req, res) => {
    res.send("Welcome to Wanderlust!");
});


app.use("/listings" , listingsRouter)

app.use("/listings/:id/reviews",reviewsRouter)


app.use("/" , usersRouter)

app.all("*", (req,res,next)=>{
    next(new ExpressError(404,  "page not found!"))
})

app.use( (err,req,res)=>{
    let{status=500 , message = "sonething went wrong!"}  = err;
    res.status(status).render("listings/error.ejs" , {message})
})







