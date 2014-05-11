// function getCoordinates(callmemaybe) {
  // navigator.geolocation.getCurrentPosition(callmemaybe);
// }

// Gets nearby transit stops
function showTransit(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  // 43.657201,-79.406653 // lippincott
  // 43.757192,-79.337571 // laurentide
  // 43.666307,-79.393124 // queen's park
  // var latitude = 43.666307;
  // var longitude = -79.393124;

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
          dataType: "XML",
          success:
            function nextbusData(response) {
              var obj = $.xml2json(response);
              // console.log(obj);
              // var obj = response;
              // console.log(obj);

              var timeInSeconds;
              var routeTag;
              var stopTitle;
              var directionTitle;
              var branchCode;
              var directionCode;
              var heading;

              $.each([obj], function(i, val) {
                if ($.isArray(obj.predictions) == true) {
                  for (var i = 0; i < obj.predictions.length; i++) {
                    var obj1 = obj.predictions[i];
                    $.each([obj1], function(i, val) {
                      if (obj1.direction != undefined) { // get our data for all arrays
                        $.each([obj1.direction], function(i, val){
                          if ($.isArray(obj1.direction.prediction) == true) {
                            for (var i = 0; i < obj1.direction.prediction.length; i++) {
                              var obj2 = obj1.direction.prediction[i];
                              console.log(obj1.direction.title);
                            };
                          } else {
                            for (var i = 0; i < obj1.direction.length; i++) {
                              var obj3 = obj1.direction[i]
                              $.each([obj3], function(i, val) {
                                if (obj3.prediction != undefined) {
                                  for (var i = 0; i < obj3.prediction.length; i++) {
                                    var obj4 = obj3.prediction[i];
                                    console.log(obj3.title);
                                  }
                                }  
                              });
                            }
                          } // ends else
                        });
                      };
                    });
                  };
                } else {
                  $.each([obj.predictions], function(i, val) {
                    if (obj.predictions != undefined) {
                      if ($.isArray(obj.predictions.direction.prediction) == true) {
                        $.each([obj.predictions.direction], function(i, val) {
                          if (obj.predictions.direction.prediction != undefined) {
                            for (var i = 0; i < obj.predictions.direction.prediction.length; i++) {
                              var obj4 = obj.predictions.direction.prediction[i];
                              console.log(obj.predictions.direction.title);
                            };
                          }; 
                        });
                      };
                    };
                  });
                  
                };
              });

              // console.log(obj.predictions.direction); // shows all
              
              // if (obj.predictions.direction.prediction != undefined) {
              //   for (var i = 0; i < obj.predictions.direction.prediction.length; i++) {
              //     var obj4 = obj.predictions.direction.prediction[i];

              //     timeInSeconds = obj4.seconds;
              //     routeTag = obj.predictions.routeTag;
              //     stopTitle = obj.predictions.stopTitle;
              //     directionTitle = obj.predictions.direction.title;
              //     branchCode = obj4.branch;
              //     directionCode = directionTitle.substring(0,1);

              //     $(function () {
              //       var n = directionTitle.indexOf("towards");
              //       var directionLength = directionTitle.length;
              //       heading = directionTitle.substring(n,directionLength);
              //       $("#schedules_table").find('tbody').append("<tr><td>" + directionCode + " " + branchCode + "</td><td>" + stopTitle + "</td><td>" + heading + "</td><td>" + timeInSeconds + " s</td></tr>");

              //     });
              //   };
              // } else {}; // ends else

                // $.each([obj], function(i, val) {
                //   for (var j = 0; j < val.predictions.length; j++) {
                //     var obj1 = val.predictions[j];
                //     if (obj1.direction != undefined) {
                //       $.each([obj1.direction], function(i, val) {
                //         if (obj1.direction.prediction != undefined) {
                //           for (var i = 0; i < obj1.direction.prediction.length; i++) {
                //             var obj2 = obj1.direction.prediction[i];

                //             timeInSeconds = obj2.seconds;
                //             routeTag = obj1.routeTag;
                //             stopTitle = obj1.stopTitle;
                //             directionTitle = obj1.direction.title;
                //             branchCode = obj2.branch;
                //             directionCode = directionTitle.substring(0,1);

                //             $(function () {
                //               var n = directionTitle.indexOf("towards");
                //               var directionLength = directionTitle.length;
                //               heading = directionTitle.substring(n,directionLength);
                //               $("#schedules_table").find('tbody').append("<tr><td>" + directionCode + " " + branchCode + "</td><td>" + stopTitle + "</td><td>" + heading + "</td><td>" + timeInSeconds + " s</td></tr>");

                //             });
                            // console.log(directionCode + " " + branchCode);



                            // $("#schedules_table").find('tbody').append("<tr><td>" + timeInSeconds + " s</td><td>" + "<span class='badge bg-info'>" + routeTag + "</span> " + directionTitle + "<td></tr>");

                  //         };
                  //       } else {
                  //         for (var i = 0; i < obj1.direction.length; i++) {
                  //           var obj3 = obj1.direction[i]
                  //           if (obj3.prediction != undefined) {
                  //             for (var i = 0; i < obj3.prediction.length; i++) {
                  //               var obj4 = obj3.prediction[i];

                  //               timeInSeconds2 = obj4.seconds;
                  //               routeTag2 = obj1.routeTag;
                  //               stopTitle2 = obj1.stopTitle;
                  //               directionTitle2 = obj3.title;

                  //               // $("#schedules_table").find('tbody').append("<tr><td>" + timeInSeconds2 + " s</td><td>" + "<span class='badge bg-info'>" + routeTag2 + "</span> " + directionTitle2 + "<td></tr>");

                  //             };
                  //           };
                  //         };
                  //       };
                        
                  //     });
                  //   } else {};
                  // };
                // }); // ends each on obj
              

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