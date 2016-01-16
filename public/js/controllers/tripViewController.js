angular.module('app.trip', ['app.services'])

// ActivitiesData is a factory/service loaded from app.services
// $routeParams is used to get the trip mongoose _.id
.controller('TripController', function ($scope, $http, ActivitiesData, $routeParams, uiGmapGoogleMapApi, Map, $window) {

  // $scope.id stores the trip mongoose _.id
  $scope.id = $routeParams.id;

  // ActivitiesData.getTripActivities returns and object containing
  // the details for each activity stored in this trip
  // $scope.activities stores an array of all activities
  // $scope.name stores the name of the trip/playlist
  // $scope.destination stores the destionation of the trip
  ActivitiesData.getTripActivities($scope.id, function (trip) {
    console.log('trip ', trip);
    $scope.activities = trip.activities;
    $scope.name = trip.name;
    $scope.destination = trip.destination;
  }).then(function() {

    console.log('activities', $scope.activities);
    $scope.buildActivityMarkers();

    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i < $scope.markers.length; i++) {
      var m = new google.maps.LatLng($scope.markers[i].coords.latitude, $scope.markers[i].coords.longitude);
      bounds.extend(m);
    }

    $scope.map.bounds = {
      northeast: {
        latitude: bounds.getNorthEast().lat(),
        longitude: bounds.getNorthEast().lng()
      },
      southwest: {
        latitude: bounds.getSouthWest().lat(),
        longitude: bounds.getSouthWest().lng()
      }
    };

  });

  $scope.viewActivity = function (index) {
    // $scope.id is the mongoose _.id for the trip
    //$scope.id = $scope.tripResults[index]._id;
    //$location.path($);
    $window.open($scope.activities[index].url, '_blank');
  };

  $scope.getMarkerImg = function (index) {
    // $scope.id is the mongoose _.id for the trip
    //$scope.id = $scope.tripResults[index]._id;
    //$location.path($);
    return $scope.activities[index].image_url;
  };

  $scope.buildActivityMarkers = function() {
    $scope.markers = Map.buildActivityMarkers($scope.activities);
    $scope.markers.forEach(function(currMarker) {
      currMarker.events = {
        click: function(markers, eventName, model, args) {
          $scope.viewActivity(currMarker.index);
        },
        mouseover: function(markers, eventName, model, args) {
          this.getGMarker().setIcon($scope.getMarkerImg(currMarker.index));
        },
        mouseout: function(markers, eventName, model, args) {
          this.getGMarker().setIcon('http://www.googlemapsmarkers.com/v1/0077ed');
        }
      };
    });
  };

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.map = { center: { latitude: 40, longitude: -99 }, zoom: 8, options: {scrollwheel: false, styles: Map.stylesArr}, control: {} };
    //console.log('scope map', $scope.map);
  });

})