var router = require("express").Router();
var got = require("got");

require("dotenv").config();

router.get("/", (req, res) => {
  res.status(404).json({
    message: "Unsuccessful request",
  });
});

/* GET forecast. */
router.get("/forecast", (req, res) => {
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
    .catch((err) => {
      res.status(500).json({
        message: "Unknown server error",
        error: err,
      });
    });
});

router.get("/geocode", (req, res) => {
  got(
    `https://api.geoapify.com/v1/geocode/search?text=${req.query.text}&apiKey=${process.env.GEOAPIFY_KEY}`
  )
    .json()
    .then((responseData) => {
      if (responseData.features.length <= 0) {
        throw new Error("Could not interpret location data response");
      }
      res.status(201).json({
        message: "Successfully retrieved geocoding data",
        lat: responseData.features[0].properties.lat,
        lon: responseData.features[0].properties.lon,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Unknown server error",
        error: err,
      });
    });
});

module.exports = router;
