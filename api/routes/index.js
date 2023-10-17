var express = require("express");
var router = express.Router();
var got = require("got");

require("dotenv").config();

/* GET forecast. */
router.get("/", function (req, res, next) {
  res.status(404).json({
    message: "Unsuccessful request",
  });
});

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
    .catch((err) => {
      res.status(500).json({
        message: "Unknown server error",
        error: err,
      });
    });
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
    .catch((err) => {
      res.status(500).json({
        message: "Unknown server error",
        error: err,
      });
    });
});

router.post(
  "/minuteclinic/visit-manager/api/appointment/v2/eligibility",
  (req, res) => {
    res.status(200).json({
      statusDescription: "Success",
      statusCode: "0000",
      subject: "LmxPbyBw",
      details: {
        confirmationNumber: "2G4LDD5",
        appointmentDateTime: "10/17/2023 13:30:00",
        firstName: "Bill",
        lastName: "Wen",
        reasonForVisit: "Illness/Injury",
        clinicId: "158",
        address1: "323 CROMWELL AVENUE, CORNER OF NEW BRITAIN AVENUE",
        city: "ROCKY HILL",
        state: "CT",
        zipCode: "06067",
        email: "noah.trexler@cvshealth.com",
        phoneNumber: "3332221111",
      },
    });
  }
);

module.exports = router;
