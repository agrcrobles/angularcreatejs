(function(){
	'use strict'

	angular.module('cirsa', [ 
		'ui.router',
		'demo.components',
		'mocked-backend',
		'ngMockE2E'])
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider

		.state('play', {
			url: "/play",
			templateUrl: "templates/play.html",
			controller: 'playCtrl',
			resolve: {     
				prize_service: ['prize.service', function(service) {
					return service.retrieve().then(function () {
						return service;
					});
				}]
			}
		})
		.state('begin', {
			url: "/begin",
			templateUrl: "templates/begin.html",
			controller: 'beginCtrl'
		})


		$urlRouterProvider.otherwise(function ($injector, $location) {
			var $state = $injector.get('$state');
			$state.go('begin');
		})	
	})

.factory('random', function(){
	return {
		randomize : function(max){
			return Math.floor((Math.random() * max) + 1);
		}
	}
})

})()