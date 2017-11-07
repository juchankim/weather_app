// public/core.js
var weathercast = angular.module('weathercast', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/hist/')
        .success(function(data) {
            $scope.hists = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createHistory = function() {
        $http.post('/api/hist/', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.hists = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


    // when submitting the add form, send the text to the node API
    $scope.updateHistory = function(id) {
        $http.put('/api/hist/' + id)
            .success(function(data) {
                $scope.hists = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete one history for that user
    $scope.deleteHistory = function(id) {
        $http.delete('/api/hist/' + id)
            .success(function(data) {
                $scope.hists = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete entire history for that user
    $scope.deleteEntireHistory = function() {
        $http.delete('/api/hist/')
            .success(function(data) {
                $scope.hists = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}