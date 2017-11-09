// js/controllers/main.js
    
angular.module('histController', [])
    .controller('mainController', mainController);
mainController.$inject = ['$scope','Hists', 'Weather'];

function mainController ($scope, Hists, Weather) {
    $scope.formData = {};
    $scope.loc = "London, UK";

    var latlong = {};
    // GET
    // when landing on the page, get 5 recent hists and show them
    Hists.get()
        .then(function(data) {
            $scope.hists = data.data;
        }); 

    // initialize map to London
    var disp = function(geocoder, map, address) {

        geocoder.geocode({'address': address}, function(res, stat) {
            if (stat === 'OK') {
                latlong = res[0].geometry.location;
                map.setCenter(latlong);
                Weather.getForecast(latlong.lat(), latlong.lng(), $scope.u);
                $scope.loc = res[0].formatted_address;
    
            } else {
                alert('Geocode was not successful for the following reason: ' + stat)
            }
        })
    }

    $scope.initialize = function() {
        var pos = {lat: 51.51, lng: -0.13};
        var map = new google.maps.Map(document.getElementById('map'), {
            center : pos,
            zoom : 13
        });
        var geocoder = new google.maps.Geocoder();

        disp(geocoder, map, $scope.loc);
        // when new search
        document.getElementById('createHist').addEventListener('click', function() {
            disp(geocoder, map, document.getElementById('new_address').value);
        });
        google.maps.event.addListener(map, "click", function (e) {
            //lat and lng is available in e object
            latLongText = e.latLng.lat() + "," + e.latLng.lng();
            disp(geocoder, map, latLongText);


        });
        // when existing search
        $scope.newDisp = function(text) {
            disp(geocoder, map, text);
            
        }

    };


    google.maps.event.addDomListener(window, 'load', $scope.initialize);

    $scope.updateUnit = function() {
        $scope.u = "";

        switch($scope.unit) {
            case 'us': $scope.u = 'us'; break;
            case 'si': $scope.u = 'si'; break;
            case 'ca': $scope.u = 'ca'; break;
            case 'uk2': $scope.u = 'uk2'; break;
        }
        $scope.newDisp($scope.loc);

    };




    // CREATE: when submitting the form, send the text to node API
    $scope.createHistory = function() {
        if (!$.isEmptyObject($scope.formData)) {
            Hists.create($scope.formData)
                .then(function(data) {
                    $scope.formData = {};
                    $scope.hists = data.data;
                });
        };
    };
    // UPDATE: update the history (to the most recent date)
    $scope.updateHistory = function(id) {
        Hists.update(id)
            .then(function(data) {
                $scope.hists = data.data;
            });
    };

    // DELETE: delete a history
    $scope.deleteHistory = function(id) {
        Hists.delete(id)
            .then(function(data) {
                $scope.hists = data.data;
            });
    };
    // DELETE ALL: delete all history for the user
    $scope.deleteEntireHistory = function() {
        Hists.deleteAll()
            .then(function(data) {
                $scope.hists = data.data;
            });
    };

};