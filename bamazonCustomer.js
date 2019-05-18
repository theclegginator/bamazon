require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');

let hostName = process.env.HOST;
let pass = process.env.PASS;
console.log(pass)
// Variables for MySQL connection.
var connection = mysql.createConnection({
  host     : hostName,
  user     : "root",
  password : pass,
});
 
// Initial connection to display to the customer which items are in the inventory.
connection.connect();

let query = "SELECT * FROM bamazon.products";
 
connection.query(query, function (error, results, fields) {
  if (error) {
      connection.end();
      throw error;
    }
  else {
      console.log(results); 
      askCustomer();
  }
});



function askCustomer() {
inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "Welcome to Bamazon, where corporate branding infringement is not a problem! \nPlease give us the item ID from the list above of what you would like to purchase.\n",
      name: "purchaseItem"
    },
    {
      type: "input",
      message: "How many would you like to purchase?\n",
      name: "purchaseNumber"
    },
  ])
  .then(function(inquirerResponse) {
    checkInventory(inquirerResponse.purchaseItem, inquirerResponse.purchaseNumber);
  });    
}

function checkInventory(purchaseItem, purchaseNumber) {
    let inventoryQuery = `SELECT * FROM bamazon.products WHERE item_id = ${purchaseItem}`;
     
    connection.query(inventoryQuery, function (error, results, fields) {
      if (error) {
            connection.end();
            throw error;
      }
      else {
            // assign variables to the pertinent information from the SQL query
            let stock = results[0].stock_quantity;
            let itemName = results[0].product_name;
            let itemCost = results[0].price;
            let totalCost = purchaseNumber * itemCost;
            if (purchaseNumber > stock) {
                console.log(`We are sorry! \nWe cannot fulfill your order for ${purchaseNumber} ${itemName}(s). \nWe only have ${stock} in stock!`)
            }
            else {
                let newStock = stock - purchaseNumber;
                let successStatement = `The total cost of your order for ${purchaseNumber} ${itemName}(s) will be $${totalCost}.\nWe now have ${newStock} ${itemName}(s) left in stock. \nThank you!`;
                updateInventory(newStock, purchaseItem, successStatement);
            }
      }
    });
}

function updateInventory(newStock, itemID, successStatement) {
    //UPDATE table_name SET column_name = value [, column_name = value ...] [WHERE condition]
    let inventoryUpdateQuery = `UPDATE bamazon.products SET stock_quantity = ${newStock} WHERE item_id = ${itemID}`;
    connection.query(inventoryUpdateQuery, function (error, results, fields) {
        if (error) {
            connection.end();
            throw error;
          }
        else {
            console.log(successStatement);
        }
    });
    connection.end(); // end mysql connection
}
