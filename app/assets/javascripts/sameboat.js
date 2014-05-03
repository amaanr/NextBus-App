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

              var timeInSeconds;
              var routeTag;
              var stopTitle;
              var directionTitle;

              $.each([obj], function(i, val) {
                for (var j = 0; j < val.predictions.length; j++) {
                  var obj1 = val.predictions[j];
                  if (obj1.direction != undefined) {
                    $.each([obj1.direction], function(i, val) {
                      if (obj1.direction.prediction != undefined) {
                        for (var i = 0; i < obj1.direction.prediction.length; i++) {
                          var obj2 = obj1.direction.prediction[i];

                          timeInSeconds = obj2.seconds;
                          routeTag = obj1.routeTag;
                          stopTitle = obj1.stopTitle;
                          directionTitle = obj1.direction.title;

                          $("#schedules_table").find('tbody').append("<tr><td>" + timeInSeconds + " s</td><td>" + "<span class='badge bg-info'>" + routeTag + "</span> " + directionTitle + "<td></tr>");

                        };
                      } else {};
                      
                    });
                  } else {};
                };
              }); // ends each on obj

                // Make and place nearby stops on map as markers
                var marker = new google.maps.Marker({
                  map: map,
                  position: tmpLatLng,
                  title: stopName
                });

                // function toDateTime(timeInSeconds) {
                  // var t = new Date(1970,0,1);
                  // t.setSeconds(timeInSeconds);
                  // return t;
                  // alert(t);
                // }

                var infoWindowContent = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">' + stopName + '</h3>'+
                  '<div id="bodyContent">'+
                  '</div>'+
                  '</div>';

              // Binds stop markers on map with nextbusContent for each nearby stop 
              bindInfoWindow(marker, map, infowindow, infoWindowContent);

            } // ends xmlParser function
        }); // ends nextbus ajax request

      } // ends for loop
    } // ends main success handler
  }); // ends main post ajax request to /nearby_stops
} // ends showTransit function