define([
    "jquery",
    "underscore",
    "backbone",
    "demos/rube/controllers/RubeTruckController",
    "demos/rube/controllers/RubeBikeController",
    "controllers/keyboard/KeyboardController",
    "tween"
    ], function($, _, Backbone, RubeTruckController, RubeBikeController, KeyboardController) {

    var RubeDemoViewController = function(model) {     

        var e_shapeBit = 0x0001;
        var e_jointBit = 0x0002;
        var e_aabbBit = 0x0004;
        var e_pairBit = 0x0008;
        var e_centerOfMassBit = 0x0010;

        var PTM = 32;

        var keyboardController = new KeyboardController();
        var loader; // instance of LoadRubeController
        var stage;
        var loadRubeController;
        var world = null;
        var mouseJointGroundBody;
        var canvas;
        var context;
        var myDebugDraw;        
        var mouseDownQueryCallback;
        var visibleFixturesQueryCallback;
        var mouseJoint = null;        
        //var gameRunning = true;
        var frameTime60 = 0;
        var statusUpdateCounter = 0;
        var showStats = false;        
        var mouseDown = false;
        var shiftDown = false;
        var originTransform;

        var gameRunning = true;
        var gameTickCount = 0; 
        var gameTickMax = 3;

        var missionOverlayContainer;
        var goalOverlayContainer;

        var bike = new RubeBikeController(this);

        var mousePosPixel = {
            x: 0,
            y: 0
        };
        var prevMousePosPixel = {
            x: 0,
            y: 0
        };        
        var mousePosWorld = {
            x: 0,
            y: 0
        };        
        var canvasOffset = {
            x: 0,
            y: 0
        };        
        var viewCenterPixel = {
            x:320,
            y:240
        };
        var viewAABB;

        function onJsonLoadedHandler( jso ) {
               
            if ( loader.loadSceneFromRUBE( jso, world ) ) {
                //console.log("RUBE scene loaded successfully.");
          
               doAfterLoading(loader);

            } else {
                //console.log("Failed to load RUBE scene");
            }

        }

        function loadJSON() {
            $.ajax({
              url: "scripts/demos/rube/json/shark.json",
              dataType: 'json',
              success: onJsonLoadedHandler
            });
        }

        function getWorld() {
            return world; 
        }

        function myRound(val,places) {
            var c = 1;
            for (var i = 0; i < places; i++)
                c *= 10;
            return Math.round(val*c)/c;
        }
                
        function getWorldPointFromPixelPoint(pixelPoint) {
            return {                
                x: (pixelPoint.x - canvasOffset.x)/PTM,
                y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
            };
        }

        function updateMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            mousePosPixel = {
                x: evt.clientX - rect.left,
                y: canvas.height - (evt.clientY - rect.top)
            };
            mousePosWorld = getWorldPointFromPixelPoint(mousePosPixel);
        }

        function setViewCenterWorld(b2vecpos, instantaneous) {
            
            var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );

            //console.log(b2vecpos, "setViewCenterWorld b2vecpos");
            //console.log(currentViewCenterWorld, "setViewCenterWorld currentViewCenterWorld");
            
            var toMoveX = b2vecpos.x - currentViewCenterWorld.x;
            var toMoveY = b2vecpos.y - currentViewCenterWorld.y;
            
            var fraction = instantaneous ? 1 : 0.25;
            
            canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
            canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);

            ////console.log(b2vecpos, "setViewCenterWorld");
        }

        function onMouseMove(canvas, evt) {
            prevMousePosPixel = mousePosPixel;
            updateMousePos(canvas, evt);
            updateStats();
            if ( shiftDown ) {
                canvasOffset.x += (mousePosPixel.x - prevMousePosPixel.x);
                canvasOffset.y -= (mousePosPixel.y - prevMousePosPixel.y);
                draw();
            }
            else if ( mouseDown && mouseJoint != null ) {
                mouseJoint.SetTarget( new b2Vec2(mousePosWorld.x, mousePosWorld.y) );
            }
        }

        var getBodyCB = function(fixture) {
            if(fixture.GetBody().GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
                if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePosWorld)) {
                    selectedBody = fixture.GetBody();
                    return false;
                }
            }
            return true;
        };

        function startMouseJoint() {
            
            if ( mouseJoint != null )
                return;
            
            // Make a small box.
            var aabb = new b2AABB();
            var d = 0.001;            
            aabb.lowerBound.Set(mousePosWorld.x - d, mousePosWorld.y - d);
            aabb.upperBound.Set(mousePosWorld.x + d, mousePosWorld.y + d);
            
            // Query the world for overlapping shapes.            
            mouseDownQueryCallback.m_fixture = null;
            mouseDownQueryCallback.m_point.Set(mousePosWorld.x, mousePosWorld.y);
            world.QueryAABB(mouseDownQueryCallback, aabb);
            
            if (mouseDownQueryCallback.m_fixture)
            {
                var body = mouseDownQueryCallback.m_fixture.GetBody();
                
                /*selectedBody = null;
                world.QueryAABB(getBodyCB, aabb);    
                if (selectedBody)    
                {
                var body = selectedBody;*/

                var md = new b2MouseJointDef();
                md.bodyA = mouseJointGroundBody;
                md.bodyB = body;
                md.target.Set(mousePosWorld.x, mousePosWorld.y);
                md.maxForce = 1000 * body.GetMass();
                md.collideConnected = true;
                
                mouseJoint = world.CreateJoint(md);
                body.SetAwake(true);
            }
        }

        function onMouseDown(canvas, evt) {

            //console.log("RubeDemoViewController / onMouseDown");

            updateMousePos(canvas, evt);
            
            if ( !mouseDown )
                //startMouseJoint();
            
            mouseDown = true;
            updateStats();
        }

        function onMouseUp(canvas, evt) {
            mouseDown = false;
            
            updateMousePos(canvas, evt);
            updateStats();
            
            if ( mouseJoint != null ) {
                world.DestroyJoint(mouseJoint);
                mouseJoint = null;
            }
        }

        function onMouseOut(canvas, evt) {
            onMouseUp(canvas,evt);
        }

        // All key events are handled by the KeyboardController

        function zoomIn() {
            var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            PTM *= 1.1;
            var newViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
            canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
            draw();
        }

        function zoomOut() {
            var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            PTM /= 1.1;
            var newViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
            canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
            draw();
        }
                
        function updateDebugDrawCheckboxesFromWorld() {
            var flags = myDebugDraw.GetFlags();
            document.getElementById('drawShapesCheck').checked = (( flags & e_shapeBit ) != 0);
            document.getElementById('drawJointsCheck').checked = (( flags & e_jointBit ) != 0);
            document.getElementById('drawAABBsCheck').checked = (( flags & e_aabbBit ) != 0);
            //document.getElementById('drawPairsCheck').checked = (( flags & e_pairBit ) != 0);
            document.getElementById('drawTransformsCheck').checked = (( flags & e_centerOfMassBit ) != 0);
        }

        function updateWorldFromDebugDrawCheckboxes() {
            var flags = 0;
            if ( document.getElementById('drawShapesCheck').checked )
                flags |= e_shapeBit;
            if ( document.getElementById('drawJointsCheck').checked )
                flags |= e_jointBit;
            if ( document.getElementById('drawAABBsCheck').checked )
                flags |= e_aabbBit;
            /*if ( document.getElementById('drawPairsCheck').checked )
                flags |= e_pairBit;*/
            if ( document.getElementById('drawTransformsCheck').checked )
                flags |= e_centerOfMassBit;
            myDebugDraw.SetFlags( flags );
        }

        function updateContinuousRefreshStatus() {
            showStats = ( document.getElementById('showStatsCheck').checked );
            if ( !showStats ) {
                var fbSpan = document.getElementById('feedbackSpan');
                fbSpan.innerHTML = "";
            }
            else
                updateStats();
        }

        function init(loaderRubeController) {

            loader = loaderRubeController;

            // 1. create the world
            createWorld();

            // 2. load the json and wait for it to complete
            loadJSON();

            // 3. setup the createjs
            setupCreateJS();
        }

        

        function setupCreateJS() {

            canvasOverlays = document.getElementById("gameUICanvas");
            contextOverlays = canvasOverlays.getContext( '2d' );

            stage = new createjs.Stage(canvasOverlays);

            var overlaysContainer = new createjs.Container();
            overlaysContainer.width = canvasOverlays.width;
            overlaysContainer.height = canvasOverlays.height; 

            missionOverlayContainer = new createjs.Container();
            var missionBitmap = new createjs.Bitmap("./imgs/ui/overlays/mission.png");
            
            missionOverlayContainer.alpha = 0;
            missionOverlayContainer.visible = false;

            missionOverlayContainer.addChild(missionBitmap);

            goalOverlayContainer = new createjs.Container();
            var goalBitmap = new createjs.Bitmap("./imgs/ui/overlays/goal.png");

            goalOverlayContainer.addChild(goalBitmap);
            goalOverlayContainer.visible = false; 

            goalOverlayContainer.alpha = 0;
            goalOverlayContainer.visible = false;

            overlaysContainer.addChild(missionOverlayContainer);
            overlaysContainer.addChild(goalOverlayContainer);
            stage.addChild(overlaysContainer);



            var update = function() {

                //fpsFld.text = Math.floor(createjs.Ticker.getMeasuredFPS())+" FPS";

               stage.update();
            }

            var tick = function() {
                ////console.log("RubeDemoViewController tick");
                if(gameRunning) {
                    update();
                    //gameTickCount++;
                    //if ( gameTickCount > gameTickMax ) gameRunning = false; 
                }
            };

            createjs.Ticker.setFPS(60);
            createjs.Ticker.useRAF = true; // use Request Animation Frame 
            createjs.Ticker.addListener( tick );

        }

        function hideOverlay(overlayName) {

             var overlay; 

            switch(overlayName) {
                case "mission" :
                overlay = missionOverlayContainer;
                break;
                case "goal" :
                overlay = goalOverlayContainer;
                break; 
             }

            if ( overlay !== undefined ) {

                var endY = -400;

                function onComplete(){
                    overlay.visible = false;
                }

               createjs.Tween.get(overlay).to({x:0,y:endY,rotation:0,alpha:0},1000,createjs.Ease.backOut).call(onComplete);

            } 
                    
        }

        function showOverlay(overlayName) {

            var overlay; 

            switch(overlayName) {
                case "mission" :
                overlay = missionOverlayContainer;
                break;
                case "goal" :
                overlay = goalOverlayContainer;
                break; 
             }

            
            if ( overlay !== undefined )   {

                overlay.y = -400 //-(overlay.height); height isn't defined yet - need to sort that out
                overlay.alpha = 0;
                overlay.visible = true;  

                //console.log(overlay, "showOverlay about to tween: " + overlay.height );
                  
                createjs.Tween.get(overlay).to({x:0,y:0,rotation:0,alpha:1},2000,createjs.Ease.backOut);
            } else {
                //console.log(overlay, "problem! overlayName: " + overlayName);
            }

        }

        function changeTest() {    
            resetScene();
            if ( window['currentTest'] && window['currentTest']['setNiceViewCenter'] )
                window['currentTest']['setNiceViewCenter']();
            updateDebugDrawCheckboxesFromWorld();
            draw();
        }

        function completeMission() {
            hideOverlay("mission");
            showOverlay("goal");
        }

        // COLLISION DETECTION

        function getContactListener() { 

            var listener = new b2ContactListener;

            listener.BeginContact = function(contact) {
                
                var bodyA = contact.GetFixtureA().GetBody();
                var bodyB = contact.GetFixtureB().GetBody();

                ////console.log(bodyA.name);

                if (bodyA.name === "bikechassis" && bodyB.name === "airSensor1") {
                    fireBearShark();
                }

                if (bodyA.name === "bikechassis" && bodyB.name === "waterSensor1") {
                    resetScene();
                }

                if (bodyA.name === "crate" && bodyB.name === "goal") {
                    completeMission();
                }
            }

            listener.EndContact = function(contact) {
                // //console.log(contact.GetFixtureA().GetBody().GetUserData());
            }

            listener.PostSolve = function(contact, impulse) {
                if (contact.GetFixtureA().GetBody().GetUserData() == 'ball' || contact.GetFixtureB().GetBody().GetUserData() == 'ball') {
                    var impulse = impulse.normalImpulses[0];
                    if (impulse < 0.2) return; //threshold ignore small impacts
                    world.ball.impulse = impulse > 0.6 ? 0.5 : impulse;
                    //console.log(world.ball.impulse);
                }
            }

            listener.PreSolve = function(contact, oldManifold) {
                // PreSolve
            }

            return listener;
        }

        function createWorld() {
            
            if ( world != null ) 
                //Box2D.destroy(world);
                world = null;
                
            world = new b2World( new b2Vec2(0.0, -10.0) );
            //world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 9.8) /* gravity */, true /* allowSleep */);
            world.SetDebugDraw(myDebugDraw);
            
            world.SetContactListener( getContactListener() );

            mouseJointGroundBody = world.CreateBody( new b2BodyDef() );

            canvas = document.getElementById("gameCanvas");
            context = canvas.getContext( '2d' );
            
            canvasOffset.x = canvas.width/2;
            canvasOffset.y = canvas.height/2;
            
            canvas.addEventListener('mousemove', function(evt) {
                onMouseMove(canvas,evt);
            }, false);
            
            canvas.addEventListener('mousedown', function(evt) {
                onMouseDown(canvas,evt);
            }, false);
            
            canvas.addEventListener('mouseup', function(evt) {
                onMouseUp(canvas,evt);
            }, false);
            
            canvas.addEventListener('mouseout', function(evt) {
                onMouseOut(canvas,evt);
            }, false);
            
            myDebugDraw = new b2DebugDraw();
            myDebugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
            myDebugDraw.SetDrawScale(1.0);
            myDebugDraw.SetFillAlpha(0.5);
            myDebugDraw.SetLineThickness(1.0);
            myDebugDraw.SetXFormScale(0.25);
            myDebugDraw.SetFlags(b2DebugDraw.e_shapeBit /*| b2DebugDraw.e_jointBit*/);
            
            originTransform = new b2Transform();
            
            var MouseDownQueryCallback = function() {
                this.m_fixture = null;
                this.m_point = new b2Vec2();
            }

            MouseDownQueryCallback.prototype.ReportFixture = function(fixture) {
                if(fixture.GetBody().GetType() == 2) { //dynamic bodies only
                    if ( fixture.TestPoint(this.m_point) ) {
                        this.m_fixture = fixture;
                        return false;
                    }
                }
                return true;
            };
            
            mouseDownQueryCallback = new MouseDownQueryCallback();
              
            var VisibleFixturesQueryCallback = function() {
                this.m_fixtures = [];
            }
            VisibleFixturesQueryCallback.prototype.ReportFixture = function(fixture) {
                this.m_fixtures.push(fixture);
                return true;
            };
            
            viewAABB = new b2AABB();
            visibleFixturesQueryCallback = new VisibleFixturesQueryCallback();

            
        }

        function getWorldInfo() {
            var numBodies = 0;
            var numFixtures = 0;
            var numJoints = 0;
            for (b = world.m_bodyList; b; b = b.m_next) {
                numBodies++;
                for (f = b.m_fixtureList; f; f = f.m_next) 
                    numFixtures++; 
            }
            for (j = world.m_jointList; j; j = j.m_next) 
                numJoints++;
            return ""+numBodies+" bodies, "+numFixtures+" fixtures, "+numJoints+" joints";
        }

        var resettingScene = false;
        function resetScene() {

            gameRunning = false;
            resettingScene = true;

            hideOverlay("goal");
            showOverlay("mission");

            bBearSharkFired = false;
 
            // 1. create the world
            createWorld();

            // 2. load the json and wait for it to complete
            loadJSON();
        }

        //the RUBE scenes are loaded via jQuery post, so the draw() call above usually
        //does not catch them. Call this at the end of the post function.
        function doAfterLoading( loader ) {

            loadRubeController = loader;
            setupWorld();
        }

        function setupWorld() {

            //var that = this;
            if ( world.images ) {
                for (var i = 0; i < world.images.length; i++) {
                    var imageObj = new Image();
                    imageObj.src = world.images[i].file;
                    world.images[i].imageObj = imageObj;
                }
            }
            
            // hook up the bike

            var that = this; // this is the Window and I want this controller... 

            bike = new RubeBikeController();
            bike.setup(world, loadRubeController);

            var onBikeResetHandler = function(event, payload) {
                //console.log(payload, "RubeDemoViewController / onTruckResetHandler / payload");

                setViewCenterWorld( payload.resetPos, payload.bReset );
            
            };

            bike.vent.bind("resetTruck", onBikeResetHandler); 


            showOverlay("mission");

            var onKeyDownHandler = function(keyName) {
                
                //console.log("RubeDemoViewController / onKeyDownHandler /keyName: " + keyName);
            
                if ( keyName == "LEFT_PRESSED") {
                 bike.startDrivingLeft();  
                }

                if ( keyName == "RIGHT_PRESSED") {
                 bike.startDrivingRight(); 
                }

                if ( missionOverlayContainer.visible ) hideOverlay("mission");
            };

            var onKeyUpHandler = function(keyName) {
                console.log("RubeDemoViewController / onKeyUpHandler /keyName: " + keyName);
            
                if ( keyName == "LEFT_RELEASED") {
                  bike.stopDrivingLeft();   
                }

                if ( keyName == "RIGHT_RELEASED") {
                 bike.stopDrivingRight(); 
                }
            };

            keyboardController.vent.bind("customKeydown", onKeyDownHandler); 
            keyboardController.vent.bind("customKeyup", onKeyUpHandler); 

            resettingScene = false;
            gameRunning = true;
            
            draw();
            animate();
        }

        var bBearSharkFired = false;
        
        function fireBearShark() {

            if(!bBearSharkFired) {

                //console.log("fireBearShark");

                var bearshark = loadRubeController.getNamedBodies(world, "shark")[0];
                var bearSharkCenter = bearshark.GetWorldCenter();

                bearshark.ApplyImpulse({ x: bearSharkCenter.x, y: 300 }, bearshark.GetWorldCenter());

                bBearSharkFired = true; 
            }

        }

        function step(timestamp) {

            ////console.log("-------------------------------");
            ////console.log("RubeDemoViewController / step ");
            
            if ( resettingScene ) {
                //setViewCenterWorld( {x: -3.4, y: 0.39} );
                //console.log("-------------------------------");
                //console.log("RubeDemoViewController / step / reseting world first  ");
                setupWorld();
                return;
            }
 
            
            var current = Date.now();
            world.Step(1/60, 10, 6);
            var frametime = (Date.now() - current);
            frameTime60 = frameTime60 * (59/60) + frametime * (1/60);
            
            //var futurePos = truck.getFuturePos(); 
            var futurePos = bike.getFuturePos(); 
            setViewCenterWorld( futurePos );
            ////console.log(futurePos);

            stage.update();

            draw();

            statusUpdateCounter++;
            if ( statusUpdateCounter > 20 ) {
                updateStats();
                statusUpdateCounter = 0;
            }
        }

        function setColorFromBodyType(color, b) {
            if (b.IsActive() == false) 
                color.Set(0.5, 0.5, 0.3);
             else if (b.GetType() == b2_staticBody) 
                color.Set(0.5, 0.9, 0.5);
             else if (b.GetType() == b2_kinematicBody) 
                color.Set(0.5, 0.5, 0.9);
             else if (b.IsAwake() == false) 
                color.Set(0.6, 0.6, 0.6);                
             else 
                color.Set(0.9, 0.7, 0.7);
        }

        //for drawing polygons as one path
        function drawLinePolygon(poly, xf) {
            var vertexCount = parseInt(poly.GetVertexCount());
            var localVertices = poly.GetVertices();
            var vertices = new Vector(vertexCount);
            for (var i = 0; i < vertexCount; ++i) {
                vertices[i] = b2Math.MulX(xf, localVertices[i]);
            }
            var drawScale = myDebugDraw.m_drawScale;
            context.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
            for (var i = 1; i < vertexCount; i++) {
                context.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
            }
            context.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        }

        function draw() {

            ////console.log("RubeDemoViewController / draw");
            //truck.step();
            
            //black background
            context.fillStyle = 'rgb(0,0,0)';
            context.fillRect( 0, 0, canvas.width, canvas.height );
            
            context.save();   
            context.translate(canvasOffset.x, canvasOffset.y);
            context.scale(1,-1);
            context.scale(PTM,PTM);
            context.lineWidth /= PTM;
            
            //draw images
            context.save();
            context.scale(1,-1);
                
                if ( world.images ) {
                    for (var i = 0; i < world.images.length; i++) {
                        var imageObj = world.images[i].imageObj;
                        context.save();

                        ////console.log(imageObj);

                        if ( world.images[i].body ) {
                            //body position in world
                            var bodyPos = world.images[i].body.GetPosition();
                            context.translate(bodyPos.x, -bodyPos.y);
                            context.rotate(-world.images[i].body.GetAngle());
                            
                            //image position in body
                            var imageLocalCenter = world.images[i].center;
                            context.translate(imageLocalCenter.x, -imageLocalCenter.y);
                            context.rotate(-world.images[i].angle);
                        }
                        var ratio = 1 / imageObj.height;
                        ratio *= world.images[i].scale;
                        context.scale(ratio, ratio);
                        context.translate(-imageObj.width / 2, -imageObj.height / 2);
                        
                        context.drawImage(imageObj, 0, 0);

                        context.restore();
                    }
                }
                context.restore();
                
                //myDebugDraw.DrawTransform(originTransform); myDebugDraw really is mine and it's not being used
                
                //var flags = myDebugDraw.GetFlags();
                //myDebugDraw.SetFlags(flags & ~e_shapeBit);
                //world.DrawDebugData();
                //myDebugDraw.SetFlags(flags);

                var flags = false;
                        
                if (( flags & e_shapeBit ) != 0) {
                    //query the world for visible fixtures
                    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
                    var viewHalfwidth = 0.5 * canvas.width / PTM;
                    var viewHalfheight = 0.5 * canvas.height / PTM;
                    
                    viewAABB.lowerBound.Set(currentViewCenterWorld.x - viewHalfwidth, currentViewCenterWorld.y - viewHalfheight);
                    viewAABB.upperBound.Set(currentViewCenterWorld.x + viewHalfwidth, currentViewCenterWorld.y + viewHalfheight);
                    visibleFixturesQueryCallback.m_fixtures = [];
                    
                    world.QueryAABB(visibleFixturesQueryCallback, viewAABB);
                    
                    var f, b, xf, s;
                    var color = new b2Color(0, 0, 0);            
                    var circleFixtures = [];
                    var polygonFixtures = [];
                    var staticPolygonFixtures = [];
                    var kinematicPolygonFixtures = [];
                    var dynamicPolygonFixtures = [];
                    for (var i = 0; i < visibleFixturesQueryCallback.m_fixtures.length; i++) {
                        f = visibleFixturesQueryCallback.m_fixtures[i];
                        s = f.GetShape();
                        if ( s.GetType() == b2Shape.e_circleShape ) {
                            circleFixtures.push(f);
                        }
                        else if ( s.GetType() == b2Shape.e_polygonShape ) {
                            polygonFixtures.push(f);
                        }
                    }
                    for (var i = 0; i < circleFixtures.length; i++) {
                        f = circleFixtures[i];
                        s = f.GetShape();
                        b = f.GetBody();
                        xf = b.GetTransform();
                        setColorFromBodyType(color, b);
                        world.DrawShape(s, xf, color);
                    }
                    for (var i = 0; i < polygonFixtures.length; i++) {
                        f = polygonFixtures[i];
                        b = f.GetBody();
                        if (b.GetType() == b2_staticBody) 
                            staticPolygonFixtures.push(f);
                        else if (b.GetType() == b2_kinematicBody) 
                            kinematicPolygonFixtures.push(f);
                        else 
                            dynamicPolygonFixtures.push(f);
                    }
                    context.strokeStyle = "rgb(128,230,128)";
                    context.beginPath();//draw all static polygons as one path
                    for (var i = 0; i < staticPolygonFixtures.length; i++) {
                        f = staticPolygonFixtures[i];
                        s = f.GetShape();
                        b = f.GetBody();
                        xf = b.GetTransform();
                        //world.DrawShape(s, xf, color);
                        drawLinePolygon(s, xf);
                    }
                    context.closePath();
                    context.stroke();
                    
                    context.strokeStyle = "rgb(128,128,230)";
                    context.beginPath();//draw all kinematic polygons as one path
                    for (var i = 0; i < kinematicPolygonFixtures.length; i++) {
                        f = kinematicPolygonFixtures[i];
                        s = f.GetShape();
                        b = f.GetBody();
                        xf = b.GetTransform();
                        //world.DrawShape(s, xf, color);
                        drawLinePolygon(s, xf);
                    }
                    context.closePath();
                    context.stroke();
                    
                    context.strokeStyle = "rgb(230,178,178)";
                    context.beginPath();//draw all dynamic polygons as one path
                    for (var i = 0; i < dynamicPolygonFixtures.length; i++) {
                        f = dynamicPolygonFixtures[i];
                        s = f.GetShape();
                        b = f.GetBody();
                        xf = b.GetTransform();
                        //world.DrawShape(s, xf, color);
                        drawLinePolygon(s, xf);
                    }
                    context.closePath();
                    context.stroke();
                }
                
                if ( mouseJoint != null ) {
                    //mouse joint is not drawn with regular joints in debug draw
                    var p1 = mouseJoint.GetAnchorB();
                    var p2 = mouseJoint.GetTarget();
                    context.strokeStyle = 'rgb(204,204,204)';
                    context.beginPath();
                    context.moveTo(p1.x,p1.y);
                    context.lineTo(p2.x,p2.y);
                    context.stroke();
                }
                
            context.restore();
        }

        function updateStats() {
            
            if ( ! showStats )
                return;
            
            var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            
            /*
            var fbSpan = document.getElementById('feedbackSpan');
            fbSpan.innerHTML =
                "Status: "+(gameRunning?'running':'paused') +
                "<br>Physics step time (average of last 60 steps): "+myRound(frameTime60,2)+"ms" +
                //"<br>Mouse down: "+mouseDown +
                "<br>PTM: "+myRound(PTM,2) +
                "<br>View center: "+myRound(currentViewCenterWorld.x,3)+", "+myRound(currentViewCenterWorld.y,3) +
                //"<br>Canvas offset: "+myRound(canvasOffset.x,0)+", "+myRound(canvasOffset.y,0) +
                "<br>Mouse pos (pixel): "+mousePosPixel.x+", "+mousePosPixel.y +
                "<br>Mouse pos (world): "+myRound(mousePosWorld.x,3)+", "+myRound(mousePosWorld.y,3);
            */
        }

        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       || 
                    window.webkitRequestAnimationFrame || 
                    window.mozRequestAnimationFrame    || 
                    window.oRequestAnimationFrame      || 
                    window.msRequestAnimationFrame     || 
                    function( callback ){
                      window.setTimeout(callback, 1000 / 60);
                    };
        })();

        function animate() {
            if ( gameRunning )
                requestAnimFrame( animate );
            step();
        }

        function pause() {
            gameRunning = !gameRunning;
            if (gameRunning)
                animate();
            updateStats();
        }

        var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
              b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
              b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
              b2MassData = Box2D.Collision.Shapes.b2MassData,
              b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
              b2Shape = Box2D.Collision.Shapes.b2Shape,
              b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
              b2Contact = Box2D.Dynamics.Contacts.b2Contact,
              b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
              b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
              b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
              b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
              b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
              b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
              b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
              b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
              b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
              b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
              b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
              b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
              b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
              b2Body = Box2D.Dynamics.b2Body,
              b2_staticBody = Box2D.Dynamics.b2Body.b2_staticBody,
              b2_kinematicBody = Box2D.Dynamics.b2Body.b2_kinematicBody,
              b2_dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody,
              b2BodyDef = Box2D.Dynamics.b2BodyDef,
              b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
              b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
              b2ContactListener = Box2D.Dynamics.b2ContactListener,
              b2ContactManager = Box2D.Dynamics.b2ContactManager,
              b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
              b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
              b2FilterData = Box2D.Dynamics.b2FilterData,
              b2Fixture = Box2D.Dynamics.b2Fixture,
              b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
              b2Island = Box2D.Dynamics.b2Island,
              b2TimeStep = Box2D.Dynamics.b2TimeStep,
              b2World = Box2D.Dynamics.b2World,
              b2Color = Box2D.Common.b2Color,
              b2internal = Box2D.Common.b2internal,
              b2Settings = Box2D.Common.b2Settings,
              b2Mat22 = Box2D.Common.Math.b2Mat22,
              b2Mat33 = Box2D.Common.Math.b2Mat33,
              b2Math = Box2D.Common.Math.b2Math,
              b2Sweep = Box2D.Common.Math.b2Sweep,
              b2Transform = Box2D.Common.Math.b2Transform,
              b2Vec2 = Box2D.Common.Math.b2Vec2,
              b2Vec3 = Box2D.Common.Math.b2Vec3,
              b2AABB = Box2D.Collision.b2AABB,
              b2Bound = Box2D.Collision.b2Bound,
              b2BoundValues = Box2D.Collision.b2BoundValues,
              b2Collision = Box2D.Collision.b2Collision,
              b2ContactID = Box2D.Collision.b2ContactID,
              b2ContactPoint = Box2D.Collision.b2ContactPoint,
              b2Distance = Box2D.Collision.b2Distance,
              b2DistanceInput = Box2D.Collision.b2DistanceInput,
              b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
              b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
              b2DynamicTree = Box2D.Collision.b2DynamicTree,
              b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
              b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
              b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
              b2Manifold = Box2D.Collision.b2Manifold,
              b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
              b2Point = Box2D.Collision.b2Point,
              b2RayCastInput = Box2D.Collision.b2RayCastInput,
              b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
              b2Segment = Box2D.Collision.b2Segment,
              b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
              b2Simplex = Box2D.Collision.b2Simplex,
              b2SimplexCache = Box2D.Collision.b2SimplexCache,
              b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
              b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
              b2TOIInput = Box2D.Collision.b2TOIInput,
              b2WorldManifold = Box2D.Collision.b2WorldManifold,
              ClipVertex = Box2D.Collision.ClipVertex,
              Features = Box2D.Collision.Features,
              IBroadPhase = Box2D.Collision.IBroadPhase,
              b2Joint = Box2D.Dynamics.Joints.b2Joint,
              b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
              b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
              b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
              b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
              b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
              b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
              b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
              b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
              b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
              b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
              b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
              b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
              b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
              b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
              b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
              b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
              b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
              b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef;

       

        //these need to be kept global for closure advanced optimization
        window['currentTest'] = null;

        function getb2Vec2(x, y){
            return new b2Vec2(x, y); 
        }

        return {
            getWorld : getWorld,
            init : init,
            resetScene : resetScene,
            doAfterLoading : doAfterLoading,
            getb2Vec2 : getb2Vec2,
            setViewCenterWorld : setViewCenterWorld
        }
    }

    return RubeDemoViewController;

});    


