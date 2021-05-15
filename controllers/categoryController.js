var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async')

exports.category_list = function(req, res){
    res.send('NOT IMPLEMENTED: Catergory List');
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

exports.catergory_create_get = function(req, res){
    res.send('NOT IMPLEMENTED: category create get')
};

exports.catergory_create_post = function(req, res){
    res.send('NOT IMPLEMENTED: category create post')
};

exports.catergory_update_get = function(req, res){
    res.send('NOT IMPLEMENTED: category update get')
};

exports.catergory_update_post = function(req, res){
    res.send('NOT IMPLEMENTED: category update post')
};

exports.catergory_delete_get = function(req, res){
    res.send('NOT IMPLEMENTED: category delete_get')
};

exports.catergory_delete_post = function(req, res){
    res.send('NOT IMPLEMENTED: category delete_post')
};