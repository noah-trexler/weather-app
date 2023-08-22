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
      res.status(200).json({
        message: "Successfully retrieved forecast data",
        locationData: location,
        forecastData: responseData.properties.periods,
      });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
