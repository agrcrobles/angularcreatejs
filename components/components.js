(function(){
	'use strict'

	angular.module('demo.components', ['demo.directives'])

	.controller('playCtrl', [
		'$scope', 'prize_service', '$timeout', function($scope, service, $timeout ){

			$scope.play = function(){
				$scope.playstatus = 2;
				$timeout(function(){
					$scope.playstatus = 1;
				}, 3000);
			}
			$scope.play();

		}])

	.controller('beginCtrl', [
		'$scope', function(scope){
		}])

	.service('prize.service', function ($http) {
		return {
			data: {},

			retrieve : function(){
				var self= this;
				return $http.get("/api/prize")
				.then(function (result) {
					self.data = result.data;
				});
			}
		};
	}) ;

})()