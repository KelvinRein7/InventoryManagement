//this function will be called when the Save button is clicked
//Changes will  be made to the server
//for example: Adding a new vendor information
// import swal from sweetAlert;

function addVendorFunc(){
  //1.REQUEST HERE
  let xhttp = new XMLHttpRequest();

  //a new object to store new inputs (for e.g. new vendor name)
  let vendorData = {};

  //take in the input of the vendor name
  vendorData.name = document.getElementById("name").value;

  //take in the delivery fee
  vendorData.delivery_fee = document.getElementById("deliFee").value;

  //take in the minimum order fee
  vendorData.min_order = document.getElementById("minOrder").value;


  //check if the input fields are empty
  if(vendorData.name == '' || vendorData.delivery_fee == '' || vendorData.min_order == ''){
    alert("***Please Fill Up All The Fields***");
    return;
  }
  else{
    alert("***New Vendor Created Successfully**");
  }

  //2.RESPONSE WITH THE NEW VENDOR INFORMATION TO THE USE
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){

      //link to the new page with the new vendor's name
      window.location.href = "http://localhost:3000/vendors/" + JSON.parse(xhttp.responseText).id;
    }
  }

  //POST request    
  xhttp.open("POST", "http://localhost:3000/vendors", true);
  xhttp.setRequestHeader("Content-Type", "application/JSON");
  xhttp.setRequestHeader("Accept", "application/JSON");
  xhttp.send(JSON.stringify(vendorData));
}