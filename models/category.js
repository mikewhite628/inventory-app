var mongoose = require('mongoose');

var Schema = mongoose.Schema

var CategorySchema = new Schema ({
    name: { type: String, required: true},
    image: { type: String }
});

CategorySchema
    .virtual('url')
    .get(function (){
        return '/inventory/category/' + this._id
    });

CategorySchema
    .virtual('category')
    .get(function() {
        return this.name
    });

module.exports = mongoose.model('Category', CategorySchema)