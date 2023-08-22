var express = require("express");
var router = express.Router();
var got = require("got");

require("dotenv").config();

/* GET forecast. */
router.get("/forecast", function (req, res, next) {
  var location = "";
  got(`https://api.weather.gov/points/${req.query.lat},${req.query.lon}`)
    .json()
    .then((responseData) => {
      location = responseData.properties.relativeLocation.properties;
      return got(responseData.properties.forecast).json();
    })
    .then((responseData) => {
      res.status(201).json({
        message: "Successfully retrieved forecast data",
        locationData: location,
        forecastData: responseData.properties.periods,
      });
    })
    .catch((err) => console.error(err));
});

router.get("/geocode", function (req, res, next) {
  got(
    `https://api.geoapify.com/v1/geocode/search?text=${req.query.text}&apiKey=${process.env.GEOAPIFY_KEY}`
  )
    .json()
    .then((responseData) => {
      if (responseData.features.length > 0) {
        res.status(201).json({
          message: "Successfully retrieved geocoding data",
          lat: responseData.features[0].properties.lat,
          lon: responseData.features[0].properties.lon,
        });
      } else {
        res.status(500).json({
          message: "Could not interpret location data response.",
        });
      }
    })
    .catch(console.error);
});

module.exports = router;
