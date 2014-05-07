/**
 * Homepage module
 */
angular.module( 'avalancheCanada.home', [
  'ui.router',
  'plusOne',
  'ui.map'
])


.config(function config( $stateProvider) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Avalanche Canada' }
  });
})

/**
 * Home Controller
 * $log angular log service
 * ENV environment constants
 * $scope application model object
 */
.controller( 'HomeCtrl', function HomeController( $scope, ENV, $log ) {

    //! Get defaults from env vars
    //var pos = {'lat': ENV.default_lat, 'long': ENV.default_long};
    var pos = new google.maps.LatLng(ENV.default_lat, ENV.default_long);

    var map_type = google.maps.MapTypeId.TERRAIN;
    switch(ENV.map_type){
      case 'TERRAIN':
        map_type = google.maps.MapTypeId.TERRAIN;
        break;
      case 'ROADMAP':
        map_type = google.maps.MapTypeId.ROADMAP;
        break;
      case 'HYBRID':
        map_type = google.maps.MapTypeId.HYBRID;
        break;
      case 'SATELLITE':
        map_type = google.maps.MapTypeId.SATELLITE;
        break;
      default:
        $log.error("ENV.map_type does not match any known map type. Using default");
    }

    //! Set Map Options
    $scope.mapOptions = {
      center: pos,
      zoom: ENV.map_zoom,
      mapTypeId: map_type
    };


    //! todo check user preferences to see if they want this set to auto or have manually setup

    //! if geolocation is available then update map center
    if ("geolocation" in navigator) {

      navigator.geolocation.getCurrentPosition(function(position) {
        $log.info("position obtained from geolocation service");

        pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude) ;

        //! update map center with new position
        $scope.myMap.setCenter(pos);

        //! Add marker at position
        $scope.myMarkers.push(new google.maps.Marker({
            map: $scope.myMap,
            position:  pos,
            title: "You Are Here"
        }));

      });

    }
})

;

