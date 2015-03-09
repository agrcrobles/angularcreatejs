(function(){
	'use strict'
	angular.module('demo.directives', [])

	.value('demo.values', {
		spreadsheet_images: ["/assets/figures.png"],
		spreadsheet_frames: { "height": 200, "count": 14, "width": 68.57},
		canvas_separator_x : 80,
		canvas_separator_y : 22,
		max_framerate: 40,
		min_framerate: 15,
		reels : [
				{
					frame: 13,
					element : 1
				},{
					frame: 1,
					element	 : 2 
				},{
					frame: 3,
					element : 3 
				},{
					frame: 5,
					element: 4 
				},
				{
					frame: 7,
					element : 5 
				},{
					frame: 9,
					element : 6 
				},{
					frame: 11,
					element : 7 
				}
				]
	})
	.directive("cirsacanvas", [ 'prize.service', 'demo.values', 'random', '$window', function (service, values, random, $window)
	{
		return {
			restrict: 'E',
			scope: {
				status: '=',
				prize: '=',
				gamestatus: '='
			},
			template: "<canvas id='demoCanvas' height='250'></canvas>",
			link: function(scope, element, attrs) {
				console.log(element);


				var canvas = element.find('canvas')[0];

				scope.windowWidth = $window.innerWidth;

				scope.$watch('windowWidth', function(newWidth){
					canvas.width = newWidth;
				});

				var stage = new createjs.Stage(canvas);

				scope.$watch('status', function(newValue, oldValue){
					if(newValue == 1){

						createjs.Ticker.removeEventListener("tick", stage);

						var frames = _.map(service.data.reels, function(item){
							var frm = _.findWhere(values.reels, { element: item })
							if(!frm ) console.error('undefined item found!');
							return frm.frame; 
						}) 

						stage.clear();
						for(var i=0; i<=2; i++){

							var spriteSheet = new createjs.SpriteSheet({
								images: values.spreadsheet_images,
								frames: values.spreadsheet_frames,
								animations: {
									sit: frames[i]
								}
							});

							var grant = new createjs.Sprite(spriteSheet, "sit");
							grant.x = stage.canvas.width / 3 + i * values.canvas_separator_x;
							grant.y = values.canvas_separator_y;

							stage.addChild(grant);
						}


						stage.update();

						var checkWin = function(items){
							if(items[0] == items[1] && items[1] == items[2]) 
				 					scope.gamestatus=2; //won status
				 				else 
									scope.gamestatus=1; //lost status
							}

							var checkPrize = function(prize){ 
								scope.prize=prize;
							}

							checkWin(service.data.reels);
							checkPrize(service.data.prize);

							service.retrieve();
						}

						if(newValue == 2){

							var rnd = Math.random();

							for(var i=0; i<=2; i++){

								var spriteSheet = new createjs.SpriteSheet({

									images: values.spreadsheet_images,
									frames: values.spreadsheet_frames,
									// define two animations, run (loops, 1.5x speed) and jump (returns to run):
									animations: {
										run: [0, 13, "run", 1.5]
									}
								});


								spriteSheet.framerate = random.randomize(values.max_framerate-values.min_framerate)+values.min_framerate
								
								var grant = new createjs.Sprite(spriteSheet, "run");
								grant.x = stage.canvas.width / 3 + i * values.canvas_separator_x;
								grant.y = values.canvas_separator_y;
								// Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
								stage.addChild(grant);
							}

							createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED
						//createjs.Ticker.timingMode = createjs.Ticker.RAF;
						createjs.Ticker.addEventListener("tick", stage);
					};

				});
}

};
}])

})();
