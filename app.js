const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

let item;

//connect to MongoDB by specifying port to access MongoDB server
main().catch((err) => console.log(err));

//creating a todolistDB after / localhost
async function main() {
  await mongoose.connect("mongodb+srv://admin-hassan:<password>@cluster0.yipmq.mongodb.net/todolistDB");
  console.log("DB Server is up and running");
}

//schema -> model -> document -> save

// SCHEMA
const itemsSchema = new mongoose.Schema({
  name: String,
});

// MODEL: used for queries, will be displayed as items in mongo collections
const Item = mongoose.model("Item", itemsSchema);

// DOCUMENTS
const item1 = new Item({
  name: "WELCOME TO YOUR TO DO LIST!",
});

// Schema
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

//Model: : another one for queries, will be displayed as lists in mongo collections
const List = mongoose.model("List", listSchema);

//defaultItems for adding to null db
const defaultItems = [item1];

// REQUIRING OUR LOCAL MODULE FROM date.js
const date = require(__dirname + "/date.js");
// DATE MODULE SAVED IN DAY AND CALLING GETDATE()
const day = date.getDate();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//EJS FOR USING TEMPLATES (TO AVOID MAKING MANY HTML FILES)
app.set("view engine", "ejs");


app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    //  checking to see if the DB is empty then add defaultItems
    // if(foundItems.length === 0){

    //   Item.insertMany(defaultItems, function(err){

    //     if(err){
    //     console.log(err);
    //    }
    //    else{
    //    console.log("Successfully saved the items to list");
    //        }

    //  });
    //     res.redirect("/");
    // }
    // else{

    //RENDERING LIST.EJS FILE WHERE THE VARIABLE 'ListTitle' GETS CHANGED ON THE BASIS OF day
    res.render("list", { ListTitle: day, newListItems: foundItems });
    
  });
});


//for custom links
app.get("/:customListName", function (req, res) {
  //req.params for getting different routes
  const customListName =  _.capitalize(req.params.customListName);

  //first it will find the already existed list on that customListName route
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //if not found create the list and save
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();

        res.redirect("/" + customListName);
      } else {
        //if found show/render the list
        res.render("list", {
          ListTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

//post request of adding into the list
app.post("/", function (req, res) {
  const itemName = req.body.newItems;
  const listName = req.body.list;
  
  //if the listName belongs to day then add to day list and redirect
  item = new Item({
    name: itemName,
  });

  if (
    listName === "Tuesday," ||
    listName === "Wednesday," ||
    listName === "Thursday," ||
    listName === "Friday," ||
    listName === "Saturday," ||
    listName === "Sunday," ||
    listName === "Monday,"
  )
   {
    item.save();
    res.redirect("/");
  }
  //if the listName belongs to any custom one then add to custom list and redirect
  else{
   
      List.findOne({name: listName}, function(err,foundList){
       
         foundList.items.push(item);
         foundList.save();
         res.redirect("/" + listName);
 
      });
     
  }

});

//  Handling remove post request
app.post("/remove", function (req, res) {
  const itemName = req.body.newItems;
  const listName = req.body.Removebutton;
  
  let foundItem;
  
  //if home "/" route with title as day then find and delete from Item
  if (
    listName === "Tuesday," ||
    listName === "Wednesday," ||
    listName === "Thursday," ||
    listName === "Friday," ||
    listName === "Saturday," ||
    listName === "Sunday," ||
    listName === "Monday,"
  ){

      // traverse the DB to the end and store the last element in foundItem
      Item.find(function (err, itemFind) {
        if (err) {
          console.log(err);
        } else {
          itemFind.forEach((element) => {
            foundItem = element.name;
          });
        }
    
        //Then delete the stored item in foundItem
        Item.deleteOne({ name: foundItem }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully Deleted");
          }
        });
          res.redirect("/");
        
      });

  }

  //if other then home route then find and delete from List
   else{

    List.findOne({name: listName}, function(err,foundList){
       
      foundList.items.pop(item);
      foundList.save();
      res.redirect("/" + listName);
  
   });

      }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function (req, res) {
  console.log("Server has been started and running");
});
