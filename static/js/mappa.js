"use strict";


function popolaMappa(perizie) {
  let geocoder = new google.maps.Geocoder();
  navigator.geolocation.getCurrentPosition((position) => {
    let latlng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    geocoder.geocode({ location: latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        let mapOptions = {
          center: results[0].geometry.location,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP, // default=ROADMAP
        };
        let mappa = new google.maps.Map($("#map")[0], mapOptions);
        for (const perizia of perizie) {
          let currentPos = new google.maps.LatLng(
            perizia.coordinate.latitude,
            perizia.coordinate.longitude
          );
          let markerOptions = {
            map: mappa,
            position: currentPos,
            perizia,
          };
          let marcatore = new google.maps.Marker(markerOptions);
          marcatore.addListener("click", function () {
            console.log(this.perizia);
            $("#perizia").show();
            $("#home").hide();

            disegnaPercorso(this.perizia, latlng);
          });
        }
      }
    });
  });
}

function disegnaPercorso(perizia, latlng) {
  var directionsService = new google.maps.DirectionsService();
  var routesOptions = {
    origin: latlng,
    destination: new google.maps.LatLng(
      perizia.coordinate.latitude,
      perizia.coordinate.longitude
    ),
    travelMode: google.maps.TravelMode.DRIVING, // default
    provideRouteAlternatives: true, // default=false
    avoidTolls: false, // default (con pedaggi)
  };
  directionsService.route(routesOptions, function (directionsRoutes) {
    let mapOptions = {};
    var mappa = new google.maps.Map($("#mappaPercorso")[0], mapOptions);
    if (directionsRoutes.status == google.maps.DirectionsStatus.OK) {
      console.log(directionsRoutes.routes[0]);

      let renderOptions = {
        polylineOptions: {
          strokeColor: "#44F", // colore del percorso
          strokeWeight: 6, // spessore
          zIndex: 100, // posizionamento
        },
      };
      let directionsRenderer = new google.maps.DirectionsRenderer(
        renderOptions
      );
      directionsRenderer.setMap(mappa); // Collego il renderer alla mappa
      directionsRenderer.setRouteIndex(0);
      directionsRenderer.setDirections(directionsRoutes);

      $("#tempoPercorrenza").text(
        directionsRoutes.routes[0].legs[0].duration.text
      );

      popolaPerizia(perizia);
    }
  });
}

function getIndirizzo(coordinate){
  let geocoder = new google.maps.Geocoder();
  let latlng = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      return results[0].formatted_address;
    }
  });
}





