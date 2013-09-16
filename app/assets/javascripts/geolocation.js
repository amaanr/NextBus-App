if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var clearOverlays, latitude, longitude;
    console.log("location: " + position.coords.latitude + "," + position.coords.longitude);

    clearOverlays = function() {
      var i, _results;
      if (markersArray) {
        i = 0;
        _results = [];
        while (i < markersArray.length) {
          markersArray[i].setMap(null);
          _results.push(i++);
        }
        return _results;
      }
    };
    return $.ajax({
      type: "GET",
      url: "/nearby_stops",
      data: {
        latitude: latitude,
        longitude: longitude
      },
      dataType: 'json',
      async: true,
      // success: function(stops) {
        // return Gmaps.map.replaceMarkers(stops);
      // }
    });
  });
} else {
  alert("I'm sorry, but geolocation services are not supported by your browser.");
}