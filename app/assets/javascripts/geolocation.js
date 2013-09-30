// Enable the visual refresh
google.maps.visualRefresh = true;

var map;
var stops;
var markers = [];

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
    
    // Sends nearby transit stops
    return $.ajax ({
        type: "POST",
        url: "/nearby_stops",
        data: {
          "latitude": latitude,
          "longitude": longitude
        },
        success: function(response) {
          console.log(response)
        },
        error: function(err) {
          alert("Something went wrong");
          console.error(err);
        }
    });
  }

  // Fetches the nearby stops and puts them on map as markers
  fetchStops();

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

// Fetch transit stops JSON from nearby_stops
// Loop through and populate the map with markers
var fetchStops = function() {
  
  var infowindow = new google.maps.InfoWindow({
    content: ''
  });

  $.ajax({
    url: '/nearby_stops',
    dataType: 'JSON',
    success: function(response) {
      if (response.status == 'OK') {
        stops = response.stops;

        // Loop through stops and add markers
        for (s in stops) {
          // Create gmap LatLng obj
          var tmpLatLng = new google.maps.LatLng(stops[s].latitude[0], stops[s].longitude[0]);

          // Make and place map marker
          var marker = new google.maps.Marker({
            map: map,
            position: tmpLatLng,
            title: stops[s].stop_name
          });
          bindInfoWindow(marker, map, infowindow, '<b>'+stops[s].stop_name);
        }
      }
    }
  })
};

// Binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(html);
    infowindow.open(map, marker);
  });
}
