define([
    "jquery",
    "underscore",
    "backbone",
    "demos/rube/controllers/RubePhysicsController",
    "controllers/keyboard/KeyboardController",
    "config/config",
    "easel"
    ], function($, _, Backbone, RubePhysicsController, KeyboardController) {

    var RubeDemoViewController = function(model) { 

        var canvas = document.getElementById('gameCanvas');
        var context = canvas.getContext('2d');
        
        var stage = new createjs.Stage(canvas);
        var gameModel = model;
        var screenWidth = canvas.width;
        var screenHeight = canvas.height;
        var gameRunning = true;
        var actorDelayCounter = 0;
        var wheelBodies = [];
       

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
        var landscapeHeight = 500;

        var cameraWorldContainer = new createjs.Container();
        cameraWorldContainer.width = landscapeWidth; // width of the background 
        cameraWorldContainer.height = screenHeight;

        var imgPath = config.actorSettings["rubeBG"].imgPath;
        console.log("GameViewController / load imgPath: " + imgPath) 

        var cameraWorldContainerLandscapeBG = new createjs.Bitmap(imgPath);
        cameraWorldContainerLandscapeBG.x = 0; 
        cameraWorldContainerLandscapeBG.y = 0; //-(landscapeHeight - screenHeight); // the landscape is taller than the camera so we need to offset it 
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
        //cameraWorldContainerDebugBG.x = 390;
        //cameraWorldContainerDebugBG.y = 250;
        //cameraWorldContainerDebugBG.scaleX = 0.80;
        //cameraWorldContainerDebugBG.scaleY = 0.80;

        //cameraWorldContainerDebugBG.scaleY = -1; // flip both skins and debug containers because the R.U.B.E. has the reverse coordinates
        //cameraWorldSkinsContainer.scaleY = -1;

        cameraWorldContainerDebugBG.width = landscapeWidth;
        cameraWorldContainerDebugBG.height = screenHeight;

        //cameraWorldContainerDebugBG.visible = false;

        var graphics = new createjs.Graphics();

        graphics.width = landscapeWidth;
        graphics.height = screenHeight;

        cameraWorldContainerDebugBG.graphics = graphics; 
        cameraWorldContainerDebugBG.mouseEnabled = false;

        cameraWorldContainer.addChild(cameraWorldContainerLandscapeBG, cameraWorldContainerDebugBG, cameraWorldSkinsContainer);

        var physicsController = new RubePhysicsController(canvas, context, cameraWorldContainer, cameraWorldSkinsContainer, cameraWorldContainerDebugBG, domainPath);
        
        var keyboardController = new KeyboardController();

        var onKeyboardDownHandler = function(event, keyName) {
            console.log("RubeDemoViewController / onKeyboardHandler /keyName: " + keyName);
            physicsController.trigger(event, keyName);

            //physicsController.startDriving(keyName);

            /*
            var onKeyDown = function(canvas, evt) {
            if ( evt.keyCode == 74 ) {//j
                moveFlags |= MOVE_LEFT;
                updateMotorSpeed();
            }
            else if ( evt.keyCode == 75 ) {//k
                moveFlags |= MOVE_RIGHT;
                updateMotorSpeed();
            }
            }

            var onKeyUp = function(canvas, evt) {    
                if ( evt.keyCode == 74 ) {//j
                    moveFlags &= ~MOVE_LEFT;
                    updateMotorSpeed();
                }
                else if ( evt.keyCode == 75 ) {//k
                    moveFlags &= ~MOVE_RIGHT;
                    updateMotorSpeed();
                }
            }
            */

        };

        var onKeyboardUpHandler = function(event, keyName) {
            console.log("GameViewController / onKeyboardHandler /keyName: " + keyName);
            physicsController.trigger(event, keyName);

            //physicsController.stopDriving(keyName);
        };

        keyboardController.bind("customKeydown", onKeyboardDownHandler);
        keyboardController.bind("customKeyup", onKeyboardUpHandler);

        stage.mouseEventsEnabled = true;
        stage.autoClear = false;
        stage.snapPixelsEnabled = true;

        var fpsFld;
                    
        fpsFld = new createjs.Text("FPS","20px Arial","#FFF");
        fpsFld.alpha = 1;
        fpsFld.x = 20;
        fpsFld.y = 26;
            
        stage.addChild(cameraWorldContainer, fpsFld );

        gameRunning = false; // don't start the simulation until the json has loaded
        var gameTickCount = 0;  
        var gameTickMax = 2;   

        var update = function() {

            //cameraWorldContainer.x -= 0.25;  
            //cameraWorldContainer.y += 0.5;  

            physicsController.update();
            fpsFld.text = Math.floor(createjs.Ticker.getMeasuredFPS())+" FPS";

            stage.update();
        }

        var tick = function() {
            //console.log("RubeDemoViewController tick");
            if(gameRunning) {
                update();
                gameTickCount++;
                if ( gameTickCount > gameTickMax ) gameRunning = false; 
            }
        };

        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true; // use Request Animation Frame 
        createjs.Ticker.addListener( tick );

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
        var toggleDebug = function() {
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

        var jsonPath = model.get('jsonPath');
        var loadWorld = function( jsonPath ) {

            physicsController.setup();

             var callback = function( loadedJsonData ) {

                var jsonTest = physicsController.loadSceneIntoWorld(loadedJsonData);

                if ( jsonTest ) {
                    console.log("RubeDemoViewController / RUBE scene loaded successfully.");
                    
                    gameRunning = true;
                } else {
                    console.log("Failed to load RUBE scene");
                }
            }

            $.ajax({
              url: jsonPath,
              dataType: 'json',
              success: callback
            });
        };

        loadWorld(jsonPath); 

        return {
                stop : stop,
                play : play,
                stepForward : stepForward,
                stepBackward : stepBackward, 
                toggleDebug : toggleDebug,
                toggleSkins: toggleSkins
            }

    }; 

    return RubeDemoViewController;

});    
