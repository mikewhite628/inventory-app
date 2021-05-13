#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function categoryCreate(name, cb){
    var category = new Category({name: name})

    category.save(function (err) {
        if(err){
            cb(err,null)
            return
        }
        console.log('New Category: ' + category)
        categories.push(category)
        cb(null, category)
    })
}


function itemCreate(name, category, price, description, onHand, cb) {
  
  itemdetail = {
    name: name, 
    category: category, 
    price: price, 
    description: description, 
    onHand: onHand 
    }

  if (category != false) itemdetail.category = category
  
  var item = new Item(itemdetail)

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function createItems(cb){
    async.parallel([
        function(callback){
            itemCreate('Test Item Name Here', [categories[2],], 500, 'A test piece of hardware that cost $500', 5, callback)
        },
        function(callback){
            itemCreate('Another Test Item', [categories[3],], 2.25, 'A test float price component that cost $2.25', 5, callback)
        },
        function(callback){
            itemCreate('A new test guitar', [categories[0],], 73.25, 'A Guitar thats pretty cool to play', 5, callback)
        },
        ], 
        cb);
}

function createCategories(cb){
    async.parallel([
        function(callback){
            categoryCreate('Instrument', callback)
        },
        function(callback){
            categoryCreate('Accessory', callback)
        },
        function(callback){
            categoryCreate('Hardware', callback)
        },
        function(callback){
            categoryCreate('Component', callback)
        },
        ], 
        cb);
}






async.series([
   createCategories,
   createItems,
   
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('items: ' +items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



