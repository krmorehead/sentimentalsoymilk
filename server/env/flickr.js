var Flickr = require('flickr').Flickr;


var flickr = new Flickr('d04e5aac7cf3921706e138faacd9f276', '7e1000af685d527d')

var flickrOptions = {
  api_key: "d04e5aac7cf3921706e138faacd9f276",
  secret: "7e1000af685d527d"
};

var flickr_params = {
  per_page: 18,
  page: 1,
  // geo_context: 2,
  // accuracy: 11,
  safe_search	: 1,
  text: "",
  sort: "relevance"
  // tag_mode: "all",
}


//gets photo objects from flickr that are then modified
// lat, lon, accuracy,
flickr.getPhotos = function(text, tags, lat, lon, accuracy, callback){
	var callback = arguments[arguments.length - 1]
	if(text){
		addText(text)
	}
	if(arguments.length > 2){
		addTags(tags)
	}
	if(arguments.length > 4){
		addGeo(lat, lon, accuracy)
	}
	
	flickr.executeAPIRequest("flickr.photos.search", flickr_params, false, function(err, result) {
	  // Show the error if we got one
	  console.log(flickr_params)
	  flickr_params["text"] = "";
	  if(err) {
	      callback(err);
	  }else{
	  	var urls = [];	  	
	  	var photos = result.photos.photo
	  	// console.log("photos in flickr", photos)
	  	for(var i = 0; i < photos.length; i++){
	  		urls.push({
	  			photoUrl : formatUrl(photos[i]),
	  			profileUrl : profileUrl(photos[i])
	  		})
	  	}
	  	callback(null , urls)
	  }
	});
}

var addText = function(text){
	flickr_params["text"] += text
}
//adds an array of tags to the params
var addTags = function(tags){
	flickr_params["tags"] = flickr_params["tags"] + "," + tags.join(",")
}

var addGeo = function(lat, lon, accuracy){
	flickr_params["lat"] = lat;
	flickr_params["lon"] = lon;
	flickr_params["accuracy"] = accuracy || 11;
}

//builds a image url from the flickr object returned
var formatUrl = function(photoObj, size){
	// farmId, serverId, userId, secret
	var url = "https://farm" + photoObj.farm
	+ ".staticflickr.com/" + photoObj.server
	+ "/" + photoObj.id
	+ "_" + photoObj.secret 
	// + "_" + size + ".jpg"
	if(size){
		url += size
	}
	return url
}

//builds the profile link grom the photoObj to avoid copyright issues
var profileUrl = function(photoObj){
	return "https://www.flickr.com/photos/" + photoObj.owner
	+ "/" + photoObj.id
}

module.exports = {
	flickr: flickr
}

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