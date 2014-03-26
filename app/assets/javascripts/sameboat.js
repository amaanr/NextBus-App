function getCoordinates(callmemaybe) {
  navigator.geolocation.getCurrentPosition(callmemaybe);
}

// Gets nearby transit stops
function showTransit(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  // var latitude = 43.757192;
  // var longitude = -79.337571;

  var infowindow = new google.maps.InfoWindow({
    content: ''
  });

  // Finds nearby stops from OpenData CSV
  $.ajax ({
    type: "POST",
    url: "/nearby_stops",
    data: {
      "latitude": latitude,
      "longitude": longitude
    },
    success: function(response) {
      for (var i = 0; i < response.length; i++) {
        // Creates LatLng obj
        var tmpLatLng = new google.maps.LatLng(response[i].latitude, response[i].longitude);
        // stopName only needed if NextBus stopTitle fails
        var stopName = response[i].stop_name;

        // Gets NextBus arrivalTimes
        $.ajax ({
          async: false,
          cache: false,
          type: "GET",
          url: "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="+response[i].stop_code,
          dataType: "xml",
          success:
            function xmlParser(xml) {
              var obj = $.xml2json(xml);

              for (var i = 0; i < obj.predictions.length; i++) {
                var allPredictions = obj.predictions[i];
                
                if (typeof allPredictions.direction != "undefined") {
                  for (var j = 0; j < allPredictions.direction.prediction.length; j++) {
                    var dirPred = allPredictions.direction.prediction[j];

                    var stopTitle = allPredictions.stopTitle;
                    var routeTag = allPredictions.routeTag;
                    var directionTitle = allPredictions.direction.title;
                    var timeInSeconds = dirPred.seconds;
                    var timeInMinutes = dirPred.minutes;

                    $("#schedules_table").find('tbody').append("<tr><td>" + timeInSeconds + " s</td><td>" + "<span class='badge bg-info'>" + routeTag + "</span> " + stopTitle + "<td></tr>");

                  }; // ends for allPredictions.direction.prediction loop
                }; // ends if allPredictions.direction is not undefined

                // Make and place nearby stops on map as markers
                var marker = new google.maps.Marker({
                  map: map,
                  position: tmpLatLng,
                  title: stopTitle
                });

                var infoWindowContent = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">' + stopTitle + '</h3>'+
                  '<div id="bodyContent">'+
                  '<p><b>'+directionTitle+'</b> will arrive in <b>'+timeInSeconds+' seconds ' +
                  '('+timeInMinutes+' minutes)</b>. '+
                  '<div id="counter"></div>'+
                  '</div>'+
                  '</div>';

              }; // ends obj.predictions for loop

              // Binds stop markers on map with nextbusContent for each nearby stop 
              bindInfoWindow(marker, map, infowindow, infoWindowContent);

            } // ends xmlParser1
        }); // ends nextbus ajax request

      } // ends for loop
    } // ends main success handler
  }); // ends main post ajax request to /nearby_stops
} // ends showTransit function