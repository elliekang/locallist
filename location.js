function initMap() {
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }
  
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.7771, lng: -84.3963},
    zoom: 13
  });

  var input = (document.getElementById('pac-input'));

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  var circle = new google.maps.Circle({
    map: map,
    radius: 1609.34,    // 10 miles in metres
    fillColor: '#2EFEF7'
  });
  circle.bindTo('center', marker, 'position');

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    //set user marker to visible
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("This place isn't found");
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
      });
  } else {
      handleLocationError(false, infoWindow, map.getCenter());
  }

  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      setZoom(13);
    }
    marker.setIcon(({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });
}