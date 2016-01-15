angular.module('app.landing', ['app.services'])

// ActivitiesData a factory/service stored in app.services
// $location is for redirecting
.controller('LandingController', function ($scope, $http, ActivitiesData, $location, uiGmapGoogleMapApi) {

  // <h4>ActivitiesData.getTrips()</h4>
  // function that gets all the trips to populate the landing page
  // trips are stored in $scope.tripResults
  ActivitiesData.getTrips()
  .then(function(results) {
    $scope.tripResults = results.data;
  });

  // Redirect to view playlist information
  $scope.viewTrip = function (index) {
    // $scope.id is the mongoose _.id for the trip
    $scope.id = $scope.tripResults[index]._id;
    $location.path('/trip/' + $scope.id);
  };

  uiGmapGoogleMapApi.then(function(maps) {
    //console.log('maps!', maps);
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 2, options: {scrollwheel: false} };
    console.log('scope map', $scope.map);
  });
});