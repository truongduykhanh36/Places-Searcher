var NodeGeocoder = require('node-geocoder');
var request = require('request-promise');

const googleAPIKey = 'AIzaSyD2uBO1BtjJy7Ww-hcg-Xpojw6tqqB2T_4';
const instagramAccessToken = '3059775173.e029fea.fb3b206362354648acb80e320219809e';

const callGeoCodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address={address-name}&key={google-api-key}';
const callPlacesSearchUrl = 'https://api.instagram.com/v1/locations/search?lat={latitude}&lng={longitude}&access_token={instagram-access-token}';
const callGetMediaUrl = 'https://api.instagram.com/v1/locations/{location-id}/media/recent?access_token={instagram-access-token}';

exports.addressToLatLong = function (req, res, next) {
    var result = {
        stt: 'ng',
        geometry: {
            lat: 0,
            long: 0
        }
    };

    var address = req.params.address;

    var options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: googleAPIKey,
        formatter: null
    };

    var geocoder = NodeGeocoder(options);

    geocoder.geocode(address, function(err, res1) {
        if (res1.length > 0) {
            result.stt = 'ok';
            result.geometry.lat = res1[0].latitude;
            result.geometry.long = res1[0].longitude;
        }
        res.json(result);
    });
};
exports.getNearbyPlaces = function (req, res, next) {
    let lat = req.params.lat;
    let long = req.params.long;
    let url = 'https://api.instagram.com/v1/locations/search?lat=' + lat + '&lng=' + long + '&access_token=' + instagramAccessToken;
    request(url).then(function (res1) {
        let result = JSON.parse(res1);
        res.json(result);
    })
};
exports.getRecentMedia = function (req, res, next) {
    let result = [
    ];
    let locationId = req.params.id;
    let url = 'https://api.instagram.com/v1/locations/' + locationId + '/media/recent?access_token=' + instagramAccessToken;
    request(url).then(function (res1) {
        let data = JSON.parse(res1);
        for (let i = 0; i < data.data.length; i++) {
            result.push({
                name: data.data[i].user.full_name,
                avatar: data.data[i].user.profile_picture,
                image: data.data[i].images.standard_resolution.url,
                link: data.data[i].link
            })
        }
        res.json(result);
    })
};

