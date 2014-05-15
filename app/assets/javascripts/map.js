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
  // var startFrom = document.getElementById('start-from');
  // var autoStartFrom = new google.maps.places.Autocomplete(startFrom);
  // autoStartFrom.bindTo('bounds', map);
  // Instantiates autocomplete method for destination
  // var endTo = document.getElementById('end-to');
  // var autoEndTo = new google.maps.places.Autocomplete(endTo);
  // autoEndTo.bindTo('bounds', map);

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
      var parsed_results = parseJson(response);
      var distance = parsed_results[0];
      var duration = parsed_results[1];
      var speed = distance/(duration/60);
      directionsDisplay.setDirections(response);

      getCoordinates(function(position){

        $.ajax({
          url: "/plans",
          type: "POST",
          data: {
            plan: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              total_distance: distance,
              total_time: duration,
              start_address: start,
              end_address: end,
              speed: speed
            }
          },
        });
      })
    }
  });

}

function parseJson(response) {
  var distanceTotal = 0;
  var durationTotal = 0;
  for (i = 0; i < response.routes.length; i++) {
    var route = response.routes[i];
    for (j = 0; j < route.legs.length; j++) {
      var leg = route.legs[j];
      var distances = [];
      var durations = [];
      for (k = 0; k < leg.steps.length; k++) {
        var step = leg.steps[k];
        var instructions = leg.steps[k].instructions;
        var distance = step.distance.text;
        var distanceInM;
        // checks if km or m
        if (distance.split(" ")[1] == "km") {
          distance = parseFloat(distance);
        } else if (distance.split(" ")[1] == "m") {
          distanceInM = parseFloat(distance);
          distance = distanceInM/1000;
        } else {
          continue;
        };

        var duration = step.duration.text;

        var intTime = parseFloat(distance);
        var intDur = parseFloat(duration);
        distances.push(intTime);
        durations.push(intDur);
      }
      
      $.each(distances, function(){
        distanceTotal += this;
      });

      $.each(durations, function() {
        durationTotal += this;
      });

    }        
  }
  return [distanceTotal, durationTotal];
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
