define([
	"jquery",
	"underscore",
	"backbone",
	"controllers/physics/PhysicsController",
	"controllers/keyboard/KeyboardController",
	"config/config",
	"easel"
	], function($, _, Backbone, PhysicsController, KeyboardController) {

		var ManualDemoViewController = function(model) { 

			var canvas = document.getElementById('gameCanvas');
			var context = canvas.getContext('2d');
			var stage = new createjs.Stage(canvas);
			var gameModel = model;
			var screenWidth = canvas.width;
			var screenHeight = canvas.height;
			var gameRunning = true;
			var actorDelayCounter = 0;

			// imgPath based on domain
			var getDomainPath = function(){
				var domain = document.domain;
				var path; 

				if ( domain === "localhost" ) path = config.img_path_dev
			 	else path = config.img_path_prod; 

			 	return path; 
			};

			var domainPath = getDomainPath(); 

			var landscapeWidth = 2800;
			var landscapeHeight = 800;

			var cameraWorldContainer = new createjs.Container();
			cameraWorldContainer.width = landscapeWidth; // width of the background 
			cameraWorldContainer.height = screenHeight;

			var imgPath = config.actorSettings["manualBG"].imgPath;
			console.log("ManualPhysicsDemoController / load imgPath: " + imgPath) 

			var cameraWorldContainerLandscapeBG = new createjs.Bitmap(imgPath);
			cameraWorldContainerLandscapeBG.x = 0; 
			cameraWorldContainerLandscapeBG.y = -(landscapeHeight - screenHeight); // the landscape is taller than the camera so we need to offset it 
			cameraWorldContainerLandscapeBG.alpha = 1;
			cameraWorldContainerLandscapeBG.width = landscapeWidth;
			cameraWorldContainerLandscapeBG.height = landscapeHeight;
			cameraWorldContainerLandscapeBG.snapToPixel = true; 
			cameraWorldContainerLandscapeBG.mouseEnabled = false;
			cameraWorldContainerLandscapeBG.name = "cameraWorldContainerLandscapeBG";

			var cameraWorldSkinsContainer = new createjs.Container();
			cameraWorldSkinsContainer.x = 0; 
			cameraWorldSkinsContainer.y = 0; 
			cameraWorldSkinsContainer.alpha = 1;
			cameraWorldSkinsContainer.width = landscapeWidth;
			cameraWorldSkinsContainer.height = landscapeHeight;
			cameraWorldSkinsContainer.name = "cameraWorldSkinsContainer";

			var cameraWorldContainerDebugBG = new createjs.Container();
			cameraWorldContainerDebugBG.name = "cameraWorldContainerDebugBG";
			cameraWorldContainerDebugBG.x = 0;
			cameraWorldContainerDebugBG.y = 0;

			cameraWorldContainerDebugBG.width = landscapeWidth;
			cameraWorldContainerDebugBG.height = screenHeight;

			cameraWorldContainerDebugBG.visible = false;

			var graphics = new createjs.Graphics();

			graphics.width = landscapeWidth;
			graphics.height = screenHeight;

			cameraWorldContainerDebugBG.graphics = graphics; 
			cameraWorldContainerDebugBG.mouseEnabled = false;

			cameraWorldContainer.addChild(cameraWorldContainerLandscapeBG, cameraWorldContainerDebugBG, cameraWorldSkinsContainer);

			var physicsController = new PhysicsController(canvas, context, cameraWorldContainer, cameraWorldSkinsContainer, cameraWorldContainerDebugBG, domainPath);
			physicsController.setup();

			var keyboardController = new KeyboardController();

			var onKeyboardHandler = function(keyName) {
				console.log(event, "ManualPhysicsDemoController / onKeyboardHandler /keyName: " + keyName);
				physicsController.trigger(event, keyName);

				if ( keyName == "LEFT") {

				}
			};

			keyboardController.vent.bind("customKeydown", onKeyboardHandler)

			stage.mouseEventsEnabled = true;
			stage.autoClear = false;
			stage.snapPixelsEnabled = true;

			var fpsFld;
						
			fpsFld = new createjs.Text("FPS","20px Arial","#FFF");
			fpsFld.alpha = 1;
			fpsFld.x = 20;
			fpsFld.y = 26;
				
			stage.addChild(cameraWorldContainer, fpsFld );

			gameRunning = true;
			var gameTickCount = 0;  
			var gameTickMax = 3;   

			var update = function() {
				physicsController.update();
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

			// team evil
			physicsController.spawn("body-simple", "goblin");
			physicsController.spawn("body-simple", "orc");
			physicsController.spawn("body-complex", "cavetroll");
			physicsController.spawn("blueprint", "catapult");
			
			// team good 
			physicsController.spawn("body-simple", "knight");
			physicsController.spawn("body-simple", "legolas");
			//physicsController.spawn("blueprint", "trebuchet");

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
				console.log("ManualPhysicsDemoController / send challenge");
			};

			var bDebugVisible = true;
			var toggleDebug = function(){
				if ( bDebugVisible ) cameraWorldContainerDebugBG.visible = false;
				else cameraWorldContainerDebugBG.visible = true;

				bDebugVisible = !bDebugVisible; 
			};

			var bSkinsVisible = true;
			var toggleSkins = function(){

				if ( bSkinsVisible ) cameraWorldSkinsContainer.visible = false;
				else cameraWorldSkinsContainer.visible = true;

				bSkinsVisible = !bSkinsVisible; 
			};

			var pan = function( dirStr ){

			}

			return {
				stop : stop,
				play : play,
				stepForward : stepForward,
				stepBackward : stepBackward, 
				toggleDebug : toggleDebug,
				toggleSkins: toggleSkins,
				pan:pan
			}
	};

  return ManualDemoViewController;

});