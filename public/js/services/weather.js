// js/services/hists.js
angular.module('weatherService', ['dark-sky'])

    .factory('Weather', ['darkSky', 'moment', function(darkSky, moment) {
        var showCurrentForecast = function(timezone, currdata) {
            var items = [];
            var unixDestOff = moment.utc().clone().tz(timezone).utcOffset();
            var unixLocalOff = moment().utcOffset();

            var unixDest = currdata.time * 1000 + (-1*unixLocalOff + unixDestOff) * 60000;
            var date = new Date(unixDest);
            var month = date.getMonth()+1;
            var date = date.getDate();

            $('#currently-weather').empty();
            items.push(
                '<tbody>' +
                  '<tr>' +
                  "<td vertical-align: middle><h2>"+ month + "/" + date + "</h2></td>" + 
                     "<td style = 'padding:0;margin:0'><h2><i class='wi wi-forecast-io-" + currdata.icon + " wi-dark-sky-" + currdata.icon + "'></i> </h2><b>" +
                      Math.round(currdata.temperature) + '&deg ' + currdata.summary + '.<b></td>' +
                  '</tr>' +
                '</tbody>');
            var tableString = items.join('');
            $('#currently-weather').append(tableString);
        };

        var showCurrentForecastDetailed = function(units, json) {
            currdata = json.currently;

            var interesting = ['humidity', 'dewPoint', 'wind', 'visibility', 'pressure','uvIndex'];
            var items = [];
            $('#currently-weather-detailed').empty();

            items.push('<thead><tr><td colspan = "2"><h5>' +
                json.hourly.summary +
                '</h5></td></tr></thead><tbody>');
            
            var degToCompass = function (num) {
                val= Math.round((num/22.5)+.5);
                arr=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
                return arr[(val % 16)];
            }
               

            $.each(interesting, function(index, data) {
                if (data == 'wind') {
                    items.push(
                        '<tr><td>' + 
                        '<h6>' + data.toUpperCase() + " </h6></td><td><h5>" + 
                        degToCompass(currdata["windBearing"]) + " " + 
                        currdata["windSpeed"] + " " +  units["windSpeed"] + '</h5></td>' + 
                        '</tr>');

                } else {
                    unit = " ";
                    retData = currdata[data];
                    if (units[data]) {
                        if (data == "dewPoint") {
                            unit += "&deg" + units[data].toUpperCase();
                        } else {
                            unit += units[data];
                        }
        
                    }
                    if (data == "humidity") {
                        unit = "%";
                        retData = Math.round(retData * 100);
                    }
                    if (data == "uvIndex") {

                    }
                    items.push(
                        '<tr>' + 
                        '<td><h6>' + data.toUpperCase() + "</h6></td><td><h5>" + retData + unit + '</h5></td>' +  
                        '</tr>');
                }

            });
            items.push('</tbody>')
            var tableString = items.join('');
            $('#currently-weather-detailed').append(tableString);
        };


        var showDailyForecast = function(timezone, daydata) {
            var items = [];


            $('#hourly-weather').empty();
            items.push('<tbody>' + '<tr>');
            $.each(daydata, function(index, data) {
                var unixDestOff = moment.utc().clone().tz(timezone).utcOffset();
                var unixLocalOff = moment().utcOffset();

                var unixDest = data.time * 1000 + (-1*unixLocalOff + unixDestOff) * 60000;
                var date = new Date(unixDest);

                var hours = date.getHours();
                var ampm = (hours >= 12) ? "pm" : "am";
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
        var showWeeklyForecast = function(timezone, daily) {
            var weekdata = daily.data;
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
            items.push('<thead><tr><td colspan= "4"><h5>' + 
                daily.summary + '</h5></td></tr></thead>' + 
                '<tbody>');
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
                  '<tr><h5>' + 
                  '<td><b>' + n + '<b></td>' +
                    "<td><i class='wi wi-forecast-io-" + data.icon + " wi-dark-sky-" + data.icon + "'></i></td>" + 
                    "<td>" +   Math.round(data.temperatureLow) + "&deg</td>" + 
                    "<td><b>" +   Math.round(data.temperatureHigh) + "&deg</b></td>" + 
                  '</h5></tr>');
            });
            items.push('</tbody>')
            var tableString = items.join('');
            $('#daily-weather').append(tableString);


        };

        return {
            getForecast : function(lat,long, unit) {
                darkSky.getForecast(lat, long, unit)
                    .then(function(res) {
                        showCurrentForecast(res.timezone,res.currently);
                        showCurrentForecastDetailed(darkSky.getUnits(unit), res);
                        showDailyForecast(res.timezone, res.hourly.data);
                        showWeeklyForecast(res.timezone, res.daily);
                    });
            }
    
        };
    }]);