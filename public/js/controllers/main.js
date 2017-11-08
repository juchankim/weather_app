// js/controllers/main.js
    
angular.module('histController', ['dark-sky'])
    .controller('mainController', mainController);
mainController.$inject = ['$scope','Hists', 'darkSky', 'moment'];

function mainController ($scope, Hists, darkSky, moment) {
    $scope.formData = {};
    $scope.loc = "";
    var latlong = {};
    var timezone = "";
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
                getForecast(latlong.lat(), latlong.lng());
                $scope.loc = res[0].formatted_address;
    
            } else {
                alert('Geocode was not successful for the following reason: ' + stat)
            }
        })
    }

    var getForecast = function(lat,long) {
        darkSky.getForecast(lat, long)
            .then(function(res) {
                timezone = res.timezone;
                showCurrentForecast(res.currently);
                showDailyForecast(res.hourly.data);
                showWeeklyForecast(res.daily.data);
            })
    }
    var showCurrentForecast = function(currdata) {
        var items = [];
        $('#currently-weather').empty();
        items.push(
            '<tbody>' +
              '<tr>' +

                  '<td><h5>' + Math.round(currdata.temperature) + '&deg ' + currdata.summary + '.</h5></td>' +
              '</tr>' +
            '</tbody>');
        var tableString = items.join('');
        $('#currently-weather').append(tableString);
    };

    var showDailyForecast = function(daydata) {
        var items = [];


        $('#hourly-weather').empty();
        items.push('<tbody>' + '<tr>');
        $.each(daydata, function(index, data) {
            var unixDestOff = moment.utc().clone().tz(timezone).utcOffset();
            var unixLocalOff = moment().utcOffset();

            var unixDest = data.time * 1000 + (-1*unixLocalOff + unixDestOff) * 60000;
            var date = new Date(unixDest);

            var hours = date.getHours();
            var ampm = (hours >= 12) ? "PM" : "AM";
            if (index == 0) {
                hours = "NOW";
                
            } else {
                if (hours >= 12) {
                   hours = hours - 12;
                 }
                 if (hours == 0) {
                   hours = 12;
                 }
                hours = hours + ampm;

            }
            items.push(
              '<td><h5>' +
                hours + "</h5><i class='wi wi-forecast-io-" + 
                data.icon + " wi-dark-sky-" + data.icon + "'></i><br><h5>" + 
                Math.round(data.temperature) + 
              '&deg</h5></td>');
        });
        items.push('</tr></tbody>')
        var tableString = items.join('');
        $('#hourly-weather').append(tableString);

    };
    var showWeeklyForecast = function(weekdata) {
        var items = [];
        var weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        $('#daily-weather').empty();
        items.push('<tbody>');
        $.each(weekdata, function(index, data) {
            var unixDestOff = moment.utc().clone().tz(timezone).utcOffset();
            var unixLocalOff = moment().utcOffset();

            var unixDest = data.time * 1000 + (-1*unixLocalOff + unixDestOff) * 60000;
            var date = new Date(unixDest);
            var n = weekday[date.getDay()];
            var today = ""; 
            if (index == 0) {
                n = "TODAY";
            }
            items.push(
              '<tr>' + 
              '<td><h5>' + n + '</h5></td>' +
                "<td><i class='wi wi-forecast-io-" + data.icon + " wi-dark-sky-" + data.icon + "'></i></td>" + 
                "<td><h5>" +   Math.round(data.temperatureHigh) + "&deg</h5></td>" + 
                "<td><h5>" +   Math.round(data.temperatureLow) + "&deg</h5></td>" + 
              '</tr>');
        });
        items.push('</tbody>')
        var tableString = items.join('');
        $('#daily-weather').append(tableString);


    };


    $scope.initialize = function() {
        var pos = {lat: 51.51, lng: -0.13};
        var map = new google.maps.Map(document.getElementById('map'), {
            center : pos,
            zoom : 13
        });
        var geocoder = new google.maps.Geocoder();
        disp(geocoder, map, "London, UK");
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