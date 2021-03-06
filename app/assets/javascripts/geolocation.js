// HTML5 geolocation
function geolocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showTransit),
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here.'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });

  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
} // ends geolocation

// If browser/device doesn't support geolocation, do this
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(43.6525,79.3836),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(new google.maps.LatLng(43.6525,79.3836));
}
