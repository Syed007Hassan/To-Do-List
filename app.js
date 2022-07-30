const bodyParser = require("body-parser");
const express = require("express");

// REQUIRING OUR LOCAL MODULE FROM date.js
const date = require(__dirname + "/date.js");

const app = express();

// GLOBAL VARIABLE DEFINED
const items = [];
const workItems =[];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


//EJS FOR USING TEMPLATES (TO AVOID MAKING MANY HTML FILES)
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  
  // DATE MODULE SAVED IN DAY AND CALLING GETDATE()
  const day = date.getDate();

  //RENDERING LIST.EJS FILE WHERE THE VARIABLE 'ListTitle' GETS CHANGED ON THE BASIS OF day
  res.render("list", {ListTitle: day, newListItems: items});
  
}); 

app.post("/",function(req,res){
   
  const item = req.body.newItems;
  
  //IF THE ITEM BELONGS TO WORK/TITLE AS HOME ROUTE SO PUSH IN RESPECTIVE ARRAYS
  
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }
   else{
    items.push(item);
    res.redirect("/");
   }

});

//  Handling remove post request
app.post("/remove",function(req,res){
  
  //IF THE ITEM BELONGS TO WORK/TITLE AS HOME ROUTE SO POP IN RESPECTIVE ARRAYS

  if(req.body.Removebutton === "Work"){
    workItems.pop();
    res.redirect("/work");
  }
   else{
    items.pop();
    res.redirect("/");
   }
 
});

app.get("/work",function(req,res){
  
  //RENDERING LIST.EJS FILE WHERE THE VARIABLE 'ListTitle' GETS CHANGED ON THE BASIS OF Work List
  res.render("list", {ListTitle: "Work List", newListItems: workItems});

});


app.listen(3000, function (req, res) {
  console.log("Server has been started and running");
});

