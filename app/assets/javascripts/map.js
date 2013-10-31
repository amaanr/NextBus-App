// Enable the visual refresh
google.maps.visualRefresh = true;

var map;
var stops;
var markers = [];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  // Instantiate autocomplete method for origin
  var startFrom = document.getElementById('start-from');
  var autoStartFrom = new google.maps.places.Autocomplete(startFrom);
  autoStartFrom.bindTo('bounds', map);
  // Instantiates autocomplete method for destination
  var endTo = document.getElementById('end-to');
  var autoEndTo = new google.maps.places.Autocomplete(endTo);
  autoEndTo.bindTo('bounds', map);

} // ends initialize function

function calcRoute() {

  var start = $('#start-from').val();
  var end = $('#end-to').val();
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'page:load', initialize);

// Binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(html);
    infowindow.open(map, marker);
  });
}