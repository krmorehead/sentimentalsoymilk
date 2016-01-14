var Flickr = require('flickr').Flickr;

var flickrOptions = {
  api_key: "d04e5aac7cf3921706e138faacd9f276",
  secret: "7e1000af685d527d"
};

var flickr = new Flickr('d04e5aac7cf3921706e138faacd9f276', '7e1000af685d527d')
var flickr_params = {
  per_page: 25,
  page: 1,
  geo_context: 2,
}

//adds an array of tags to the params
flickr.addTags = function(tags){
	flickr_params["tags"] = tags.join(",")
}

flickr.addGeo = function(lat, lon){
	flickr_params["lat"] = lat;
	flickr_params["lon"] = lon;
	flickr_params["accuracy"] = 11;
}

//builds a image url from the flickr object returned
flickr.formatUrl = function(photoObj, size){
	// farmId, serverId, userId, secret
	var url = "https://farm" + photoObj.farm
	+ ".staticflickr.com/" + photoObj.server
	+ "/" + photoObj.id
	+ "_" + photoObj.secret + ".jpg"
	if(size){
		url += size
	}
	return url
}

flickr.executeAPIRequest("flickr.photos.search", flickr_params, false, function(err, result) {
  // Show the error if we got one
  if(err) {
      console.log("FLICKR ERROR: " + err);

      return;
  }else{
  	console.log(result.photos)
  }
});

//formula for making a link to image
//
// https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
// + _{size}

// s	small square 75x75
// q	large square 150x150
// t	thumbnail, 100 on longest side
// m	small, 240 on longest side
// n	small, 320 on longest side
// -	medium, 500 on longest side
// z	medium 640, 640 on longest side
// c	medium 800, 800 on longest side†
// b	large, 1024 on longest side*
// h	large 1600, 1600 on longest side†
// k	large 2048, 2048 on longest side†

// Key:
// d04e5aac7cf3921706e138faacd9f276

// Secret:
// 7e1000af685d527d