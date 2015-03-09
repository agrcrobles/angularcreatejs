(function(){
	'use strict'

	angular.module('mocked-backend', []) 

	// define our fake backend
	.run(function($httpBackend, prize) {
		//var currentprize = {reels: [1,1,1], prize:500}; 

		$httpBackend.whenGET(/^templates\/.*/).passThrough();	
		$httpBackend.whenGET('/api/prize').respond(function(method,url,data) {
			var currentprize = prize.newOne();
			console.log("Getting prizes");
			return [200, currentprize];
		});
	})
	.factory('prize', function(random){
		return {
			newOne : function () {

				var maxPrize = 500;

				var reels = [];

				var winner = random.randomize(3);

				if(winner==1) { //winner case
					var rnd = random.randomize(7);				
					reels.push(rnd);
					reels.push(rnd);
					reels.push(rnd);
				}else{
					reels.push(random.randomize(7));
					reels.push(random.randomize(7));
					reels.push(random.randomize(7));
				}
				var prize;
				if(reels[0]==reels[1] && reels[1] ==reels[2])
					prize = random.randomize(maxPrize);
				else
					prize = 0;

				return { reels: reels, prize: prize }
			}
		}; 
	})

})()