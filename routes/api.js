var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller');

router.route('/address-to-lat-long/:address').get(controller.addressToLatLong);
router.route('/search-nearby-places/:lat&:long').get(controller.getNearbyPlaces);
router.route('/get-recent-media/:id').get(controller.getRecentMedia);

module.exports = router;
