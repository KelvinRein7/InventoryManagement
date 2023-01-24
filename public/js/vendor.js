let vendorObj = {};
let xhttp = new XMLHttpRequest();
let uniqueItemID = 0;
//like we store vendor id


xhttp.onreadystatechange = function() {

  if(this.readyState == 4 && this.status == 200){
    vendorObj = JSON.parse(xhttp.responseText);
    for(let category in vendorObj.supplies){
      for(let item in vendorObj.supplies[category]){
        //item = the ID of the last item in the category
        if(parseInt(item) > uniqueItemID){
          uniqueItemID = item;
        }
      }
    }
    uniqueItemID++;
    //if new item added, increment the ID with a greater ID number
  }
}
//url of current page
xhttp.open("GET", window.location.href, true);
xhttp.setRequestHeader("Accept", "application/json");
xhttp.send();

//right column
let addName = document.getElementById("name");
addName.addEventListener("change", changeVendorName);
function changeVendorName(){
  document.getElementById("vendorName").innerHTML = addName.value;

  //store the changes in local vendor object
  vendorObj.name = addName.value;
}

let deliFee = document.getElementById("deliFee");
let minOrder = document.getElementById("minOrder");
deliFee.addEventListener("change", changeDeliFee);
minOrder.addEventListener("change", changeMinOrder);
//change deli fee
function changeDeliFee(){
  document.getElementById("vendorInfo").innerHTML = "Minimum Order: $" + parseFloat(minOrder.value).toFixed(2) + " | " + "Delivery Fee: $" + parseFloat(deliFee.value).toFixed(2);
  
  //store the changes to the local vendor object
  vendorObj.delivery_fee = deliFee.value;
}
//change minimum order
function changeMinOrder(){
  document.getElementById("vendorInfo").innerHTML = "Minimum Order: $" + parseFloat(minOrder.value).toFixed(2) + " | " + "Delivery Fee: $" + parseFloat(deliFee.value).toFixed(2);

  //store the changes to the local vendor object
  vendorObj.min_order = minOrder.value;
}

//addCategory
//saveButton
let addCategoryButton = document.getElementById("AddCategory");
addCategoryButton.addEventListener('click', addCategory);
function addCategory(){
  
  let newCategory = document.getElementById("category").value;
  
  //if new category to add is not in the data yet
  //if the value is not empty
  if(!vendorObj.supplies.hasOwnProperty(newCategory) && newCategory != ''){

    let divMain = document.createElement("div");
    let vendorHeader = document.createElement("h2");

    //middle column where supplies will be displayed
    divMain.setAttribute("class", "middle-column");
    vendorHeader.innerHTML = newCategory;
    divMain.appendChild(vendorHeader);

    //add new category to the main categories
    let mainCategories = document.getElementById("vendors");
    vendorObj.supplies[newCategory] = {};

    //add new item div
    let divItem = document.createElement("div");
    divItem.setAttribute("class", "item-names");
    divItem.setAttribute("id", newCategory);

    mainCategories.appendChild(divMain);
    mainCategories.appendChild(divItem);

    //add new category to the existing categories drop down
    let selectCategory = document.getElementById("itemCategory");
    let addedCategory = document.createElement("option");

    addedCategory.value = newCategory;
    addedCategory.innerHTML = newCategory;

    selectCategory.appendChild(addedCategory);
    //testing
    console.log("Add category button worked");


  }
}

let addItemButton = document.getElementById("addButton");
addItemButton.addEventListener("click", addNewItem);
function addNewItem(){
  let itemName = document.getElementById("itemName").value;
  let itemDescription = document.getElementById("description").value;
  let itemPrice = document.getElementById("price").value;
  let itemStock = document.getElementById("stock").value;
  let itemCategory = document.getElementById("itemCategory").value;


  //check if the user have any EMPTY input
  //if so, nothing is to be added
  if(itemName != '' && itemPrice != '' && itemCategory != '' && itemStock != ''){

    //new Category added
    let categoryName = document.getElementById(itemCategory);
    let itemHeader = document.createElement("h3");

    itemHeader.innerHTML = itemName + `(ID=${uniqueItemID})` + " (Stock=" + itemStock + ")";
    categoryName.appendChild(itemHeader);

    //item description
    let itemDescriptionDiv = document.createElement("div");
    
    itemDescriptionDiv.setAttribute("class", "item-description");
    let displayDescription = document.createElement("p");
    displayDescription.innerHTML = itemDescription + " ($" + parseFloat(itemPrice).toFixed(2) + ")";


    itemDescriptionDiv.appendChild(displayDescription);
    categoryName.appendChild(itemDescriptionDiv);

    //store the changes to the vendor object we initialized
    vendorObj.supplies[itemCategory][uniqueItemID] = {};
    vendorObj.supplies[itemCategory][uniqueItemID].name = itemName;
    vendorObj.supplies[itemCategory][uniqueItemID].description = itemDescription;
    vendorObj.supplies[itemCategory][uniqueItemID].price = itemPrice;
    uniqueItemID++;
  }
  else{
    alert("***Please Fill Up The Fields***");
  }
}

//save for the whole page's current state to the server
//any changes on current page will be saved after this function is called
let saveChanges = document.getElementById("saveButton");
saveChanges.addEventListener("click", saveNewChanges);
function saveNewChanges(){

  if(vendorObj.name != '' && vendorObj.delivery_fee != '' && vendorObj.min_order != ''){
    
    //if user input is not EMPTY
    //make a new HTTP request then save the changes to the server

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        alert("***Saved Changes Successfully***");
      }
    }

    //window.location.href gives the URL of the current page
    xhttp.open("PUT", window.location.href, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(JSON.stringify(vendorObj));
  }
  else
  {
    alert("***Please Fill Up All The Fields***");
  }
}