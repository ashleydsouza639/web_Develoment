var express = require("express");
var router =  express.Router(),
    passport    =  require("passport"),
    LocalStrategy   = require("passport-local"),
    passportLocalMongoose =require("passport-local-mongoose"),
    User        =  require("../models/user");


router.get("/", function(req, res){
    res.render("landing");
});
//=============
//auth/ index routes
//===============
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to yelcamp "+user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login",{message:req.flash("error")}); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;