var express = require("express"),
app=express(),
mongoose=require("mongoose"),
passport=require("passport"),
bodyParser=require("body-parser"),
localStrategy=require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
User = require("./models/user");

app.use(require("express-session")({
   secret:"Rusty is the best and cutest dog in the world",
   resave:false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

//2 methods responsible for reading the session,taking data, encoding and unencoding 
passport.serializeUser(User.serializeUser());      //passport-local-mongoose
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/authdemo");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.render("home");
});

//============
// ROUTES
app.get("/",function(req,res){
    res.render("secret");
});

//show sign up form
app.get("/register", function(req, res){
   res.render("register"); 
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started...");
});