require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');

let hostName = process.env.HOST;
let pass = process.env.PASS;
// Variables for MySQL connection.
var connection = mysql.createConnection({
  host     : hostName,
  user     : "root",
  password : pass,
  database: "bamazon"
});
 
// Initial connection to display to the customer which items are in the inventory.
connection.connect();

function listItems() {
    let query = "SELECT * FROM bamazon.products";
     
    connection.query(query, function (error, results, fields) {
      if (error) {
          connection.end();
          throw error;
        }
      else {
          console.log(results);       
          console.log("\x1b[32m", "\nThe items above are what we have in stock! \nWhat would you like to do next?")
          console.log("\x1b[0m", "")
          askManager();
      }
    });
}


function checkLowInventory() {
    // the following query will check for all items where the stock is less than 5.
    let lowInventoryQuery = `SELECT * FROM bamazon.products WHERE stock_quantity <= 5`;
    
    connection.query(lowInventoryQuery, function (error, results, fields) {
        if (error) {
            connection.end();
            throw error;
        }
        else {
            if (results.length < 1 || results == undefined) {
                console.log("\x1b[32m", "\nNo items are currently in low stock! We're awesome! \nWhat would you like to do next?")
                console.log("\x1b[0m", "")
                askManager();
            }
            else {
                console.log(results);       
                console.log("\x1b[32m", "\nThe items above have a stock of less than 5 units. \nWhat would you like to do next?")
                console.log("\x1b[0m", "")
                askManager();
            }
        }
    });
}

function addToInventory() {
    // perform a query on all items to show the manager what is in stock for him/her to modify.
    let query = "SELECT * FROM bamazon.products";
    connection.query(query, function (error, results, fields) {
      if (error) {
          connection.end();
          throw error;
        }
      else {
          console.log(results);       
    // Now we ask the manager what they want to update and with what quantity.
    inquirer
    .prompt([
        {
          type: "input",
          message: "We have listed the items in stock above. Please input the item ID you would like to update.\n",
          name: "itemID"
        },
        {
          type: "input",
          message: "Please tell us how many of this item to add to our stock.\n",
          name: "stockIncrease"
        },
    ])
    .then(function(inquirerResponse) {
        // take the responses from inquirer as variable for our SQL update.
        let itemID = inquirerResponse.itemID;
        let stockIncrease = parseInt(inquirerResponse.stockIncrease);
        
        // perform another query to see what the current stock is of the item the manager selected.
        let query = `SELECT stock_quantity FROM bamazon.products WHERE item_id = ${itemID}`;
        connection.query(query, function (error, results, fields) {
          if (error) {
              connection.end();
              throw error;
            }
          else {
              // assign a variable for the current stock of the item in question.
              let currentStock = parseInt(results[0].stock_quantity);  
              let newStock = currentStock + stockIncrease;
              let addToInventoryQuery = `UPDATE bamazon.products SET stock_quantity = ${newStock} WHERE item_id = ${itemID}`;
              updateInventory(newStock, addToInventoryQuery);    
          }
        });
    })
}
});
}

function updateInventory(newStock, addToInventoryQuery) {
     // calculate the new stock of the item and place that quantity in an update statement.
     connection.query(addToInventoryQuery, function (error, results, fields) {
        if (error) {
            connection.end();
            throw error;
        }
        else {
            console.log("\x1b[32m", `\nWe increased the stock of the item you requested. \nThe new stock of this item is ${newStock}. \nWhat would you like to do next?`)
            console.log("\x1b[0m", "")
            askManager();
        }
    });
}

// function to add a new product to the product listings.
function newProduct() {
    inquirer
    .prompt([
        {
          type: "input",
          message: "What is the name of the item you would like to add to inventory?\n",
          name: "name"
        },
        {
          type: "input",
          message: "What department does this product belong in?\n",
          name: "department"
        },
        {
          type: "input",
          message: "How much does this product cost?\n",
          name: "price"
        },
        {
          type: "input",
          message: "How many of this product should we put in stock?\n",
          name: "stock"
        },
    ])
    .then(function(inquirerResponse) {
        // take the responses from inquirer as variable for our SQL update.
        let name = inquirerResponse.name;
        let department = inquirerResponse.department;
        let price = parseFloat(inquirerResponse.price); // ensuring string to float for SQL data type
        let stock = parseInt(inquirerResponse.stock);
        
        // perform an UPDATE statement.
        let addProductQuery = 
        `INSERT INTO products (product_name, department_name, price, stock_quantity) 
        VALUES ("${name}", "${department}", ${price}, ${stock})`; 
        connection.query(addProductQuery, function (error, results, fields) {
          if (error) {
              connection.end();
              throw error;
            }
          else {
            console.log("\x1b[32m", `\nWe added the product you requested! \nWhat would you like to do next?`)
            console.log("\x1b[0m", "")
            askManager();
          }
        });
    })
}

// This is the root function that will prompt all the commands.
function askManager() {
inquirer
  .prompt([
    // ask the manager what action he/she would like to perform.
    {
        type: "list",
        message: "Hello, manager. What would you like to check up on?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "I'm done here"],
        name: "managerAction"
    },
  ])
  .then(function(inquirerResponse) {
        switch (inquirerResponse.managerAction) {
            case "View Products for Sale":
                listItems();
                break
            case "View Low Inventory":
                checkLowInventory();
                break
            case "Add to Inventory":
                addToInventory();
                break
            case "Add New Product":
                newProduct();
                break   
            case "I'm done here":
                // If the manager is done, break the mysql connection and exit the loop.
                connection.end();
                break
        }
  });    
}

askManager();