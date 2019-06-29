var express = require("express");
var router =  express.Router();
var    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
var middleware = require("../middleware");
//===================
//campgrounds routes
//===================
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           
          res.render("campgrounds/index.ejs",{campgrounds:allCampgrounds});
       }
    });
});

// Campground.create(
//      {
//          name: "Granite Hill", 
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });


//1.CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn,function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price  =req.body.price;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name: name, image: image, price:price, description:desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//2.NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res){
   res.render("campgrounds/new.ejs"); 
});

// 3.SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("back");
        } else {
          //  console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error", "cannot find campground");
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){       //req.body.campground-> since name="campground[name and image and description]"
      if(err){
          res.redirect("/campgrounds");
      }  else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//7.Destroy route
router.delete("/:id",  middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
              req.flash("success", "Campground deleted");
          res.redirect("/campgrounds");
      }
   });
});


//middleware   stored in midddleware dir/indexjs  var middlewareObj= require(*"../model")  no need to specify file name since in=dex.js

module.exports = router;