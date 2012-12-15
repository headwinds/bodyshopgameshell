define([
	"jquery",
	"underscore",
	"backbone",
	"controllers/physics/PhysicsController",
	"controllers/game/pixies/PixiesViewController",
	"controllers/keyboard/KeyboardController",
	"config/config",
	"easel"
	], function($, _, Backbone, PhysicsController, PixiesViewController, KeyboardController) {

		var GameViewController = function(model) { 

			var canvas = document.getElementById('gameCanvas');
			var context = canvas.getContext('2d');
			var stage = new createjs.Stage(canvas);
			var gameModel = model;
			var screenWidth = canvas.width;
			var screenHeight = canvas.height;
			var gameRunning = true;
			var actorDelayCounter = 0;

			var landscapeWidth = 2800;
			var landscapeHeight = 800;

			var cameraWorldContainer = new createjs.Container();
			cameraWorldContainer.width = landscapeWidth; // width of the background 
			cameraWorldContainer.height = screenHeight;

			var imgPath = config.actorSettings["episode0"].landscape;
			console.log("GameViewController / load imgPath: " + imgPath) 

			var cameraWorldContainerLandscapeBG = new createjs.Bitmap(imgPath);
			cameraWorldContainerLandscapeBG.x = 0; 
			cameraWorldContainerLandscapeBG.y = -(landscapeHeight - screenHeight); // the landscape is taller than the camera so we need to offset it 
			cameraWorldContainerLandscapeBG.alpha = 0.25;
			cameraWorldContainerLandscapeBG.width = landscapeWidth;
			cameraWorldContainerLandscapeBG.height = screenHeight;
			cameraWorldContainerLandscapeBG.snapToPixel = true; //only Bitmap 
			cameraWorldContainerLandscapeBG.mouseEnabled = false;
			cameraWorldContainerLandscapeBG.name = "cameraWorldContainerLandscapeBG";

			var cameraWorldContainerDebugBG = new createjs.Container();
			cameraWorldContainerDebugBG.name = "cameraWorldContainerDebugBG";
			cameraWorldContainerDebugBG.x = 0;
			cameraWorldContainerDebugBG.y = 0;

			cameraWorldContainerDebugBG.width = landscapeWidth;
			cameraWorldContainerDebugBG.height = screenHeight;

			var graphics = new createjs.Graphics();

			graphics.width = landscapeWidth;
			graphics.height = screenHeight;

			cameraWorldContainerDebugBG.graphics = graphics; 
			cameraWorldContainerDebugBG.mouseEnabled = false;


			cameraWorldContainer.addChild(cameraWorldContainerLandscapeBG, cameraWorldContainerDebugBG);

			var physicsController = new PhysicsController(canvas, context, cameraWorldContainer, cameraWorldContainerDebugBG);
			physicsController.setup();

			var keyboardController = new KeyboardController();

			var onKeyboardHandler = function(event, keyName) {
				console.log("GameViewController / onKeyboardHandler /keyName: " + keyName);
				physicsController.trigger(event, keyName);

				if ( keyName == "LEFT") {

				}
			};

			keyboardController.bind(event, onKeyboardHandler)

			stage.mouseEventsEnabled = true;
			stage.autoClear = false;
			stage.snapPixelsEnabled = true;

			var fpsFld;
						
			fpsFld = new createjs.Text("FPS","20px Arial","#FFF");
			fpsFld.alpha = 1;
			fpsFld.x = 20;
			fpsFld.y = 26;
						
			//var pixiesView = new PixiesViewController(canvas, fpsFld, cameraWorldContainer);
				
			stage.addChild(cameraWorldContainer, fpsFld );

			gameRunning = true;
			var gameTickCount = 0;  
			var gameTickMax = 3;   

			var update = function() {
				physicsController.update();
				//pixiesView.update();
				fpsFld.text = Math.floor(createjs.Ticker.getMeasuredFPS())+" FPS";

				stage.update();
			}

			var tick = function() {
				if(gameRunning) {
					update();
					//gameTickCount++;
					//if ( gameTickCount > gameTickMax ) gameRunning = false; 
				}
			};

			createjs.Ticker.setFPS(60);
			createjs.Ticker.useRAF = true; // use Request Animation Frame 
			createjs.Ticker.addListener( tick );

			physicsController.spawn("creature-simple", "goblin");
			physicsController.spawn("creature-simple", "orc");
			physicsController.spawn("creature-complex", "cavetroll");
			
			physicsController.spawn("blueprint", "catapult");

			var play = function(){
				gameRunning = true; 
			}; 

			var stop = function(){
				gameRunning = false; 
			}; 

			var stepForward = function(){
				gameRunning = false; 
				update(); 
			};

			var stepBackward = function(){
				console.log("GameViewController / send challenge");
			};

			var bDebugVisible = true;
			var toggleDebug = function(){
				if ( bDebugVisible ) cameraWorldContainerDebugBG.visible = false;
				else cameraWorldContainerDebugBG.visible = true;

				bDebugVisible = !bDebugVisible; 
			};

			var bSkinsVisible = true;
			var toggleSkins = function(){

				var totalChildren = cameraWorldContainer.getNumChildren();

				if ( bSkinsVisible ) {
					console.log("GameViewController bSkinsVisible: " + bSkinsVisible);
					console.log("GameViewController cameraWorldContainer.getNumChildren(): " + cameraWorldContainer.getNumChildren() );

					for (var skinCounter = 0; skinCounter < totalChildren; skinCounter++) {
						
						var skin = cameraWorldContainer.getChildAt(skinCounter);
						if ( skin.name != "cameraWorldContainerDebugBG") skin.visible = false; 
						console.log("GameViewController skin.name: " + skin.name);
					}

				} else {

					for (var skinCounter = 0; skinCounter < totalChildren; skinCounter++) {
						
						var skin = cameraWorldContainer.getChildAt(skinCounter);
						if ( skin.name != "cameraWorldContainerDebugBG") skin.visible = true; 
					}

				} 

				bSkinsVisible = !bSkinsVisible; 
			};

			return {
				stop : stop,
				play : play,
				stepForward : stepForward,
				stepBackward : stepBackward, 
				toggleDebug : toggleDebug,
				toggleSkins: toggleSkins
			}
	};

  return GameViewController;

});