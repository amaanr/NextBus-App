var map;
var startDest = null;
var endDest = null;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var stepDisplay;
var markerArray = [];
var predictions;
var nearbys;

function initialize() {

  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  // Instantiate a directions renderer for the directions panel
  directionsDisplay = new google.maps.DirectionsRenderer();

  // Create a map and center it on home.
  var mapOptions = {
    center: new google.maps.LatLng(43.7571855, -79.33758584),
    disableDefaultUI: true,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  }

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  // Create a renderer for directions and bind it to the map.
  var rendererOptions = {
    map: map
  }

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();

  // Instantiate the autocomplete method for from and to searches
  var startFrom = document.getElementById('start-from');
  var autoStartFrom = new google.maps.places.Autocomplete(startFrom);
  autoStartFrom.bindTo('bounds', map);
  var endTo = document.getElementById('end-to');
  var autoEndTo = new google.maps.places.Autocomplete(endTo);
  autoEndTo.bindTo('bounds', map);
}

// TRYING SHIT
function insertExtraInstructions(extraSteps) {
  $.each(extraSteps.steps, function passingStepsIndex(stepsIndex, step){
    console.log(step);
    $("#directionsInstructions").append("<div>" + step.instructions + "</div>");
  });
}


function insertInstructions(allSteps) {

  $.each(allSteps.routes, function passingRouteIndex(routeIndex, route){
    $.each(route.legs, function passingLegIndex(legIndex, leg){
      $.each(leg.steps, function passingStepIndex(stepIndex, step){
        // if it is a transit step then pass to another method that will get the stop ids based on the nearbys method. need to insert a unique id on each step durations spots
        console.log(step);
        $("#directionsInstructions").append("<div>" + step.instructions + " " + step.duration.text + "</div>");
        
        if (step.travel_mode=="TRANSIT") {
          getBusStop("", step);
          $("#directionsInstructions").append("<div>" + step.transit.line.short_name + "</div>"); // Displays the short_name
        };
            
      });
    });
  });

}

// Gets nearby location
function getBusStop(uid, step){
  console.log("getBusStop");
    $.ajax({
      dataType: "xml",
      url: "/nearby?latitude="+step.start_location.Ya+"&longitude="+step.start_location.Za
 }).done(function (data){
    console.log(data);
    nearbys = data;
    console.log(nearbys);
 });
};

// Passes stop_code into NextBus url
function getNextBus(uid, stopId){
  console.log("getNextBus");
    $.ajax({
      dataType: "xml",
      url: "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="+stopId
  }).done(function (data){
    console.log (data);
    predictions = data;
    $($(predictions).find("predictions[routeTitle='7-Bathurst'] direction prediction")[0]).attr("seconds");
    console.log(predictions);
  // Update UID
  });
};

// function insertInspections(allSteps)
//     allsteps.routes do |legIndex, leg|
//         leg.each do |stepIndex, step|
//             uid = legIndex+"-"stepIndex
//             "<span id=\""+uid+"\">"+step.duration+"</span>"
//             getBusStop(uid,step)
//         end
//     end
// end

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

  // Route the directions and pass the response to a function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      console.log (response);
      var warnings = document.getElementById("warnings_panel");
      // warnings.innerHTML = "" + response.routes[0].warnings + "";
      directionsDisplay.setDirections(response);
      showSteps(response);
      // allSteps = response;
      insertInstructions(response);
      // getNextBus();
    }
  });
}

function showSteps(directionResult) {
  // For each step, place a marker, and add the text to the marker's info window. Also attach the marker to an array so we can keep track of it and remove it when calculating new routes.
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = new google.maps.Marker({
        position: myRoute.steps[i].start_point,
        map: map
      });
      attachInstructionText(marker, myRoute.steps[i].instructions);
      markerArray[i] = marker;
  }
}

function attachInstructionText(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });

  // create for each and loop over each legs and steps in all the legs and print that out using: $("#directionsPanel").append("<div>"+allSteps.routes[0].legs[0].steps[0].instructions+"</div>")


}

google.maps.event.addDomListener(window, 'load', initialize);
// window.onload = initialize;