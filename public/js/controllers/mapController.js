angular.module('app.map', ['app.services'])

// ActivitiesData is a factory/service laoded from app.services
// $location is for redirecting
.controller('Map', function ($scope, $http, ActivitiesData, uiGmapGoogleMapApi) {

  uiGmapGoogleMapApi.then(function(maps) {
    //console.log('maps!', maps);
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 2 };
    console.log('scope map', $scope.map);
  });

  //<h4>ActivitiesData.getTrips</h4>
  // Is a function to get all trips to populate myTrips page
  // trips are stored in an $scope.tripResults as an array
  // ActivitiesData.getMyTrips()
  // .then(function(results) {
  //   $scope.tripResults = results.data;
  //   console.log(results.data);
  // });

  // <h4>$scope.viewTrip</h4>
  // Is a function called when a specific playlist/trip is clicked on
  // $scope.viewTrip = function (index) {
  //   // $scope.id stores the _.id for the specific trip
  //   var id = $scope.tripResults[index]._id;
  //   $location.path('/trip/' + id);
  // };
});