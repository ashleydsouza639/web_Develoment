var express = require("express");
var app=express();
var request = require("request");
app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("search");
});

app.get("/results",function(req,res){
    //console.log(req.query.search);                //name="search" in html/ejs and montana displayed  if enter 
    var query =req.query.search;
    url="http://www.omdbapi.com/?s="+query+"&apikey=c6e1362";
    //request("http://www.omdbapi.com/?s=don&apikey=c6e1362",function(error,response,body){
      request(url,function(error,response,body){
        if(!error && response.statusCode==200){
            var data=JSON.parse(body);
            //res.send(data["Search"][0]);
              res.render("results",{data:data});
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("movie app has started");
});