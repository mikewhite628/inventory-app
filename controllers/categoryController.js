var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async')
var mongoose = require('mongoose')
const { body, validationResult } = require('express-validator')

exports.category_list = function(req, res){
    Category.find()
      .exec(function(err, list_categories){
          if (err) { return next (err) }
          res.render('category_list', {title: 'Browse Consoles', categories: list_categories})
      })
};

exports.category_detail = function(req, res, next){
    
    async.parallel({
        category: function(callback){
            Category.findById(req.params.id)
              .exec(callback);
        },
        category_items: function(callback){
            Item.find({'category': req.params.id})
              .exec(callback);
        },
    }, function(err, results){
        if (err) {return next (err); }
        if (results.category == null){
            var err = new Error('Category Not Found');
            err.status = 404
            return next(err)
        }
        res.render('category_detail', {title: 'Category Detail', category: results.category, category_items: results.category_items})
    })
}

exports.category_create_get = function(req, res){
    res.render('category_form', {title: 'Create Category'})
};

exports.category_create_post = [

    body('name', 'Category name required').trim().isLength({ min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var category = new Category(
            {name: req.body.name}
        );
        if (!errors.isEmpty()){
            res.render('category_form', {title: 'Create Category', category: category, errors: errors.array()});
            return;
        }
        else {
            Category.findOne({ 'name': req.body.name })
              .exec( function(err, found_category){
                  if (err) { return next(err); }
                  if (found_category){
                      res.redirect(found_category.url);
                  }
                  else {
                      category.save(function (err){
                          if (err) {return next(err)}
                          res.redirect(category.url)
                      })
                  }
              })
        }
    }
]

exports.category_update_get = function(req, res){
    res.send('NOT IMPLEMENTED: category update get')
};

exports.category_update_post = function(req, res){
    res.send('NOT IMPLEMENTED: category update post')
};

exports.category_delete_get = function(req, res){
    res.send('NOT IMPLEMENTED: category delete_get')
};

exports.category_delete_post = function(req, res){
    res.send('NOT IMPLEMENTED: category delete_post')
};