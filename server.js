const express = require('express');
let app = express();
app.set("view engine", "pug");

//public directory
//for js and css
app.use(express.static("public"));

//for vendors filenames
const fs = require('fs');
let vendorJSON = fs.readdirSync('./vendors');

//vendor object to store each vendor's data
let vendorObj = {};

//array to store IDs of the vendors
let vendorIDCollection = [];
//ID starts from 0
let uniqueItemID = 0;
//for each vendor
//the vendor's data will be stored temporarily to a key
//then an ID will be taken to stored in our ID Array so we can use later
vendorJSON.forEach(name =>{

  vendorObj["tempVendor"] = require("./vendors/" + name);
   
  //store the data to the vendor that matches the ID to the vendor object
  vendorObj[vendorObj["tempVendor"].id] = vendorObj["tempVendor"];
  

  //if ID greater than largest ID existed
  //ID becomes largest ID existed
  if(vendorObj["tempVendor"].id > uniqueItemID){
    uniqueItemID = vendorObj["tempVendor"].id;
  }

  vendorIDCollection.push(vendorObj["tempVendor"].id);
  delete(vendorObj["tempVendor"]);
  //console.log(vendorObj["temp"]);
})

//GET request for the home page
app.get("/", function(req, res){

  if(req.accepts("html")){
    //render the page then display it to the customers
    res.render("home.pug");
  }
  else{
    //if not html, then error message will be sent
    res.sendStatus(404);
    return;
  }
})

//GET request for addVendor page
app.get("/addVendor", function(req, res){

  if(req.accepts("html")){
    //display the page to the customers
    res.render("addVendor.pug");
  }
  else{
    //error message
    res.sendStatus(404);
    return;
  }
})

//routing GET and PUT requests 
//connects to whatever vendor that has the assigned vendor ID
app.route("/vendors/:vendorID")


//GET request for the vendor page
  .get(function(req, res){
  //Check if the request page ID matches the one that we already have
  if(vendorObj.hasOwnProperty(req.params.vendorID)){

    //Check if the request is for HTML or JSON 
    if(req.accepts('text/html')){
      res.render('vendor.pug', {vendor: vendorObj[req.params.vendorID]});
    }
    //if JSON is requested => send JSON here
    else if(req.accepts('application/json')){
      res.status(200).json(vendorObj[req.params.vendorID]);
    }
    else{
    //else error message
      res.sendStatus(404);
      return; 
    }
  }
  else{
    //if ID doesnt exist in our data
    res.sendStatus(404);
    return;
  }
})

//PUT request to make any requested update
  .put(express.json(), function(req, res){
    if(req.accepts("json")){
      if(vendorObj.hasOwnProperty(req.params.vendorID)){
        vendorObj[req.params.vendorID].name = req.body.name;
        vendorObj[req.params.vendorID].min_order = parseFloat(req.body.min_order);
        vendorObj[req.params.vendorID].delivery_fee = parseFloat(req.body.delivery_fee);
        vendorObj[req.params.vendorID].supplies = req.body.supplies;
        //response only if the update was successful
        res.sendStatus(200);
      }
      else{
        res.sendStatus(404);
        return;
      }
    }
    else{
      res.sendStatus(404);
      return;
    }
  })

//routing GET and PUT requests 
//connects to all the existing vendors
app.route("/vendors")

  .get(function(req, res){
    //Display a page of all the vendors so far
    if(req.accepts("html")){
      res.render("vendorDisplay.pug", {vendorObj: vendorObj})
    }
    else if(req.accepts("json")){
      res.status(200).json(vendorIDCollection); //vedorObj[req.params.vendorID]
    }
    else{
      res.sendStatus(404);
      return;
    }
  })

//POST request to add new vendors to the vendors page
  .post(express.json(), function(req, res){
    if(req.accepts("json")){

      //Check if the name is not empty
      //Check if the delivery fee is not empty
      //Check if the minimum order is not empty
      if(req.body.name != undefined && req.body.delivery_fee != undefined && req.body.min_order != undefined){

        //if name is in proper text format
        //if delivery fee is a number
        //if minimum fee is a number
        if(req.body.name.length > 0 && isNaN(req.body.delivery_fee) == false && isNaN(req.body.min_order)==false){
          let tempVendor = {};

          uniqueItemID += 1;

          tempVendor.name = req.body.name;
          tempVendor.min_order = parseFloat(req.body.min_order);
          tempVendor.delivery_fee =parseFloat(req.body.delivery_fee);

          tempVendor.supplies = {};

          //new vendor gets an ID for itself here
          tempVendor.id = uniqueItemID;
          
          vendorObj[tempVendor.id] = tempVendor;
          vendorIDCollection.push(tempVendor.id);

          //after adding a new vendor
          //and OK is clicked by the customer
          //the page will be redirected to where we can edit the supplies and category of the vendor's page
          res.redirect(`/vendors/${uniqueItemID}`);
          // res.setHeader("Content-Type", "application/json");
          // res.status(201).json(tempVendor);
        }
        else{
          res.sendStatus(400);
          return;
        }
      }
      else{
        res.sendStatus(400);
        return;
      }
    }
    else{
      res.sendStatus(404);
      return;
    }
  })

app.listen(3000);
console.log("Server listening at http://localhost:3000");

//ADD REDIRECT PLEASE