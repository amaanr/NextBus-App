var map;

function initialize() {
  var myLatlng = new google.maps.LatLng(43.757673,-79.338092);
  var mapOptions = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Adds transit layer to map
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
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

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });
}

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

var locations = [
  ['York Mills Rd at Laurentide Dr', 43.757673, -79.338092, 1],
  ['York Mills Rd at Lochinvar Cres', 43.757594, -79.339251, 2],
  ['44 Valley Woods Rd', 43.755176, -79.333417, 3],
  ['Opposite 44 Valley Woods Rd', 43.755207, -79.333319, 4]
];

google.maps.event.addDomListener(window, 'load', initialize);