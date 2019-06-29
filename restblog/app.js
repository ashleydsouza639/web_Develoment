var bodyParser = require("body-parser"),
mongoose       =  require("mongoose"),
express         = require("express"),
app              = express(),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");



//app config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose schema and model config
mongoose.connect("mongodb://localhost/restfulblogapp",{ useNewUrlParser: true });
var blogSchema = new mongoose.Schema({    //title image body
   title: String,
   image: String,
   body:String,
   created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
  
// Blog.create({
//     title:"Test Blog",
//     image:"https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//     body:"Hello this is a blog post"
// });

//restful routes
app.get("/",function(req,res){  
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{blogs:blogs})
        }
    });
});


//new route
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

//create route
app.post("/blogs",function(req,res){
   //create blog
   Blog.create(req.body.blog,function(err,newBlog){       //req.bopdy.blog has title imagre and body
    
       if(err){
           res.render("new");
       } 
       else{   //redirect to index /blogs
          console.log(typeof req.body.blog);
           res.redirect("/blogs");
       }
   });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("blog app server running");
});

