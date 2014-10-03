// Gets nearby transit stops
function showTransit(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  
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
    error: function(data) {
      window.location.replace("http://sameboat.co/lakfd"); //amaan update this
    },
    success: function(response) {
      for (var i = 0; i < response.length; i++) {

        // Creates LatLng obj
        var tmpLatLng = new google.maps.LatLng(response[i].latitude, response[i].longitude);
        // stopName only needed if NextBus stopTitle fails
        var stopName = response[i].stop_name;

        $.ajax({
          async: false,
          cache: false,
          type: "GET",
          url: "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=" + response[i].stop_code,
          dataType: "JSON",
          success: function (data) {
              var array = []
              var prediction_object = {}
              var predictions = data["predictions"]
              for (var x in predictions) {
                  if (!predictions[x].hasOwnProperty("dirTitleBecauseNoPredictions")) {
                      var routeTag = data["predictions"][x]["routeTag"]
                      var stopTitle = data["predictions"][x]["stopTitle"]
                  }
                  if (predictions[x].hasOwnProperty("direction")) {
                      var direction = predictions[x]["direction"]
                      var directionTitle = direction.title
                      var prediction = direction["prediction"]
                      for (var y in prediction) {
                          var directionCode = directionTitle.substring(0,1);
                          
                          var n = directionTitle.indexOf("towards");
                          var directionLength = directionTitle.length;
                          var heading = directionTitle.substring(n,directionLength);
                        
                              var timeInSeconds = prediction[y]["seconds"]
                              var branchCode = prediction[y]["branch"]
                              prediction_object = {
                                  "routeTag": routeTag,
                                  "stopTitle": stopTitle,
                                  "directionTitle": directionTitle,
                                  "timeInSeconds": timeInSeconds,
                                  "branchCode": branchCode,
                                  "heading": heading,
                                  "directionCode": directionCode
                              }
                              array.push(prediction_object)
                          }
                      }
                  }
            var html_string = ""
            
            for(var i=0;i<array.length;i++) {
              html_string += "<tr><td><a href='https://www.ttc.ca/Routes/" + array[i].routeTag + "/RouteDescription.jsp?tabName=map' target='_blank'><span class='badge bg-success'>" + array[i].directionCode + "</span> <small class='label bg-light'>" + array[i].branchCode + "</small></a></td><td class='cellDepartsIn' data-seconds="+array[i].timeInSeconds+"></td><td>" + array[i].stopTitle + "</td><td>" + array[i].heading + "</td></tr>";
              }
            
            $("#schedules_table").find('tbody').append($(html_string))
            
            // var image = "http://i.imgur.com/aMW2NfO.png";
                // Make and place nearby stops on map as markers
                var marker = new google.maps.Marker({
                  map: map,
                  position: tmpLatLng,
                  title: stopName
		              // icon: image
                });

                var infoWindowContent = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">' + stopName + '</h3>'+
                  '<div id="bodyContent">'+
                  '</div>'+
                  '</div>';

              // Binds stop markers on map with nextbusContent for each nearby stop 
              bindInfoWindow(marker, map, infowindow, infoWindowContent);
          }
      });

      } // ends for loop
    } // ends main success handler
  }); // ends main post ajax request to /nearby_stops
} // ends showTransit function

// $('table#schedules_table').tablesorter();
// $("table#schedules_table").trigger("update");
