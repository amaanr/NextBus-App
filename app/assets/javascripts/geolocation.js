// Enable the visual refresh
google.maps.visualRefresh = true;

var map;

function initialize() {
  var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Adds transit layer to map
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  // HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.watchPosition(showTransit),
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

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

  // Gets nearby transit stops
  function showTransit(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // var marker = new google.maps.Marker({
    //   position: new google.maps.LatLng(0.latitude, 0.longitude),
    //   map: map
    // });

    return $.ajax ({
        type: "POST",
        url: "/nearby_stops",
        data: {
          "latitude": latitude,
          "longitude": longitude
        }
        // success: function(stops) {
          // return Gmaps.map.replaceMarkers(stops);
        // }
    });
  }

} // ends initialize function

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);