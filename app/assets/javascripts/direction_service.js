var map;
var startDest = null;
var endDest = null;
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

  var control = document.getElementById('control');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  // Instantiate the autocomplete method for from and to searches
  // var startFrom = document.getElementById('start-from');
  // var autoStartFrom = new google.maps.places.Autocomplete(startFrom);
  // autoStartFrom.bindTo('bounds', map);
  // var endTo = document.getElementById('end-to');
  // var autoEndTo = new google.maps.places.Autocomplete(endTo);
  // autoEndTo.bindTo('bounds', map);

  // Instantiate the autocomplete method for search box
  var input = document.getElementById('target');
  var searchBox = new google.maps.places.Autocomplete(input);
  searchBox.bindTo('bounds', map);
  
}

function calcRoute() {
  // First, clear out any existing markerArray from previous calculations.
  for (i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Retrieve the start and end locations from the user and create a DirectionsRequest using TRANSIT directions.
  var start = $("#start-from").val(); //document.getElementById("start").value;
  var end = $("#end-to").val(); //document.getElementById("end").value;
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.TRANSIT
  };

  // var start = document.getElementById('start').value;
  // var end = document.getElementById('end').value;
  // var request = {
  //   origin: start,
  //   destination: end,
  //   travelMode: google.maps.TravelMode.DRIVING
  // };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);