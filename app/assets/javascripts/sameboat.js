// function getCoordinates(callmemaybe) {
  // navigator.geolocation.getCurrentPosition(callmemaybe);
// }

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
        // $.each([response, function(i, val) {
          // console.log(val);
        // });

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
              // console.log(obj.predictions.direction);

              $.each([obj], function(i, val) {
                for (var j = 0; j < val.predictions.length; j++) {
                  var obj1 = val.predictions[j];
                  // console.log(obj1);
                  if (obj1.direction != undefined) {
                    // console.log(allPred.direction);
                    $.each([obj1.direction], function(i, val) {
                      if (obj1.direction.prediction != undefined) {
                        for (var i = 0; i < obj1.direction.prediction.length; i++) {
                          var obj2 = obj1.direction.prediction[i];
                          // console.log(obj2.seconds);
                        };
                      } else {};
                      
                    });
                  } else {};
                };
              });

              // console.log(obj);

              // for (var j = 0; j < obj.predictions.length; j++) {
                // var allPredictions = obj.predictions[j];
                // console.log(allPredictions);

                // if (typeof allPredictions.direction != "undefined") {
                  // for (var k = 0; k < allPredictions.direction.prediction.length; k++) {
                    // var dirPred = allPredictions.direction.prediction[k];

                    // var stopTitle = allPredictions.stopTitle;
                    // var routeTag = allPredictions.routeTag;
                    // var directionTitle = allPredictions.direction.title;
                    // var timeInSeconds = dirPred.seconds;
                    // var timeInMinutes = dirPred.minutes;

                    // $("#schedules_table").find('tbody').append("<tr><td>" + timeInSeconds + " s</td><td>" + "<span class='badge bg-info'>" + routeTag + "</span> " + stopTitle + "<td></tr>");

                  // }; // ends for allPredictions.direction.prediction loop
                // }; // ends if allPredictions.direction is not undefined

                // Make and place nearby stops on map as markers
                var marker = new google.maps.Marker({
                  map: map,
                  position: tmpLatLng,
                  title: stopName
                });

                // var infoWindowContent = '<div id="content">'+
                  // '<div id="siteNotice">'+
                  // '</div>'+
                  // '<h3 id="firstHeading" class="firstHeading">' + stopName + '</h3>'+
                  // '<div id="bodyContent">'+
                  // '<p><b>'+stopTitle+'</b> will arrive in <b>'+stopTitle+' seconds ' +
                  // '('+stopTitle+' minutes)</b>. '+
                  // '<div id="counter"></div>'+
                  // '</div>'+
                  // '</div>';

              // }; // ends obj.predictions for loop

              // Binds stop markers on map with nextbusContent for each nearby stop 
              bindInfoWindow(marker, map);

            } // ends xmlParser1
        }); // ends nextbus ajax request

      } // ends for loop
    } // ends main success handler
  }); // ends main post ajax request to /nearby_stops
} // ends showTransit function