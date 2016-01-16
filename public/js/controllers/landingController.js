angular.module('app.landing', ['app.services'])

// ActivitiesData a factory/service stored in app.services
// $location is for redirecting
.controller('LandingController', function ($scope, $http, ActivitiesData, $location, uiGmapGoogleMapApi, Map) {

  // <h4>ActivitiesData.getTrips()</h4>
  // function that gets all the trips to populate the landing page
  // trips are stored in $scope.tripResults
  ActivitiesData.getTrips()
  .then(function(results) {
    $scope.tripResults = results.data;
    //console.log('all trips!', $scope.tripResults[0].activities[0].location.coordinate);
    $scope.buildMarkers();

  });

  // Redirect to view playlist information
  $scope.viewTrip = function (index) {
    // $scope.id is the mongoose _.id for the trip
    $scope.id = $scope.tripResults[index]._id;
    $location.path('/trip/' + $scope.id);
  };

  $scope.buildMarkers = function() {
    $scope.markers = Map.buildMarkers($scope.tripResults);
    $scope.markers.forEach(function(currMarker) {
      currMarker.events = {
        click: function(markers, eventName, model, args) {
          $scope.viewTrip(currMarker.index);
        }
      };
    });
  };

  uiGmapGoogleMapApi.then(function(maps) {
    //console.log('maps!', maps);
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 2, options: {scrollwheel: false, styles: Map.stylesArr} };
    //console.log('scope map', $scope.map);
    $scope.buildMarkers();

  });
});