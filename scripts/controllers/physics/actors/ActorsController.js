define(["easel", 
		"box2d"], function() {

	var ActorsController = function( actors, bodies, world, SCALE ) {

		// Box2d vars
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2Fixture = Box2D.Dynamics.b2Fixture;
		var b2World = Box2D.Dynamics.b2World;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
		var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
		var b2MassData = Box2D.Collision.Shapes.b2MassData;
		var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
		var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;

		var createSkin = function(imgPath, imgWidth, imgHeight, point, name, bSpriteSheet, animationObj) {
			//console.log(arguments, "ActorController createSkin");
			var skin;

			if (bSpriteSheet) {

				var data = {
					images: [imgPath],
					frames: {width:imgWidth, height:imgHeight},
					animations: animationObj.animations
				};

				var spriteSheet = new createjs.SpriteSheet(data);
				if (!spriteSheet.complete) {
				  // not preloaded, listen for onComplete:
				  spriteSheet.onComplete = onSpriteSheetLoadedHandler;
				} 

				var skinBMPAnimation = new createjs.BitmapAnimation(spriteSheet);
   
				skinBMPAnimation.regX = imgWidth / 2;
				skinBMPAnimation.regY = imgHeight / 2; 
				 
				var animationLabel = animationObj.labels[0]; 

				//skinBMPAnimation.gotoAndPlay(animationLabel);
				skinBMPAnimation.stop();
				   
				// I want a shadow to follow on the ground - maybe..   
				 
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

		var actorObject = function(body, skin) {
			this.body = body;
			this.skin = skin;
			this.update = function() {  // translate box2d positions to pixels
				this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
				this.skin.x = this.body.GetWorldCenter().x * SCALE;
				this.skin.y = this.body.GetWorldCenter().y * SCALE;
			}
			actors.push(this);
		};

		var createActor = function(name, skin, density, friction, restitution, bodyType, width, height, physicsWidth, physicsHeight) {

			// console.log("ActorController density: %s, friction: %s, restitution: %s", density, friction, restitution);
			//console.log(arguments, "ActorController createActor");

			var actorFixture = new b2FixtureDef;
			actorFixture.density = density;
			actorFixture.friction = friction;
			actorFixture.restitution = restitution; // 0.6

			switch(bodyType) {
				case "circle" :
					actorFixture.shape = new b2CircleShape( (physicsWidth/2) / SCALE);
				break;
				case "box" :
					actorFixture.shape = new b2PolygonShape;
					var actorWidthScale = ( physicsWidth / 2)  / SCALE;
					var actorHeightScale = ( physicsHeight / 2 ) / SCALE;
					actorFixture.shape.SetAsBox(actorWidthScale, actorHeightScale);
				break;
			}

			var actorBodyDef = new b2BodyDef;
			actorBodyDef.type = b2Body.b2_dynamicBody;
			actorBodyDef.position.x = skin.x / SCALE + 5;
			actorBodyDef.position.y = skin.y / SCALE;
			
			var actorBody = world.CreateBody(actorBodyDef);
			actorBody.CreateFixture(actorFixture);

			// assign actor
			var actor = new actorObject(actorBody, skin);
			actorBody.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
			bodies.push(actorBody);

			return actorBody; 
		};

		var createJoint = function( connects ) {
			var jointDef = new b2RevoluteJointDef();  

			var bodyA = getBodyBySkinName( connects[0] );
			var bodyB = getBodyBySkinName( connects[1] ); 

			jointDef.Initialize(bodyA, bodyB, bodyB.GetPosition());
			jointDef.maxMotorTorque = 10.0;
			jointDef.enableMotor = false;

			joint = world.CreateJoint(jointDef);
			
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
