var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.2786042, lng: -123.0998905},
    zoom: 4
  });
}