var map;
var coordinates = new google.maps.LatLng(49.2786042, -123.0998905);
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 5,
  });

  var request = {
    query: 'Recycling Depot',
    location: coordinates,
    radius: 10000,  // meters
  };

  var infowindow = new google.maps.InfoWindow();

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, function(results, status, pagination){
    // If we got results
    if(status === google.maps.places.PlacesServiceStatus.OK){
      for(var i = 0; i < results.length; i++){
        // Mark them
        createMarker(results[i]);
      }

      // And look at the top result
      map.setCenter(results[0].geometry.location);
    }
  })
}

function createMarker(place){
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addDomListener(marker, "click", function(){
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}