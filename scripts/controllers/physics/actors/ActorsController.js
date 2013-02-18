define(["easel", 
		"box2deasljs"], function() {

	var ActorsController = function( actors, bodies, world, SCALE ) {

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
		var b2RevoluteJoint = Box2DEaselJS.Dynamics.Joints.b2RevoluteJoint;

		var createSkin = function(imgPath, imgWidth, imgHeight, point, name, bSpriteSheet, animationObj) {
			//console.log(arguments, "ActorController createSkin / name: " + name);
			var skin;

			if (bSpriteSheet) {

				var data = {
					images: [imgPath],
					frames: {width:imgWidth, height:imgHeight},
					animations: animationObj.animations
				};

				var spriteSheet = new createjs.SpriteSheet(data);
				if (!spriteSheet.complete) {
				  spriteSheet.onComplete = onSpriteSheetLoadedHandler;
				} 

				var skinBMPAnimation = new createjs.BitmapAnimation(spriteSheet);
   
				skinBMPAnimation.regX = imgWidth / 2;
				skinBMPAnimation.regY = imgHeight / 2; 
				 
				var animationLabel = animationObj.labels[0]; 

				//skinBMPAnimation.gotoAndPlay(animationLabel); // animating is beyond the scope of my goal to show Debug drawing
				skinBMPAnimation.stop();
				
				skinBMPAnimation.name = name;
				skinBMPAnimation.speed = 1;
				skinBMPAnimation.direction = 90;
				skinBMPAnimation.vX = 3|0.5;
				skinBMPAnimation.vY = 0;
				skinBMPAnimation.x = point.x;
				skinBMPAnimation.y = point.y;
				skinBMPAnimation.snapToPixel = true; 
				skinBMPAnimation.mouseEnabled = false; 
				       
				// have each monster start at a specific frame
				skinBMPAnimation.currentFrame = 0;
				skin = skinBMPAnimation;

			} else {

				var skinBitmap = new createjs.Bitmap(imgPath);
				
				skinBitmap.x = point.x;
				skinBitmap.y = point.y;
				skinBitmap.width = imgWidth;
				skinBitmap.height = imgHeight;
				skinBitmap.regX = imgWidth / 2;   // important to set origin point to center of your bitmap
				skinBitmap.regY = imgHeight / 2; 
				skinBitmap.snapToPixel = true; //only Bitmap 
				skinBitmap.mouseEnabled = false;
				skinBitmap.name = name;

				skin = skinBitmap;
			}

			return skin;
		};

		var onSpriteSheetLoadedHandler = function(e) {
			console.log("ActorsController / onSpriteSheetLoadedHandler"); 
		}; 

		var actorObject = function(body, skin, skinOffset) {
			this.body = body;
			this.skin = skin;
			this.update = function() {  // translate Box2DEaselJS positions to pixels
	
				if ( skinOffset === undefined ) {
					this.skin.x = this.body.GetWorldCenter().x * SCALE;
					this.skin.y = this.body.GetWorldCenter().y * SCALE;
					this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
				} else {
					this.skin.x = (this.body.GetWorldCenter().x + skinOffset.x) * SCALE;
					this.skin.y = (this.body.GetWorldCenter().y + skinOffset.y) * SCALE;
					this.skin.rotation = this.body.GetAngle() * (180 / Math.PI); // the skin isn't following the body properly! the offset is messing it up... 
				}
			}
			actors.push(this);
		};

		var getCollisionObj = function( collisionTeam ) {

			// http://www.aurelienribon.com/blog/2011/07/Box2DEaselJS-tutorial-collision-filtering/

			var teamEnvironmentCategoryBits = 0x0004;
			var teamEnvironmentMaskBits = -1;
			var teamEnvironmentGroupIndex = 1;

			var teamACategoryBits = 0x0002;
			var teamAMaskBits = 0x0001;
			var teamAGroupIndex = -1;

			var teamBCategoryBits = 0x0001;
			var teamBMaskBits = 0x0002;
			var teamBGroupIndex = -2;

			var collisionHash = { 	teamA : { categoryBits: teamACategoryBits, maskBits: teamAMaskBits, groupIndex: teamAGroupIndex},
									teamB : { categoryBits: teamBCategoryBits, maskBits: teamBMaskBits, groupIndex: teamBGroupIndex},
									teamEnvironment : { categoryBits: teamEnvironmentCategoryBits, maskBits: teamEnvironmentMaskBits, groupIndex: teamEnvironmentGroupIndex}
			};

			return collisionHash[collisionTeam];
		};

		var getBodyType = function(typeStr) {
			
			switch(typeStr) {
				case "static" :
					return b2Body.b2_staticBody;
					break;
				case "dynamic" :
					return b2Body.b2_dynamicBody;
					break;
				case "kinematic" :
					return b2Body.b2_kinematicBody;
					break;	
				default : 
					return b2Body.b2_dynamicBody;
			};
		}


		var createActor = function(name, skin, density, friction, restitution, bodyType, width, height, physicsWidth, physicsHeight, collisionTeam, allowSleep) {

			// console.log("ActorController density: %s, friction: %s, restitution: %s", density, friction, restitution);
			//console.log("ActorController createActor / name: " + name);

			var shape = bodyType.shape;
			var type = getBodyType(bodyType.type);

			var actorBodyDef = new b2BodyDef;
			actorBodyDef.type = type;
			actorBodyDef.position.x = skin.x / SCALE + 5;
			actorBodyDef.position.y = skin.y / SCALE;
			actorBodyDef.allowSleep = allowSleep;

			var actorBody = world.CreateBody(actorBodyDef);
			
			if ( bodyType.fixtures === undefined ) {

				var actorFixture = new b2FixtureDef;
				actorFixture.density = density;
				actorFixture.friction = friction;
				actorFixture.restitution = restitution; // 0.6

				var collisionObj = getCollisionObj(collisionTeam);

				actorFixture.filter.groupIndex = collisionObj.groupIndex;

				switch(shape) {
					case "circle" :
						actorFixture.shape = new b2CircleShape( (physicsWidth/2) / SCALE);
						actorFixture.type = type; 
					break;
					case "box" :
						actorFixture.shape = new b2PolygonShape;
						actorFixture.type = type; 
						var actorWidthScale = ( physicsWidth / 2)  / SCALE;
						var actorHeightScale = ( physicsHeight / 2 ) / SCALE;
						actorFixture.shape.SetAsBox(actorWidthScale, actorHeightScale);
					break;
					case "box-orientated" :
						actorFixture.shape = new b2PolygonShape;
						actorFixture.type = type; 
						var actorWidthScale = ( physicsWidth / 2)  / SCALE;
						var actorHeightScale = ( physicsHeight / 2 ) / SCALE;
						actorFixture.shape.SetAsOrientedBox(actorWidthScale, actorHeightScale, bodyType.vector, 0);
					break;
				}

				actorBody.CreateFixture(actorFixture);

			} else {

				var totalFixtures = bodyType.fixtures.length;

				for ( var fixtureCounter = 0; fixtureCounter < totalFixtures; fixtureCounter++) {
					actorBody.CreateFixture( bodyType.fixtures[fixtureCounter] );
				}

			}

			

			// you may wish to offset the skin for visual effect
			var actor;
			if ( bodyType.skinOffset === undefined )  actor = new actorObject(actorBody, skin);
			else actor = new actorObject(actorBody, skin, bodyType.skinOffset);

			actorBody.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
			bodies.push(actorBody);

			return actorBody; 
		};

		var createJoint = function( typeStr, connects ) {
			switch(typeStr) {
				case "revolute" :
					createRevoluteJoint(connects);
				break;
				case "distance" :
					createDistanceJoint(connects);
				break;
				default:
					createDistanceJoint(connects);
				break;
			}
		}

		var createRevoluteJoint = function( connects ) {
			var revoluteJointDef = new b2RevoluteJointDef();  

			//jointDef.anchor = new b2Vec2(399.65/drawScale, 464.8/drawScale);
			revoluteJointDef.collideConnected = false;

			var bodyA = getBodyBySkinName( connects[0] );
			var bodyB = getBodyBySkinName( connects[1] ); 

			revoluteJointDef.Initialize(bodyA, bodyB, bodyB.GetPosition());
			revoluteJointDef.maxMotorTorque = 10.0;
			revoluteJointDef.enableMotor = false;

			world.CreateJoint(revoluteJointDef);
		};

		var createDistanceJoint = function( connects ) {
			var distanceJointDef = new b2DistanceJointDef();  

			distanceJointDef.bodyA = bodyA;
			distanceJointDef.bodyB = bodyB;
			distanceJointDef.dampingRatio = 0.7;
			distanceJointDef.frequencyHz = 0.2;
			distanceJointDef.collideConnected = true;
			distanceJointDef.localAnchorA = new b2Vec2(bodyA.GetPosition().x,bodyA.GetPosition().y);
			distanceJointDef.localAnchorB = new b2Vec2(bodyB.GetPosition().x,bodyB.GetPosition().y);

			world.CreateJoint(distanceJointDef);
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

		return {
			createSkin: createSkin,
			createActor: createActor,
			createJoint: createJoint
		};

	};	

	return ActorsController;

});
