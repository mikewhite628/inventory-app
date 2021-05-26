var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');
const { find } = require('../models/category');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (request, file, callback){
        callback(null, './public/images');
    },

    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: {
        filseSize: '8mb'
    },
});

//Display item list
exports.index = function(req,res, next) {

    async.parallel({
        categories: function(callback){
            Category.find(callback)
        },
    }, function(err, results) {
        res.render('index', {title: 'The Game House', error: err, data: results, categories: results.categories})
    })
}

exports.item_list = function(req, res, next){
    
    Item.find()
      .exec(function(err, list_items){
          if (err) { return next(err) };
          res.render('item_list', {title: 'Games On Hand', item_list: list_items})
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

exports.item_create_get = function(req, res, next){
    
    async.parallel({
        categories: function(callback){
            Category.find(callback)
        },
    }, function(err, results) {
        if (err) {return next(err); }
        res.render('item_form', {title: 'Create Item', categories: results.categories})
    })
}

exports.item_create_post = [

    upload.single('avatar'),

    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category === 'undefined')
            req.body.category = [];
            else
            req.body.genre = new Array(req.body.genre)
        }
        next();
    },

    body('name', 'Item name required').trim().isLength({ min: 1}).escape(),
    body('category.*').escape(),
    body('price', 'Price required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({min: 1}).escape(),
    body('onHand', 'On hand quantitty is required').trim().isLength({ min: 1}).escape(),

    
    
    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item ({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            onHand: req.body.onHand,
            avatar: req?.file?.filename,
        });
        
        if (!errors.isEmpty()){

            async.parallel({
                categories: function(callback) {
                    Category.find(callback)
                },
            },
            function(err, results){
                if (err) { return next(err); }
                for (let i = 0; i < results.categories.length; i++){
                    if (item.category.indexOf(results.categories[i]._id) > -1){
                        results.categories[i].checked='true'
                    }
                }
                res.render('item_form', {title: 'Create Item', item: item, categories: results.categories, errors: errors.array()});
            });
            return;
        } 
        else {

        item.save(function (err){
            if (err) { return next(err); }
            res.redirect(item.url)
        })
        }
    }
];

exports.item_update_get = function(req, res, next){

    async.parallel({
        item: function(callback){
            Item.findById(req.params.id)
            .populate('category')
            .exec(callback);
        },
        categories: function(callback){
            Category.find(callback);
        },
    }, function(err, results){
        if (err){ return next(err); }
        if (results.item==null){
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        for (var all_c_iter = 0; all_c_iter < results.categories.length; all_c_iter++){
            for (var item_c_iter = 0; item_c_iter < results.item.category.length; item_c_iter++ ){
                if (results.categories[all_c_iter]._id.toString()===results.item.category[item_c_iter]._id.toString()){
                    results.categories[all_c_iter].checked = 'true'
                }
            }
        }
        res.render('item_form', {title: 'Update Item', item: results.item, categories: results.categories})
    });
};

exports.item_update_post = [

    upload.single('avatar'),
    
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category === 'undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.category)
        }
        next();
    },

    body('name', 'Item name required').trim().isLength({ min: 1}).escape(),
    body('category.*').escape(),
    body('price', 'Price required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({min: 1}).escape(),
    body('onHand', 'On hand quantitty is required').trim().isLength({ min: 1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req)

        var item = new Item({
                name: req.body.name,
                category: (typeof req.body.category ==='undefined') ? [] : req.body.category,
                price: req.body.price,
                description: req.body.description,
                onHand: req.body.onHand,
                _id: req.params.id,
                avatar: req?.file?.filename,
            });
        if (!errors.isEmpty()){
            async.parallel({
                item: function(callback){
                    Item.find(callback);
                },
                categories: function(callback){
                    Category.find(callback)
                },
            }, function(err, results){
                if (err){ return next(err); }

                for(let i = 0; i < results.categories; i++){
                    if(category.length.indexOf(results.categories[i]._id) > -1){
                        results.categories[i].checked = 'true';
                    }
                }
                res.render('item_form', {title: 'Update Item', item: results.item, categories: results.categories, errors: errors.array()});
            });
            return
        }
        else {
            Item.findByIdAndUpdate(req.params.id, item, {}, function(err,theitem){
                if (err) { return next(err); }
                res.redirect(theitem.url)
            })
        }
    }

];

exports.item_delete_get = function(req, res){
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id ).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null){
            res.redirect('/inventory/items');
        }
        res.render('item_delete', {title: 'Delete Item', item: results.item})
    })
};

exports.item_delete_post = function(req, res){
    async.parallel({
        item: function(callback){
            Item.findById(req.params.id).exec(callback)
        }
    }, function(err, results){
        Item.findByIdAndRemove(req.body.itemid, function deleteItem(err){
            if (err) { return next(err); }
            res.redirect('/inventory/item')
        })
    })
};
