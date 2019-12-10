var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOveride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var app = express();

var url = process.env.DATABASEURL || "mongodb://localhost/blog_app"
mongoose.connect(url);

app.set("view engine", "ejs"); 

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOveride("_method"));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String ,
    body: String,
    created: {type: Date , default: Date.now}

});


var Blog = mongoose.model("Blog",blogSchema);



app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({},function(err, blogs){
         if(err){
             console.log("ERROR!");
         }
         else {
            res.render("index", {blogs: blogs});
         }
    });

});


app.get("/blogs/new",function(req,res){
  res.render("new");
});

app.post("/blogs",function(req,res){
//create blog
Blog.create(req.body.blog , function(err, newBlog) {
     if(err) {
         res.render("new");
     }
     else {
         res.redirect("/blogs")
     }

});

});

//Show Route
app.get("/blogs/:id" ,function(req,res){
   
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err) {
           res.redirect("/blogs");
       }

       else {
           res.render("show", {blog: foundBlog});
       }
    });
    
});


app.get("/blogs/:id/edit", function(req,res){

    Blog.findById(req.params.id,function(err,foundBlog){
    
     if(err) {
         res.redirect("/blogs");
     } 
     else {
        res.render("edit", {blog: foundBlog});
     }

    });
});

//Update Route 

app.put("/blogs/:id" , function(req,res){
    
     Blog.findByIdAndUpdate(req.params.id, req.body.blog , function(err, updatedBlog){
          if(err){
              res.redirect("/blogs");
          }
          else {
             res.redirect("/blogs/" + req.params.id); 
          }
     });
     
});

//Delete Route 

app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       }
       else {
           res.redirect("/blogs");
       }
   });

}); 

var PORT = process.env.PORT || 3000;
app.listen(PORT,function()  {

    console.log(`server is running on port ${PORT}`);
});