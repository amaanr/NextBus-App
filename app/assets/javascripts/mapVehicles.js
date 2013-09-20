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
                url: "http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&t=" + mvLastTime + "&r=" + route,
                dataType: "xml",
                success: xmlParser
            })   
        });
};

function xmlParser(xml) {
        var vehList = $.xml2json(xml);
        // create a marker for each vehicle 
        mvLastTime = vehList['lastTime']['time'];
        vehList = vehList['vehicle'];
        $.each(vehList, function(index, vehicle) {
        var marker;
        if (vehicle.dirTag == mvDirectionTag){
                text = 'Route (Bus Number): ' + vehicle.routeTag + ', vehicle id: ' + vehicle.id;
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
                title: text,
                id: vehicle.id
                        });
                        
                        // Set markers on the map
                        setMarkers(marker);
                }
        });
        
}

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