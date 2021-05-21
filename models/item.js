var mongoose = require('mongoose');


var Schema = mongoose.Schema

var ItemSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    price: {type: Schema.Types.Decimal128, required: true},
    description: {type: String, required: true},
    onHand: {type: Number},
    avatar: {type: String}
});

ItemSchema
    .virtual('url')
    .get(function () {
        return '/inventory/item/' + this._id
    });

module.exports = mongoose.model('Item', ItemSchema)