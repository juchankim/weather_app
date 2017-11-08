// public/core.js
angular.module('weathercast', ['histController', 'histService', 'weatherService','angularMoment']);

angular.module('weathercast').config(['darkSkyProvider', function(darkSkyProvider) {
	darkSkyProvider.setApiKey('3e8acf4ec48ec55a15d359f5ad048dc0');
}]);
 