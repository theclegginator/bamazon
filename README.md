# Bamazon - Node.js/MySQL Warehouse
## Summary
Bamazon is a Node.js application that is run through the command prompt. There are two separate Javascript files--the first, bamazonCustomer.js, allows a "customer" user to to see items and inventory and make a "purchase". The mock inventory for Bamazon is maintained in a MySQL database, and is updated live depending on user interaction. The second Javascript file, bamazonManager.js, has more advanced feature and allows maintanence of the inventory in the database. 

### Module Dependencies
The following Node modules are used (and are included in the package.json file):
* inquirer - used for user interaction. Provides prompts and walks the user through required information for their commands.
* dotenv - used for storing environmental variables for the users computer to run LIRI (database credentials in this instance).
* mysql - used for providing SQL queries through Node.js on the bamazon database.

### Bamazon Customer: View Inventory and Purchase an Item
* When running bamazonCustomer.js, the current inventory of the Bamazon database will be display.
* The user will be prompted with which item ID from the database they would like to purchase.
* Every time a customer tries to buy an item, the inventory will be checked in the database.
* As can be seen below, Bamazon had sufficient inventory of the item requested, so it showed the user how much their order would cost and reduced the stock in the database.
  
![Screenshot](README_images/bamazonCust1.gif)

* Since the application checks the inventory each time a request is made, as can be seen below, if their is insufficient inventory to fulfill the customer's request, Bamazon will not allow the order to got through.

![Screenshot](README_images/bamazonCust2.gif)

* The database schema for Bamazon can be seen below:
![Screenshot](README_images/bamazonDatabaseSchema.png)

### LIRI Command 2: Spotify Search Via Spotify Node Module
* Command Line Call: *node liri.js spotify-this-song "<song name here>"*
* This feature will search the spotify node module for the best match of your search and display pertinent info including a streaming link. An example is shown below.
  
![Screenshot](README-images/LIRI3-Spotify.png)

### LIRI Command 3: Movie Information Search Via OMDB
* Command Line Call: *node liri.js movie-this "<Movie name here>"*
* This feature will search the OMDB API and pull pertinent movie information on your requested movie. An example is shown below.
  
![Screenshot](README-images/LIRI4-Movies.png)

### LIRI Command 4: 
* Command Line Call: *node liri.js do-what-it-says*
* This function will pull in *random.txt* and run whatever LIRI command is stored there us the file-system module.
An example text instruction and output is shown below, which pulls a spotify search for one of the songs I have published:

![Screenshot](README-images/LIRI6-random-text.png)
![Screenshot](README-images/LIRI5-Text-Instruction.png)

### LIRI Default Prompt:
* If no additional argument is passed in to LIRI (i.e., only "node liri.js" is entered), LIRI will provide a default command list to explain it's functionality.

![Screenshot](README-images/LIRI1-Default-Prompt.png)

### LIRI Log File
* Each time a LIRI command is entered, a log file entry is saved. The Moment.js node module is used to generate a time stamp and append it to the text file so a search history can be retrieved. 

![Screenshot](README-images/LIRI7-LogFile.png)
