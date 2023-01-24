Name: Khun Thu Rein 
ID: 101186023

Steps to run the program:

1. Download the zip file and extract

2. Open the folder in VScode
          OR
2. Go to the external terminal and make sure you are in the directory of the folder you have the downloaded file

3. npm install

4. node server.js 

click on the link that appears on the terminal to load the page

Further Documentation
---------------------

1. For local update there is no button as I made them (deli fee, minimum order) changed as soon as the user input any
value. Changes will finally be made only once the user save.

2. Everytime the user enters random values or not entering any value, the alert will be shown on top as we want to avoid
storing random data on the server side

3. Values of 0.0 or 0 are set to default for delivery fees and minimum order so that it makes it easier for the user
to just ignore those input boxes if they do not intend to put any fees. They will just be zeros. This will also avoid
alerts.

4. Part 5f and Part 6 are logically similar as what they want to do is to sent an updated version of the vendor to the server
everytime changes are made.
 
5.Placeholders are used to remind the user to enter the expected values into the input boxes.
