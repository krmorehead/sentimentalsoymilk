// var User = require('../models/users.js');
var Trips = require('../models/trips.js');
var TripItems = require('../models/tripItem.js');
var request = require('request');
var key = require('../env/config');
var async = require('async');
var yelp = require('../env/yelp').yelp;
var flickr = require('../env/flickr').flickr;
var User = require('./userController');

var filterTripData = function(responseObj) {
  return responseObj.reduce(function(totalData, item) {
    var location = item.venue.location;
    var photoURL = item.venue.featuredPhotos.items[0];
    var notes = item.tips === undefined ? '' : item.tips[0].text;
    var tripItem = {
      name: item.venue.name,
      address: location.address + ', ' + location.city + ', ' + location.state + ' - ' + location.cc,
      city: location.city,
      notes: notes,
      category: item.venue.categories[0].name,
      rating: item.venue.rating,
      photo: photoURL.prefix + '300x300' + photoURL.suffix,
      url: item.venue.url
    };
    totalData.push(tripItem);
    return totalData;
  }, []);
};



// <h4> parseCityName </h4>
// Accepts the decoded request url, reformats it and
// returns a string of the city name
var parseCityName = function(cityRequest) {
  var cityRequest = cityRequest.split(',');
  console.log(cityRequest);
  // var cityLowercase = cityRequest[0]
  var stateCountry = cityRequest[1]
  var location = handleSplitNames(cityRequest[0])
  if(cityRequest[1]){
    location += ", " + handleSplitNames(cityRequest[1])
  }
  return location;
}
//checks and formats names such as San Francisco and United States
var handleSplitNames = function(name){
  var parsedName = ''
  if (name.indexOf(' ') > 0) {
    var splitName = name.split(' ');
    var firstNameHalf = splitName[0][0].toUpperCase() + splitName[0].slice(1);
    var secondNameHalf = splitName[1][0].toUpperCase() + splitName[1].slice(1);
    parsedName += firstNameHalf + ' ' + secondNameHalf;
  } else {
    parsedName += name[0].toUpperCase() + name.slice(1);
  }
  return parsedName;
}

//test data
// console.log("FLICKR")
// flickr.getPhotos(["san francisco", " california"], console.log)
module.exports = {

  //all are optional accuracy defaults to 11 (city wide)
  //coordinates are not a great search parameter
  fetchPhotos : function(req, res){
    var text = parseCityName(decodeURI(req.url.split('/')[2]))
    // console.log("fetching photos", text)
    //arguments for the getPhotos function
    //text, tags(array), lat, lon, accuracy
    flickr.getPhotos(text, function(err, photosArray){
      if(err){
        console.log('flickr error', err)
        res.send(err)
      }else{
        // console.log("photos", photosArray)
        res.send(photosArray)
      }
    })
  },
  //<h4> get city data </h4>
  //grabs the city data from the query
  fetchCityData: function(req, res){
    var term = decodeURI(req.url.split('/')[2]).split(',')[2];
    if (term === 'undefined') {
      term = 'Tourist';
    }
    // var cityState = parseCityName(decodeURI(req.url.split('/')[2]));
    var latLon = parseCityName(decodeURI(req.url.split('/')[2])).replace(' ', '');
    yelp.search({
      term: term,
      // location: cityState
      ll: latLon
    }).then(function (data) {
      res.send(JSON.stringify(data.businesses));
    }).catch(function (err) {
      res.status(400).send(err);
    });
  },
  //<h4> searchStoredData </h4>
  // Parses the city name from the request url param and
  // checks to see if our database containss that city.
  // If we have a record for that city that is sent in the response,
  // otherwise fetch directly from the foursquare API using <h4> fetchCityData </h4>
  // and response with the API data
  // Method: GET
  // Route : /activities/*'

  //this function is deprecated as storing changing information
  //is not ideal
  // searchStoredData: function(req, res, next) {
  //   var city = parseCityName(decodeURI(req.url.split('/')[2]));
  //   console.log(city);
  //   TripItems.find({ city: city }, function(err, list) {
  //     if (list.length < 1) {
  //       // if (list.length < 1) {
  //       // City not cached; fetching data
  //       console.log("City not cached; fetching data");
  //       next();
  //     }
  //     else if (!err) {
  //       // Pulling list from DB
  //       console.log("Pulling list from DB");
  //       res.send(list);
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // },

  //<h4> fetchCityData </h4>
  // Fetches data from the Foursquare API if the data is not
  // already stored in our database
  // Method: GET
  // Route : /activities/*'

  //works for the foursquare api
  // fetchCityData: function(req, res, next) {
  //   var cityState = req.url.split('/')[2];
  //   return request('https://api.foursquare.com/v2/venues/explore?client_id='+key.API+'&client_secret='+key.SECRET+'&v=20130815&near='+cityState+'&venuePhotos=1', function(err, response, body) {
  //     // prevent server crashing when responseObj is undefined
  //     if (!err && JSON.parse(body).meta.code === 200) {
  //       var filteredResults = filterTripData(JSON.parse(body).response.groups[0].items);
  //       module.exports.saveCityData(filteredResults).then(function(results, err) {
  //         if (err) {
  //           res.send(err);
  //         }
  //       res.send(JSON.stringify(results));
  //       });
  //     } else {
  //       res.status(400).send(err);
  //     }
  //   });
  // },



  //<h4> fetchWeatherData </h4>
  // Gets the weather report for the location specified
  // at the time specified
  fetchWeatherData: function (req, res, next) {
    var urlParts = req.url.split('/');
    var lat = urlParts[3];
    var lon = urlParts[4];
    var date = urlParts[5].split('%20');

    var map = {
      'Jan':'01',
      'Feb':'02',
      'Mar':'03',
      'Apr':'04',
      'May':'05',
      'Jun':'06',
      'Jul':'07',
      'Aug':'08',
      'Sep':'09',
      'Oct':'10',
      'Nov':'11',
      'Dec':'12'
    };


    var year = date[3];
    var month = map[date[1]];
    var day = date[2];
    request('https://api.forecast.io/forecast/c1886414ac678c908104c2a20e4874c5/'+lat+','+lon+','+year+'-'+month+'-'+day+'T12:00:00', function (err, response, body) {
      if (!err) {
        res.send(body);
      }
    })
  },

  //<h4>  saveCityData </h4>
  // Adds the searched city to the database
  // Model: TripItems
  saveCityData: function(results, next) {
    return TripItems.create(results, function(err, results) {
      if (err) {
        console.log(err);
      }
    });
  },

  //<h4> createTrip </h4>
  // Accepts a JSON object to be stored.
  // Example : tripObj = {
    //   name: name,
    //   city: city,
    //   state: state,
    //   activities: activities,
    //   image: image
    // };
  // Method: PUT
  // Route : /trips

  createTrip: function(req, res, next) {
    var playlist = {
      name: req.body.name,
      destination: [req.body.city, req.body.state],
      activities: req.body.activities,
      image: req.body.image
    };
    console.log(req.body.activities)
    Trips.create(playlist, function(err, results) {
      if (err) {
        console.log(err);
      } else {
        //console.log('about to create playlist', results, 'user', req.user.username);
        //add created trip id to users trips array
        //if IG username is username, if google username is email
        if (!req.user.username) {
          User.addTrip(req.user.email, results._id);
          res.json(results);
        } else {
          //console.log('req user name', req.user.email);
          User.addTrip(req.user.username, results._id);
          res.json(results);

        }
      }
    });
  },

  //<h3> GetAllTrips </h3>
  // Returns a JSON of all the data present in the database
  // Method: Get
  // Route : /trips
  getAllTrips: function (req, res, next) {
    Trips.find(function (err, results) {
      res.send(results)
    });
  },

  //<h3> accessTrip </h3>
    // Returns a trip object with name, destination, and actitivites properties
    // Acitivties is an array
    // Method: Get
    // Route : /trips/*
  accessTrip: function(req, res, next) {
    var tripId = req.params.id;
    var fullActivities = {};
    fullActivities.list = [];
    Trips.findById({ _id: tripId }, function(err, trip) {
      if (err) {
        console.log("findById error", err)
        return err;
      } else {
        console.log("FindbyID Results", trip);
        // return trip
        res.send(trip);
      }
    })

    //was in use when the trip activities weren't being stored
    //with the tripId
    // .then(function(trip){
    //   fullActivities.name = trip.name;
    //   fullActivities.destination = trip.destination;
    //   var activityLength = trip.activities.length;
    //   trip.activities.forEach(function(tripId){
    //     TripItems.findById({ _id: tripId }, function(err, trip) {
    //       if (err) {
    //         console.log("Error finding TripItems by tripId", err)
    //       } else {
    //         fullActivities.list.push(trip);
    //         if(activityLength === fullActivities.list.length){
    //           res.send(fullActivities);
    //         }
    //       }
    //     });
    //   });
    // });
  }
};