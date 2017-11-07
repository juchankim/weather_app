// js/controllers/main.js
    
angular.module('histController', [])

    .controller('mainController', function($scope, $http, Hists) {
        $scope.formData = {};
        var latlong = {};
        // GET
        // when landing on the page, get 5 recent hists and show them
        Hists.get()
            .success(function(data) {
                $scope.hists = data;
            }); 

        // initialize map to London
        var disp = function(geocoder, map, address) {

            geocoder.geocode({'address': address}, function(res, stat) {
                if (stat === 'OK') {
                    latlong = res[0].geometry.location;
                    map.setCenter(latlong);

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
            // when new search
            document.getElementById('createHist').addEventListener('click', function() {
                disp(geocoder, map, document.getElementById('new_address').value);
            });
            // when existing search
            $scope.newDisp = function(text) {
                disp(geocoder, map, text);
                
            }
        };


        google.maps.event.addDomListener(window, 'load', $scope.initialize);



        


        // CREATE: when submitting the form, send the text to node API
        $scope.createHistory = function() {
            if (!$.isEmptyObject($scope.formData)) {
                Hists.create($scope.formData)
                    .success(function(data) {
                        $scope.formData = {};
                        $scope.hists = data;
                    });
            };
        };
        // UPDATE: update the history (to the most recent date)
        $scope.updateHistory = function(id) {
            Hists.update(id)
                .success(function(data) {
                    $scope.hists = data;
                });
        };

        // DELETE: delete a history
        $scope.deleteHistory = function(id) {
            Hists.delete(id)
                .success(function(data) {
                    $scope.hists = data;
                });
        };
        // DELETE ALL: delete all history for the user
        $scope.deleteEntireHistory = function() {
            Hists.deleteAll()
                .success(function(data) {
                    $scope.hists = data;
                });
        };

    });