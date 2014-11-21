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
            var array = [];
            var locationsArray = [];
            var prediction_object = {};
            var locations_object = {};
            var predictions = data["predictions"]
            $.each([predictions], function(i, val) {
              if ($.isArray(predictions) == true) {
                for (var i = 0; i < predictions.length; i++) {
                  if (!predictions[i].hasOwnProperty("dirTitleBecauseNoPredictions")) {
                    var routeTag = predictions[i]["routeTag"];
                    var stopTitle = predictions[i]["stopTitle"];
                  };
                  if (predictions[i].hasOwnProperty("direction")) {
                    var direction = predictions[i]["direction"];

                    if ($.isArray(direction) == true) {
                      for (var k = 0; k < direction.length; k++) { // need to check if direction is array
                        var directionTitle = direction[k].title;
                        var prediction = direction[k]["prediction"];

                        for (var l = 0; l < prediction.length; l++) {
                          var directionCode = directionTitle.substring(0,1);

                          var n = directionTitle.indexOf("towards");
                          var directionLength = directionTitle.length;
                          var headingDesc = directionTitle.substring(n, directionLength);

                          var timeInSeconds = prediction[l]["seconds"]
                          var branchCode = prediction[l]["branch"]
                          var dirTag = prediction[l]["dirTag"]

                          prediction_object = {
                              "routeTag": routeTag,
                              "stopTitle": stopTitle,
                              "directionTitle": directionTitle,
                              "timeInSeconds": timeInSeconds,
                              "branchCode": branchCode,
                              "headingDesc": headingDesc,
                              "directionCode": directionCode,
                              "dirTag": dirTag
                          }
                          
                          locations_object = {
                            "routeTag": routeTag,
                            "stopTitle": stopTitle,
                            "directionCode": directionCode,
                            "branchCode": branchCode,
                            "headingDesc": headingDesc,
                            "dirTag": dirTag
                          }
                          array.push(prediction_object);
                          locationsArray.push(locations_object);

                        };
                      };
                    }; // end check if direction is array

                    var directionTitle = direction.title;
                    var prediction = direction["prediction"];

                    if ($.isArray(prediction) == true) {

                      for (var j = 0; j < prediction.length; j++) {
                        var directionCode = directionTitle.substring(0,1);

                        var n = directionTitle.indexOf("towards");
                        var directionLength = directionTitle.length;
                        var headingDesc = directionTitle.substring(n, directionLength);

                        var timeInSeconds = prediction[j]["seconds"]
                        var branchCode = prediction[j]["branch"]
                        var dirTag = prediction[j]["dirTag"]

                        prediction_object = {
                            "routeTag": routeTag,
                            "stopTitle": stopTitle,
                            "directionTitle": directionTitle,
                            "timeInSeconds": timeInSeconds,
                            "branchCode": branchCode,
                            "headingDesc": headingDesc,
                            "directionCode": directionCode,
                            "dirTag": dirTag
                        }
                        locations_object = {
                            "routeTag": routeTag,
                            "stopTitle": stopTitle,
                            "directionCode": directionCode,
                            "branchCode": branchCode,
                            "headingDesc": headingDesc,
                            "dirTag": dirTag
                          }
                          array.push(prediction_object);
                          locationsArray.push(locations_object);

                      };
                    };
                  };
                }
              } // end if array
              if ($.isArray(predictions) == false) {
                if (!predictions.hasOwnProperty("dirTitleBecauseNoPredictions")) {
                  var routeTag = predictions["routeTag"];
                  var stopTitle = predictions["stopTitle"];

                  if (predictions.hasOwnProperty("direction")) {
                    var direction = predictions["direction"];

                    var directionTitle = direction.title;
                    var prediction = direction["prediction"];

                    for (var j = 0; j < prediction.length; j++) {
                      var directionCode = directionTitle.substring(0,1);

                      var n = directionTitle.indexOf("towards");
                      var directionLength = directionTitle.length;
                      var headingDesc = directionTitle.substring(n, directionLength);

                      var timeInSeconds = prediction[j]["seconds"]
                      var branchCode = prediction[j]["branch"]
                      var dirTag = prediction[j]["dirTag"]

                      prediction_object = {
                        "routeTag": routeTag,
                        "stopTitle": stopTitle,
                        "directionTitle": directionTitle,
                        "timeInSeconds": timeInSeconds,
                        "branchCode": branchCode,
                        "headingDesc": headingDesc,
                        "directionCode": directionCode,
                        "dirTag": dirTag
                      }
                      locations_object = {
                            "routeTag": routeTag,
                            "stopTitle": stopTitle,
                            "directionCode": directionCode,
                            "branchCode": branchCode,
                            "headingDesc": headingDesc,
                            "dirTag": dirTag
                          }
                      array.push(prediction_object);
                      locationsArray.push(locations_object);
                    };
                  };
                };
              }; // end if not array
            }); // end each method
            var html_string = "";
            var html_locations_string = ""; 

            // locations array
            var uniqueLocations = $.unique(locationsArray);
            var uniqLocObject = {
              "routeTag":uniqueLocations[0].routeTag,
              "stopTitle":uniqueLocations[0].stopTitle,
              "directionCode":uniqueLocations[0].directionCode,
              "branchCode":uniqueLocations[0].branchCode,
              "headingDesc":uniqueLocations[0].headingDesc,
              "dirTag":uniqueLocations[0].dirTag
            }
            html_locations_string += "<li data-value='' data-selected=''><a href='#'><span class='badge bg-success'>" + uniqLocObject.directionCode + "</span>&nbsp;<small class='label bg-light'>" + uniqLocObject.branchCode + "</small>&nbsp;" + uniqLocObject.headingDesc + "</a></li>"


            for(var i = 0; i < array.length; i++) {
              html_string += "<tr><td><a href='https://www.ttc.ca/Routes/" + array[i].routeTag + "/RouteDescription.jsp?tabName=map' target='_blank'><span class='badge bg-success'>" + array[i].directionCode + "</span> <small class='label bg-light'>" + array[i].branchCode + "</small></a></td><td class='cellDepartsIn' data-seconds="+array[i].timeInSeconds+"></td><td>" + array[i].stopTitle + "</td><td>" + array[i].headingDesc + "</td></tr>";
            }

            $("#schedules_table").find('tbody').append($(html_string));
            $("#vehicleLocSel").find('ul').append($(html_locations_string));
            
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
