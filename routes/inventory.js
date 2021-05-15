var express = require('express');
var router = express.Router();

var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

//item routes
router.get('/', item_controller.index);

router.get('/item/create', item_controller.item_create_get);
router.get('/item/create', item_controller.item_create_post);

router.get('/item/:id/delete', item_controller.item_delete_get);
router.get('/item/:id/delete', item_controller.item_delete_post);

router.get('/item/:id/update', item_controller.item_update_get);
router.get('/item/:id/update', item_controller.item_update_post);

router.get('/item/:id', item_controller.item_detail);

router.get('/item', item_controller.item_list);

//category routes
router.get('/category/create', category_controller.catergory_create_get);
router.get('/category/create', category_controller.catergory_create_post);

router.get('/category/:id/delete', category_controller.catergory_delete_get);
router.get('/category/:id/delete', category_controller.catergory_delete_post);

router.get('/category/:id/update', category_controller.catergory_update_get);
router.get('/category/:id/update', category_controller.catergory_update_post);

router.get('/category', category_controller.category_list)

router.get('/category/:id', category_controller.category_detail)

module.exports = router;