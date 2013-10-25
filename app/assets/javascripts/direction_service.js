var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(43.757192, -79.337571) // Toronto
  };
  var map = new google.maps.Map(document.getElementById('map-directions'),
      mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  // var control = document.getElementById('control');
  // control.style.display = 'block';
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  // Instantiate autocomplete method for origin
  var startFrom = document.getElementById('start-from');
  var autoStartFrom = new google.maps.places.Autocomplete(startFrom);
  autoStartFrom.bindTo('bounds', map);
  // Instantiates autocomplete method for destination
  var endTo = document.getElementById('end-to');
  var autoEndTo = new google.maps.places.Autocomplete(endTo);
  autoEndTo.bindTo('bounds', map);

}

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