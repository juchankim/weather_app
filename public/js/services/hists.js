// js/services/hists.js
angular.module('histService', [])
    // super simple service
    // each function returns a promise object 
    .factory('Hists', function($http) {
        return {
            get : function() {
                return $http.get('/api/hist/');
            },
            create : function(histData) {
                return $http.post('/api/hist/', histData);
            },
            update : function(id) {
                return $http.put('/api/hist/' + id)

            },
            delete : function(id) {
                return $http.delete('/api/hist/' + id);
            }, 
            deleteAll : function() {
                return $http.delete('/api/hist/')
            }
        }
    });