var Item = require('../models/item');

//Display item list
exports.index = function(req,res) {
    res.send('NOT IMLEMENTED: Site Home Page')
}

exports.item_list = function(req, res){
    res.send('NOT IMPLEMENTED: Item List')
};

exports.item_description = function(req,res){
    res.send('NOT IMPLEMENTED: Item Description' + req.params.id)
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
