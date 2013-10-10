var map;
var startDest = null;
var endDest = null;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var stepDisplay;
var markerArray = [];

function initialize() {

  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  // Instantiate a directions renderer for the directions panel
  directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  // Create a renderer for directions and bind it to the map.
  var rendererOptions = {
    map: map
  }

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();

}

function insertInstructions(allSteps) {

  $.each(allSteps.routes, function passingRouteIndex(routeIndex, route){
    $.each(route.legs, function passingLegIndex(legIndex, leg){
      $.each(leg.steps, function passingStepIndex(stepIndex, step){
        // if it is a transit step then pass to another method that will get the stop ids based on the nearbys method. need to insert a unique id on each step durations spots
        console.log(step);
        $("#directionsInstructions").append("<div>" + step.instructions + " " + step.duration.text + "</div>");
        
        if (step.travel_mode=="TRANSIT") {
          // getBusStop("", step);
          $("#directionsInstructions").append("<div>" + step.transit.line.short_name + "</div>"); // Displays the short_name
        };
            
      });
    });
  });

}

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
  // var start = $("#start-from").val(); //document.getElementById("start").value;
  var end = $("#target").val(); //document.getElementById("end").value;
  var request = {
      origin: "126 Laurentide Drive",
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

google.maps.event.addDomListener(window, 'load', initialize);// window.onload = initialize;