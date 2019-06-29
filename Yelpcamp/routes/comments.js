var express = require("express");
var router =  express.Router({mergeParams:true});
var    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
var middleware = require("../middleware");

//===============
//comments routes
//===============

//1.NEW - show form to create new comment
router.get("/new",middleware.isLoggedIn, function(req, res){
   //ind campground by id
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
       }
       else{
           res.render("comments/new.ejs",{campground:campground}); 
       }
   });
});

//2.Create
router.post("/",middleware.isLoggedIn,function(req,res){
    //lookup campground using
    Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else{
           Comment.create(req.body.comment,function(err,comment){                    //create new comment
               if(err){
                       req.flash("error", "something wen twrong");
                   console.log(err);
               }else{
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username =req.user.username;
                   console.log(req.user.username);
                   //save comment
                   comment.save();
                   campground.comments.push(comment);                            //push and save to
                   campground.save();                                            //connect new comment to campground
                       req.flash("success", "successfully added comment");
                   res.redirect("/campgrounds/"+campground._id);                   //redirect campground show page
               }                
           });
       }
    });
});


//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    });              
        
});

//update route
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err,foundComment){
       if(err){
       res.redirect("back");
       }else{
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/"+req.params.id);
       }
           
     });
});

//middleware


module.exports = router;