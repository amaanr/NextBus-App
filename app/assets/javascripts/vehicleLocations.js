var map;
function initialize() {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(43.7567094,-79.3364596)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

var mvLastTime = 0;
var mvMarkerArray = [];  // remember vehicle markers, so we can remove/refresh them
var mvRoutes;
var mvDirectionTag;
// time interval
var timeInterval;

// main function: takes routesList (array of routes)
// e.g. moveVehicles(['95'],'95_1_95')
function moveVehicles(routeList, direction) {
	mvRoutes = routeList;
	mvDirectionTag = direction;
	mapVehicles(mvRoutes);
	// run mapVehicles every 10 seconds
	setInterval(function() {
	    mapVehicles(mvRoutes);
	}, 10000);
}
google.maps.event.addDomListener(window, 'load', initialize);
// add markers for vehicles on the routes in parameter routeList 
function mapVehicles(routeList) {

    // add vehicle markers for user-selected routeList 
    $.each(routeList, function(index, route) {	
    	// retrieve location data for vehicles on this route 
	    var scheduleXML;
	    $.ajax({
	        type: "GET",
	        url: "http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&t=" + mvLastTime + "&r=" + route,
	        dataType: "JSON",
	        success: function(data) {
            var vehLocations = data["vehicle"];
            var array = [];
            var locations_object = {};
            
            for (var i = 0; i < vehLocations.length; i++) {
              var dirTag = vehLocations[i].dirTag;
              var heading = vehLocations[i].heading;
              var id = vehLocations[i].id;
              var lat = vehLocations[i].lat;
              var lon = vehLocations[i].lon;
              var routeTag = vehLocations[i].routeTag;
              
              locations_object = {
                "dirTag": dirTag,
                "heading": heading,
                "id": id,
                "lat": lat,
                "lon": lon,
                "routeTag": routeTag
              }
              
              array.push(locations_object);
            }
            
            // set markers
            $.each(array, function(index, vehicle) {
              var marker;
              //if (vehicle.dirTag == mvDirectionTag) {
	              text = 'Route (Bus Number): ' + vehicle.routeTag + ', vehicle id: ' + vehicle.id;
	              marker = new google.maps.Marker({
                  position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
                  title: text,
                  id: vehicle.id
			          });
			
			          // Set markers on the map
                setMarkers(marker);
              //}
              
            });
            
            function setMarkers(marker) {
              var added = 0; // variable to check whether it's been dealt with or not

              // See if the marker for same vehicle is in markerArray and replaces it
              $.each(mvMarkerArray, function(i, storedMarker) {
                if (marker.id == storedMarker.id) {
                    storedMarker.setMap(null);
                    marker.setMap(map);
                  mvMarkerArray.splice(i, 1);
                  mvMarkerArray.push(marker);
                  added = 1;
                }
              });

              // If it hasn't been replaced, marker is added to markerArray and set in map
              if (added == 0){
                  marker.setMap(map);
                  mvMarkerArray.push(marker);	
              }

            }
            
          }
	    })
	});
}

// moveVehicles(['122'],'122_0_122');

google.maps.event.addDomListener(window, 'load', initialize);