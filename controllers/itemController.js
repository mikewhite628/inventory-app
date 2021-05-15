var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');
const category = require('../models/category');

//Display item list
exports.index = function(req,res, next) {

    async.parallel({
        categories: function(callback){
            Category.find(callback)
        },
    }, function(err, results) {
        res.render('index', {title: 'Warehouse Home', error: err, data: results, categories: results.categories})
    })
}

exports.item_list = function(req, res, next){
    
    Item.find()
      .exec(function(err, list_items){
          if (err) { return next(err) };
          res.render('item_list', {title: 'Item List', item_list: list_items})
      })
};

exports.item_detail = function(req, res, next){
    async.parallel({
        item: function(callback){
            Item.findById(req.params.id)
            .populate('category')
            .exec(callback)
        },

        item_category: function(callback){
            Category.find({'item': req.params.id})
            .exec(callback)
            
        },
    }, function(err, results){
        if (err) { return next (err) }
        if (results.item == null) {
            var err = new Error('Item not found');
            err.status = 404;
            return next (err)
        }
        
        res.render('item_detail', {title: 'Item Details', item: results.item, item_category: results.item_category })
    })
};

exports.item_create_get = function(req, res){
    res.send('NOT IMPLEMENTED: Item create get')
};

exports.item_create_post = function(req, res){
    res.send('NOT IMPLEMENTED: Item create post')
};

exports.item_update_get = function(req, res){
    res.send('NOT IMPLEMENTED: Item update get')
};

exports.item_update_post = function(req, res){
    res.send('NOT IMPLEMENTED: Item update post')
};

exports.item_delete_get = function(req, res){
    res.send('NOT IMPLEMENTED: Item delete get')
};

exports.item_delete_post = function(req, res){
    res.send('NOT IMPLEMENTED: Item delete post')
};
