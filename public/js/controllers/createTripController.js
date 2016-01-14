
//  This controller applies to the createTrip.html
angular.module('app.create', ['app.services'])

//  Factory functions are loaded in in 'ActivitiesData' from 'app.services'
.controller('CreateTripController', function ($scope, $http, ActivitiesData) {
  
  // $scope.formCompleted is a variable to determine if the form is completed
  // if it's false, the form with show
  // if true, the form will hide and the right side of page will populate
  $scope.formCompleted = false;
  
  // <h3>startItinerary is a function to: </h3>
    // 1. hide the form
    // 2. trigger the search
  $scope.startItinerary = function () {
    console.log('start itinerary');
    // this if block ensures that the Itinerary Name City and State are present 
    // before submitting the form
    if (!$scope.itineraryName || !$scope.city || !$scope.state) {
      return;
    } else {
      // $scope.formCompleted set to true removes the form and begins populating 
      // the rest of the page.
      $scope.formCompleted = true;
      $http.get('/activities/' + $scope.city + ',' + $scope.state)
        .success(function (data) {
          // $scope.activities is an array of all the activities found by the api
          // at the given destination
          $scope.activities = data;
          console.log($scope.activities)
        });
      }
  };

  $scope.getWeather = function (activity) {
    var lat = activity.location.coordinate.latitude;
    var lon = activity.location.coordinate.longitude;
    $http.get('/api/weather/'+lat+'/'+lon)
      .success(function (data) {
        activity.weather = {};
        activity.weather.max = data.daily.data[0].temperatureMax;
        activity.weather.min = data.daily.data[0].temperatureMin;
        activity.weather.summary = data.daily.data[0].summary;
        console.log(activity.weather)
      }) 
  }

  // $scope.itinerary is an emtpy array that will contain all the activities the user will add
  // to their trip
  $scope.itinerary = []; 

  // <h4>$scope.addToTrip</h4> 
  // Is a function that that adds an activity from the api to the users itinerary
  $scope.addToTrip = function(){
    // The first item added to the itinerary will be the item whose photo is stored with the trip
    if ($scope.itinerary.length === 0) {
      $scope.itineraryImage = this.activity.image_url;
    }
    $scope.itinerary.push(this.activity);
  };

  // <h4>$scope.removeFromTrip</h4>
  // Is a function that removes an item from the users itinerary
  $scope.removeFromTrip = function () {
    var index = $scope.itinerary.indexOf(this.activity);
    $scope.itinerary.splice(index, 1);
  };

  // <h4>$scope.saveItinerary</h4>
  // Is a function that creates an object containing all the relevant information to a users itinerary
  // the object is sent to the server and DB through the factory function ActivitiesData.createTrip
  // see the documentation on services.js for more information.
  $scope.saveItinerary = function () {
    // POST request to /trips with $scope.itinerary 
    // var activityIds = $scope.itinerary.map(function (activity) {
    //   return activity._id;
    // });
    //angular hashes the objects in the array, this removes that for mongo
    var activities = angular.toJson($scope.itinerary)
    console.log("ACTIVITY:", $scope.itinerary);
    var tripObj = {
      name: $scope.itineraryName,
      city: $scope.city,
      state: $scope.state,
      activities: activities,
      image: $scope.itineraryImage
    };
    var trip = JSON.stringify(tripObj);
    ActivitiesData.createTrip(trip);
  };


  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
    console.log($scope.dt);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };

});