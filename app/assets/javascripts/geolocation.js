// Enable the visual refresh
google.maps.visualRefresh = true;

var map;
var stops;
var markers = [];

function initialize() {
  var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Adds transit layer to map
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  // HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.watchPosition(showTransit),
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here.'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });

  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  // Gets nearby transit stops
  function showTransit(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    var infowindow = new google.maps.InfoWindow({
      content: ''
    });

    // Finds nearby stops from OpenData CSV
    var seconds = '';
    return $.ajax ({
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
            success: function(xml) {
              $(xml).find('body').each(function() {
                var timeInSeconds = $(this).find('predictions').find('direction').find('prediction').attr('seconds');
                var timeInMinutes = $(this).find('predictions').find('direction').find('prediction').attr('minutes');
                var directionTitle = $(this).find('predictions').find('direction').attr('title');
                var stopTitle = $(this).find('predictions').attr('stopTitle');

                // Make and place nearby stops on map as markers
                var marker = new google.maps.Marker({
                  map: map,
                  position: tmpLatLng,
                  title: stopTitle
                });
                // Adds stop name to markers when clicked  
                bindInfoWindow(marker, map, infowindow, '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">'+stopTitle+'</h3>'+
                  '<div id="bodyContent">'+
                  '<p><b>'+directionTitle+'</b> will arrive in <b>'+timeInSeconds+' seconds ' +
                  '('+timeInMinutes+' minutes</b>).'+
                  '<p>Source: NextBus, <a href="http://www.nextbus.com">'+
                  'http://nextbus.com</a></p>'+
                  '</div>'+
                  '</div>'
                );
              });
              // console.log(xml)
            }
          }); // ends nextbus ajax request
        } // ends for loop
      } // ends success handler
    }); // ends main post ajax request to /nearby_stops
  } // ends showTransit function

  // Instantiate the autocomplete method for search box
  var input = document.getElementById('target');
  var searchBox = new google.maps.places.Autocomplete(input);
  searchBox.bindTo('bounds', map);
  
} // ends initialize function

// If browser/device doesn't support geolocation, do this
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);

// Binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(html);
    infowindow.open(map, marker);
  });
}
