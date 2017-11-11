// js/controllers/main.js
    
angular.module('histController', [])
    .controller('mainController', mainController);
mainController.$inject = ['moment','$scope','Hists', 'Weather'];

function mainController (moment, $scope, Hists, Weather) {
    $scope.formData = {};
    $scope.loc = "London, UK";
    $scope.histData = [];
    $scope.histDataWeekly = [];
    $scope.u = 'us';
    // GET
    // when landing on the page, get 5 recent hists and show them
    Hists.get()
        .then(function(data) {
            $scope.hists = data.data;
        }).catch(function(err){
            console.log("Failed to get search history");
        }); 

    // map & all the displays that depend on lat,long
    var disp = function(geocoder, map, address) {
        geocoder.geocode({'address': address}, function(res, stat) {
            if (stat === 'OK') {
                latlong = res[0].geometry.location;
                map.setCenter(latlong);
                var options = {
                    latitude : latlong.lat(),
                    longitude : latlong.lng(),
                    units : $scope.u
                }
                Weather.get(options)
                    .then(function(ret) {
                        // console.log(ret);
                        var result = ret.data;
                        // console.log(result);
                        var timezone = result.timezone;
                        Weather.showCurrentForecast(timezone, result.currently);
                        Weather.showCurrentForecastDetailed($scope.u, result);
                        Weather.showDailyForecast(timezone, result.hourly.data);
                        Weather.showWeeklyForecast(timezone, result.daily);
                    }).catch(function(err){
                        console.log(err);
                    });
                var optionsH = {
                    latitude : latlong.lat(),
                    longitude : latlong.lng(),
                    units : $scope.u,
                    time : Math.round(moment().subtract(1, 'days').valueOf()/1000)
                }
                Weather.getHistory(optionsH)
                    .then(function(ret){
                        var rest = ret.data;
                        data = rest.hourly.data;
                        data.forEach(function(value, i) {
                            value.time = Weather.convertedUNIX(rest.timezone, value.time);
                        })
                        $scope.histData = data;
                    })

                $scope.histDataWeekly = [];
                for (var i = 1; i <= 7; i++) {
                    var optionsDay = {
                        latitude : latlong.lat(),
                        longitude : latlong.lng(),
                        units : $scope.u,
                        time : Math.round(moment().subtract(i, 'days').valueOf()/1000)
                    }
                    Weather.getHistory(optionsDay)
                        .then(function(ret) { //data
                            var rest = ret.data;
                            data = rest.daily.data[0];
                            data.time = Weather.convertedUNIX(rest.timezone, data.time);
                            ($scope.histDataWeekly).push(data);
                    });
                }
                $scope.loc = res[0].formatted_address;
            } else {
                alert('Geocode was not successful for the following reason: ' + stat)
            }
        })
    }
    // every site refresh this is called where the value is initalized with London lat/long
    $scope.initialize = function() {
        var pos = {lat: 51.51, lng: -0.13};
        var map = new google.maps.Map(document.getElementById('map'), {
            center : pos,
            zoom : 13
        });
        var geocoder = new google.maps.Geocoder();

        disp(geocoder, map, $scope.loc);
        // // when new search
        document.getElementById('createHist').addEventListener('click', function() {
            disp(geocoder, map, document.getElementById('new_address').value);
        });
        // if a center location within the google maps is changed, refresh all the displays 
        google.maps.event.addListener(map, "dragend", function () {
            //lat and lng is available in e object
            lat = map.getCenter().lat();
            lng = map.getCenter().lng();
            latLongText = lat + "," + lng;
            disp(geocoder, map, latLongText);


        });
        // when existing search
        $scope.newDisp = function(text) {
            disp(geocoder, map, text);
            
        }

    };


    google.maps.event.addDomListener(window, 'load', $scope.initialize);

    $scope.updateUnit = function() {
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
                }).catch(function(err){
                    console.log(err);
                });
        };
    };
    // UPDATE: update the history (to the most recent date)
    $scope.updateHistory = function(id) {
        Hists.update(id)
            .then(function(data) {
                $scope.hists = data.data;
            }).catch(function(err){
                    console.log(err);
                });
    };

    // DELETE: delete a history
    $scope.deleteHistory = function(id) {
        Hists.delete(id)
            .then(function(data) {
                $scope.hists = data.data;
            }).catch(function(err){
                console.log(err);
            });
    };
    // DELETE ALL: delete all history for the user
    $scope.deleteEntireHistory = function() {
        Hists.deleteAll()
            .then(function(data) {
                $scope.hists = data.data;
            }).catch(function(err){
                console.log(err);
            });
    };

};