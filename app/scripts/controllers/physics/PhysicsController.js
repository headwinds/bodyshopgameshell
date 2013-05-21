define(["easel", 
		"box2deasljs",
		"controllers/physics/actors/ActorsController",
		"controllers/physics/vehicles/CatapultController",
		"config/config"], function(easel, Box2DEaselJ, ActorsController, CatapultController) {

	var PhysicsController = function(canvas, context, cameraWorldContainer, cameraWorldSkinsContainer, cameraWorldContainerDebugBG, domainPath) {
	
		// Box2DEaselJS vars
		var b2Vec2 = Box2DEaselJS.Common.Math.b2Vec2;
		var b2BodyDef = Box2DEaselJS.Dynamics.b2BodyDef;
		var b2Body = Box2DEaselJS.Dynamics.b2Body;
		var b2FixtureDef = Box2DEaselJS.Dynamics.b2FixtureDef;
		var b2Fixture = Box2DEaselJS.Dynamics.b2Fixture;
		var b2World = Box2DEaselJS.Dynamics.b2World;
		var b2PolygonShape = Box2DEaselJS.Collision.Shapes.b2PolygonShape;
		var b2CircleShape = Box2DEaselJS.Collision.Shapes.b2CircleShape;
		var b2DebugDraw = Box2DEaselJS.Dynamics.b2DebugDraw;
		var b2MassData = Box2DEaselJS.Collision.Shapes.b2MassData;
		var b2RevoluteJointDef = Box2DEaselJS.Dynamics.Joints.b2RevoluteJointDef;

		var floor;
		var floorWidth = 2800; 
		var floorHeight = 10;

		var left;
		var right

		var onFloorY = canvas.height - floorHeight;

		var SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;

		var world; // see setup(); 
		var lastTimestamp = Date.now();
		var fixedTimestepAccumulator = 0;
		var bodiesToRemove = [];
		var actors = [];
		var bodies = [];
		var things = [];

		var actorsController; // see setup(); 
	
		// demo vars
		var bodyDelayCounter = 0; 
		var focused = true;

		var spawnSimple = function( createStr ) {

			var	simpleBodyImgPath = domainPath + config.actorSettings[createStr].imgPath; 
			var	simpleBodyWidth = config.actorSettings[createStr].width; 
			var	simpleBodyHeight = config.actorSettings[createStr].height; 
			var	simpleBodyPhysicsWidth = config.actorSettings[createStr].physicsWidth; 
			var	simpleBodyPhysicsHeight = config.actorSettings[createStr].physicsHeight; 
			var simpleBodyDensity = config.actorSettings[createStr].density;
			var simpleBodyFriction = config.actorSettings[createStr].friction;
			var simpleBodyRestituion = config.actorSettings[createStr].restitution;
			var simpleBodyCollisionTeam = config.actorSettings[createStr].collisionCategory;
			var bodyType = config.actorSettings[createStr].bodyType; 
			var bSpriteSheet = config.actorSettings[createStr].bSpriteSheet; 
			var animationObj = config.actorSettings[createStr].animationObj; 

			simpleBodyX = Math.round(Math.random()*500);
			simpleBodyY = onFloorY;

			var simpleBodyStartX = config.actorSettings[createStr].x; 
			var simpleBodyStartY = config.actorSettings[createStr].y; 

			var simpleBodyPoint = {x: simpleBodyStartX, y: simpleBodyStartY};


			var simpleBodySkin  = actorsController.createSkin(simpleBodyImgPath,
															simpleBodyWidth,
															simpleBodyHeight,
															simpleBodyPoint,
															createStr,
															bSpriteSheet,
															animationObj);

			cameraWorldSkinsContainer.addChild(simpleBodySkin);

			var density = 1; 
			var friction = 0; // 0 no friction to 1
			var restitution = 0; // 0 no bounce to 1

		
			actorsController.createActor(createStr,
										simpleBodySkin, 
										simpleBodyDensity, 
										simpleBodyFriction, 
										simpleBodyRestituion, 
										bodyType, 
										simpleBodyWidth,
										simpleBodyHeight, 
										simpleBodyPhysicsWidth, 
										simpleBodyPhysicsHeight,
										simpleBodyCollisionTeam );
			
		};

		var spawnComplex = function( createStr ) {

			var aParts = config.actorSettings[createStr]; 
			var totalParts = aParts.length; 

			console.log("PhysicsController / spawnComplex: %s parts: %s", createStr, totalParts ); 

			var complexSpawnContainer = new createjs.Container();

			for ( var partCounter = 0; partCounter < totalParts; partCounter++ ) {

				var partObj = aParts[partCounter];
				var	partName = partObj.name;

				if (partName != "joint") {

					var	partImgPath = domainPath + partObj.imgPath; 
					var	partWidth = partObj.width; 
					var	partHeight = partObj.height; 
					var	partSpriteSheetX = partObj.spriteSheetX; 
					var	partSpriteSheetY = partObj.spriteSheetY;
					var	partPhysicsWidth = partObj.physicsWidth; 
					var	partPhysicsHeight = partObj.physicsHeight;
					var partX = partObj.x;
					var partY = partObj.y;
					var partBodyType = partObj.bodyType;
					var partDensity = partObj.density;
					var partFriction = partObj.friction;
					var partRestituion = partObj.restitution;
					var partCollisionTeam = partObj.collisionCategory;
					var bSpriteSheet = partObj.bSpriteSheet; 
					var animationObj = partObj.animationObj; 

					var partPoint = {x: partX, y: partY};

					var partSkin = actorsController.createSkin(	partImgPath, 
																partWidth, 
																partHeight, 
																partPoint, 
																partName, 
																bSpriteSheet,
																animationObj);

					complexSpawnContainer.addChild(partSkin);
					
					actorsController.createActor(partName,
												partSkin, 
												partDensity, 
												partFriction, 
												partRestituion, 
												partBodyType, 
												partWidth,
												partHeight,
												partPhysicsWidth, 
												partPhysicsHeight,
												partCollisionTeam);
				} else {
					switch(createStr) {
						case "cavetroll" :
							actorsController.createJoint("revolute", partObj.connects); 
						break;
						default :
							actorsController.createJoint("distance", partObj.connects); ; 
						break;
					};
				};

			};

			cameraWorldSkinsContainer.addChild(complexSpawnContainer);
		};

		var spawnBlueprint = function( name ) {
			
			var thing;

			switch(name) {
				case "catapult" :
					var catapultScale = 30;
					var catapultScaleX = 37; // higher the number, the whole thing moves to the left
					var catapultScaleY = 37;
					var catapultStartPosX = 190;
					var catapultStartPosY = 400; 

					var bFaceRight = true;
					var thing = new CatapultController(	name, 
														canvas, 
														context, 
														cameraWorldSkinsContainer, 
														world, 
														catapultScale, 
														actors,
														bodies,
														catapultScaleX,
														catapultScaleY,
														catapultStartPosX, 
														catapultStartPosY,
														bFaceRight,
														domainPath ); 
					thing.spawn(); 
					break;
				default :
					//var thing = new BlueprintController(world); 
					break;
			}

			things.push(thing); 

		};

		var spawn = function(type, name) {
			switch(type) {
				case "body-simple" :
					spawnSimple(name);
					break;	
				case "body-complex" :
				case "vehicle" :
					spawnComplex(name);
					break;	
				case "blueprint" :
					spawnBlueprint(name);		
			};
		};

		// Box2DEaselJS world setup and boundaries
		var setup = function() {
			
			world = new b2World(new b2Vec2(0,10), true);
			actorsController = new ActorsController(actors, bodies, world, SCALE);
			
			addDebug();

			spawnSimple("floor"); 

			// listen for collisons
			var contactListener = new Box2DEaselJS.Dynamics.b2ContactListener; 
			contactListener.BeginContact = function( contact_details ) { 
				
			}

			contactListener.EndContact = function( contact_details ) { 
			
			}

			contactListener.PreSolve = function( contact_details ) { 
			
			}

			contactListener.PostSolve = function( contact_details ) { 
			
			}

			 world.SetContactListener(contactListener)

			// to do
			// config and spawn left and right walls instead of setting them up below... 

			// boundaries - left
			
			var leftFixture = new b2FixtureDef;
			leftFixture.shape = new b2PolygonShape;
			leftFixture.shape.SetAsBox(10 / SCALE, 550 / SCALE);
			leftFixture.density = 1;
			leftFixture.restitution = 0.1; // 0 - 1 bounciness 
			leftFixture.friction = 0.9;
			
			var leftBodyDef = new b2BodyDef;
			leftBodyDef.type = b2Body.b2_staticBody;
			leftBodyDef.position.x = -9 / SCALE;
			leftBodyDef.position.y = -25 / SCALE;
			
			left = world.CreateBody(leftBodyDef);
			left.CreateFixture(leftFixture);
			// boundaries - right
			
			var rightFixture = new b2FixtureDef;
			rightFixture.shape = new b2PolygonShape;
			rightFixture.shape.SetAsBox(10 / SCALE, 550 / SCALE);
			rightFixture.density = 1;
			rightFixture.restitution = 0.1; // 0 - 1 bounciness 
			rightFixture.friction = 0.9;
			
			var rightBodyDef = new b2BodyDef;
			rightBodyDef.type = b2Body.b2_staticBody;
			rightBodyDef.position.x = ( (canvas.width * 4) + 9) / SCALE;
			rightBodyDef.position.y = -25 / SCALE;
			
			right = world.CreateBody(rightBodyDef);
			right.CreateFixture(rightFixture);
		};

		var addDebug = function() {
			var debugDraw = new b2DebugDraw();
		
			debugDraw.SetSprite(cameraWorldContainerDebugBG); 
			debugDraw.SetRGBByHexStrokeColor("#CFB52B");
			debugDraw.SetRGBByHexFillColor("#8C7853");
			debugDraw.SetAlphaColor(0.8);
			debugDraw.SetStrokeThickness(2);
			debugDraw.SetDrawScale(SCALE);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			
			world.SetDebugDraw(debugDraw);
		};
 
		var removeActor = function(actor) {
			cameraWorldSkinsContainer.removeChild(actor.skin);
			actors.splice(actors.indexOf(actor),1);
		};

		var update = function() {

			//console.log("PhsyicsController / update");

			var now = Date.now();
			var dt = now - lastTimestamp;
			fixedTimestepAccumulator += dt;
			lastTimestamp = now;
			
			while(fixedTimestepAccumulator >= STEP) {
				// remove bodies before world timestep
				for(var i=0, l=bodiesToRemove.length; i<l; i++) {
					removeActor(bodiesToRemove[i].GetUserData());
					bodiesToRemove[i].SetUserData(null);
					world.DestroyBody(bodiesToRemove[i]);
				}
				bodiesToRemove = [];

				// update active actors
				for(var i=0, l=actors.length; i<l; i++) {
					actors[i].update();
				}
				
				
				var cameraFocusPoint = things[0].getCameraFocus();

				cameraWorldContainer.x = cameraFocusPoint.x; 
  				cameraWorldContainer.y = cameraFocusPoint.y; 
				
				world.Step(TIMESTEP, 10, 10);

				fixedTimestepAccumulator -= STEP;
				world.ClearForces();
	   			
	   			world.DrawDebugData(); // will now clear any debug drawings before attempting to draw again 
	   			
	   			if(bodies.length > 30) {
	   				bodiesToRemove.push(bodies[0]);
	   				bodies.splice(0,1);
	   			}

			}
		};

		var getBodyBySkinName = function(nameStr) {

			var body;

			for (body = world.GetBodyList(); body; body = body.GetNext()) {
				//console.log('name: %s, x: %s, y: %y', body.GetPosition().name, body.GetPosition().x, body.GetPosition().y );
				//console.log( world.GetBodyList() );
				if ( body.GetUserData() != null ) {
					var skinName = body.GetUserData().skin.name;
					if (skinName == nameStr) {
						return body; 
					}
				}
			}
		};

		var connectJoint = function(bodyASkinName, bodyBSkinName){

			var bodyA = getBodyBySkinName(bodyASkinName);
			var bodyB = getBodyBySkinName(bodyBSkinName);
		};

		var pauseResume = function(p) {
			if(p) { TIMESTEP = 0;
			} else { TIMESTEP = 1/STEP; }
			lastTimestamp = Date.now();
		};

		var trigger = function(event, keyName) {

			console.log("PhysicsController / trigger"); 

			keyName = keyName.split("_")[0];

			switch( keyName ) {

				case "SPACE" :
					things[0].setMaxMotorTorque( 5000 ); //2000 - 10000 - near to far
					break;
				case "LEFT" :
				case "RIGHT" :
					things[0].setKeyPressed(keyName);
					things[0].setMotorSpeed();
					break;		
			}
		};

		return {
			update: update,
			spawn: spawn,
			setup: setup,
			addDebug: addDebug,
			trigger: trigger
		}
	};

	return PhysicsController;

});