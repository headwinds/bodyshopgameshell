/*
forked and ported from:
http://www.emanueleferonato.com/2010/05/04/following-a-body-with-the-camera-in-Box2DEaselJS-the-smart-way/
*/

define(["controllers/physics/actors/ActorsController",
 		"easel", 
		"box2deasljs",
		"config/config"], function(ActorsController) {

	var CatapultController = function( 	name, 
										canvas, 
										context, 
										cameraWorldSkinsContainer, 
										world, 
										SCALE, 
										actors, 
										bodies, 
										vehicleScaleX, 
										vehicleScaleY, 
										vehicleStartPosX, 
										vehicleStartPosY,
										bFaceRight,
										domainPath) {

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

		// catapult parts
		var bodyPartsScope = {};	

		var the_cannonball_itself; //b2Body;
		var catapult_chassis_body; //b2Body;
		var catapult_arm_body; //b2Body;
		var catapult_arm_launcher; //b2Body;
		
		bodyPartsScope.rear_wheel_body; //b2Body;
		bodyPartsScope.front_wheel_body; //b2Body;
		
		var arm_revolute_joint; //b2RevoluteJoint;
		var front_wheel_revolute_joint; //b2RevoluteJoint;
		var rear_wheel_revolute_joint; //b2RevoluteJoint;

		var left_key_pressed = false;
		var right_key_pressed = false;
		var following_catapult = false;

		var actorsController = new ActorsController(actors, bodies, world, SCALE);

		var buildCannonball = function() {

			var ballSkinImgPath = domainPath + "imgs/vehicles/catapults/common/cannonball.png";
			var ballSkinWidth = 53;
			var ballSkinHeight = 44;
			var ballPoint = { x: vehicleStartPosX/SCALE, y: vehicleStartPosY/SCALE };
			var ballStr = "cannonball"
			var bSpriteSheet = false;
			var animationObj = null; 


			var cannonballSkin = actorsController.createSkin(	ballSkinImgPath,
																ballSkinWidth,
																ballSkinHeight,
																ballPoint,
																ballStr,
																bSpriteSheet,
																animationObj);

			cameraWorldSkinsContainer.addChild(cannonballSkin);

			var density = 20; 
			var friction = 0.9; // 0 no friction to 1
			var restitution = 0.5; // 0 no bounce to 1

			var physicsWidth = 20;
			var physicsHeight = 20;
			var collisionCategory = "teamA";
			var bodyType = {shape: "circle", type: "dynamic"};

			the_cannonball_itself = actorsController.createActor("cannonball",
																cannonballSkin, 
																density, 
																friction, 
																restitution, 
																bodyType,
																ballSkinWidth, 
																ballSkinHeight,
																physicsWidth,
																physicsHeight,
																collisionCategory);
		};

		var buildWheel = function( wheelName, wheelX, wheelY, imgPath, bodyProp ) {
		
			var skinImgPath = domainPath + "imgs/vehicles/catapults/common/wheel.png";
			var skinWidth = 84;
			var skinHeight = 84;
			var x = wheelX;
			var y = wheelY; 
			var point = { x: wheelX/SCALE, y: wheelY/SCALE };
			var name = wheelName; 
			var bSpriteSheet = false;
			var animationObj = null; 


			var wheelSkin = actorsController.createSkin( skinImgPath,
														skinWidth,
														skinHeight,
														point,
														name,
														bSpriteSheet,
														animationObj);

			cameraWorldSkinsContainer.addChild(wheelSkin);

			var density = 30; 
			var friction = 0.9; 
			var restitution = 0.1; 

			var physicsWidth = 40;
			var physicsHeight = 40;
			var collisionCategory = "teamA";
			var bodyType = {shape: "circle", type: "dynamic"};

			bodyPartsScope[bodyProp] = actorsController.createActor(wheelName,
														wheelSkin, 
														density, 
														friction, 
														restitution, 
														bodyType,
														skinWidth, 
														skinHeight,
														physicsWidth,
														physicsHeight,
														collisionCategory);
		};

		var buildWheelMotors = function(frontWheelJointX, rearWheelJointX) {
			var front_wheel_joint = new b2RevoluteJointDef();
			front_wheel_joint.enableMotor=true;
			front_wheel_joint.Initialize(catapult_chassis_body, bodyPartsScope.front_wheel_body, new b2Vec2(0,0));
			front_wheel_joint.localAnchorA=new b2Vec2(frontWheelJointX/SCALE,0);
			front_wheel_joint.localAnchorB=new b2Vec2(0,0);

			front_wheel_revolute_joint = world.CreateJoint(front_wheel_joint);
			front_wheel_revolute_joint.SetMaxMotorTorque(1000000);
			//
			var rear_wheel_joint = new b2RevoluteJointDef();
			rear_wheel_joint.enableMotor = true;
			rear_wheel_joint.Initialize(catapult_chassis_body, bodyPartsScope.rear_wheel_body, new b2Vec2(0,0));
			rear_wheel_joint.localAnchorA = new b2Vec2(rearWheelJointX/SCALE,0);
			rear_wheel_joint.localAnchorB = new b2Vec2(0,0);

			rear_wheel_revolute_joint = new b2RevoluteJointDef();
			rear_wheel_revolute_joint = world.CreateJoint(rear_wheel_joint);
			rear_wheel_revolute_joint.SetMaxMotorTorque(1000000);
		};

		var buildCatapultArm = function() {

			var imgPath = domainPath + "imgs/vehicles/catapults/common/armlauncher.png";
			var skinWidth = 297;
			var skinHeight = 75;
			var x = 210;
			var y = 110; 
			var point = { x: x/vehicleScaleX, y: y/vehicleScaleY };
			var name = "catapult arm"; 
			var bSpriteSheet = false;
			var animationObj = null; 

			var skin = actorsController.createSkin( imgPath,
													skinWidth,
													skinHeight,
													point,
													name,
													bSpriteSheet,
													animationObj);

			cameraWorldSkinsContainer.addChild(skin);

			var density = 5; 
			var friction = 0.9; 
			var restitution = 0.1; 

			var physicsWidth = 150;
			var physicsHeight = 10;
			var collisionCategory = "teamA";

			var arm_part = new b2PolygonShape();
			arm_part.SetAsOrientedBox(150/vehicleScaleX, 10/vehicleScaleY, new b2Vec2(0,0),0);
			
			var arm_fixture = new b2FixtureDef();
			arm_fixture.shape=arm_part;
			arm_fixture.friction=0.9;
			arm_fixture.density=5;
			arm_fixture.restitution=0.1;
			
			var stopper_part = new b2PolygonShape();
			stopper_part.SetAsOrientedBox(10/vehicleScaleX, 20/vehicleScaleY, new b2Vec2(-140/SCALE,-30/SCALE),0);
			
			var stopper_fixture = new b2FixtureDef();
			stopper_fixture.shape = stopper_part;
			stopper_fixture.friction = 0.9;
			stopper_fixture.density = 10;
			stopper_fixture.restitution = 0.1; 

			var fixtures = [arm_fixture, stopper_fixture];

			//var skinOffset = {x: -2.5, y: 0.8};
			var skinOffset = {x: 0, y: -0.7};

			var bodyType = {shape: "box-orientated", 
							type: "dynamic", 
							vector: new b2Vec2(0,0),
							fixtures: fixtures,
							skinOffset: skinOffset};
			var allowSleep = false;

			catapult_arm_body = actorsController.createActor(name,
														skin, 
														density, 
														friction, 
														restitution, 
														bodyType,
														skinWidth, 
														skinHeight,
														physicsWidth,
														physicsHeight,
														collisionCategory, 
														allowSleep);


		};

		/*
		to do: I possibly want to create a separate body for the end of the arm 

		var buildCatapultLauncher = function() {

			var imgPath = domainPath + "imgs/vehicles/catapults/common/launcher.png";
			var skinWidth = 84;
			var skinHeight = 84;
			var x = 10;
			var y = 20; 
			var point = { x: x/SCALE, y: y/SCALE };
			var name = "launcher"; 
			var bSpriteSheet = false;
			var animationObj = null; 

			var skin = actorsController.createSkin( imgPath,
													skinWidth,
													skinHeight,
													point,
													name,
													bSpriteSheet,
													animationObj);

			cameraWorldSkinsContainer.addChild(skin);

			
			var density = 10; 
			var friction = 0.9; 
			var restitution = 0.1; 

			var physicsWidth = 150;
			var physicsHeight = 10;
			var collisionCategory = "teamA";
			var bodyType = {shape: "box-orientated", 
							type: "dynamic",
							vector: new b2Vec2(-140/SCALE,-30/SCALE) };
			var allowSleep = true;

			catapult_arm_launcher = actorsController.createActor(imgPath,
																skin, 
																density, 
																friction, 
																restitution, 
																bodyType,
																skinWidth, 
																skinHeight,
																physicsWidth,
																physicsHeight,
																collisionCategory, 
																allowSleep);
		}
		*/

		var buildCatapultBody = function() {

			var imgPath = domainPath + "imgs/vehicles/catapults/common/mastbase.png";
			var skinWidth = 250;
			var skinHeight = 121;
			var x = vehicleStartPosX;
			var y = vehicleStartPosY; 
			var point = { x: vehicleStartPosX, y: vehicleStartPosY };
			
			var name = "catapult body"; 
			var bSpriteSheet = false;
			var animationObj = null; 

			var skin = actorsController.createSkin( imgPath,
													skinWidth,
													skinHeight,
													point,
													name,
													bSpriteSheet,
													animationObj);

			cameraWorldSkinsContainer.addChild(skin);

			var density = 5; 
			var friction = 0.9; 
			var restitution = 0.1; 

			var physicsWidth = 150;
			var physicsHeight = 10;
			var collisionCategory = "teamA";

			// FIXTURES 
			
			var main_part = new b2PolygonShape();
			main_part.SetAsOrientedBox(125/vehicleScaleX, 20/vehicleScaleY, new b2Vec2(0,0),0);
		
			var chassis_fixture = new b2FixtureDef();
			chassis_fixture.shape = main_part;
			chassis_fixture.friction = 0.9;
			chassis_fixture.density = 50;
			chassis_fixture.restitution = 0.1;
			
			var fixed_arm = new b2PolygonShape();
			fixed_arm.SetAsOrientedBox(20/vehicleScaleX, 60/vehicleScaleY, new b2Vec2(-80/SCALE,-40/SCALE),0);
			
			var fixed_arm_fixture = new b2FixtureDef();
			fixed_arm_fixture.shape = fixed_arm;
			fixed_arm_fixture.friction = 0.9;
			fixed_arm_fixture.density = 1;
			fixed_arm_fixture.restitution = 0.1;

			var fixtures = [chassis_fixture, fixed_arm_fixture];

			//var skinOffset = {x: -2.5, y: -2.5};
			var skinOffset = {x: 0, y: -1.5};

			var bodyType = {shape: "box-orientated", 
							type: "dynamic", 
							vector: new b2Vec2(0,0),
							fixtures: fixtures,
							skinOffset: skinOffset};
			var allowSleep = false;				

			catapult_chassis_body = actorsController.createActor(name,
															skin, 
															density, 
															friction, 
															restitution, 
															bodyType,
															skinWidth, 
															skinHeight,
															physicsWidth,
															physicsHeight,
															collisionCategory, 
															allowSleep);

			
		};

		var buildCatapultMotor = function() {
			var arm_joint = new b2RevoluteJointDef();
			arm_joint.enableMotor = true;
			arm_joint.enableLimit = true;

			arm_joint.Initialize(catapult_chassis_body, catapult_arm_body, new b2Vec2(0,0) );
			
			arm_joint.localAnchorA = new b2Vec2(-80/SCALE,-90/SCALE);
			arm_joint.localAnchorB = new b2Vec2(60/SCALE,0);
			
			arm_revolute_joint = world.CreateJoint(arm_joint);
			arm_revolute_joint.SetMotorSpeed(1000);
			
			arm_revolute_joint.SetLimits(-Math.PI,Math.PI/3);
			arm_revolute_joint.SetMaxMotorTorque(1);
		};

		var setMaxMotorTorque = function( maxTorque ) {
			arm_revolute_joint.SetMaxMotorTorque(maxTorque);
			following_catapult = false;
		}; 

		var setMotorSpeed = function() {
			
			var current_speed;

			if (right_key_pressed) {
				current_speed=1;
			}

			if (left_key_pressed) {
				current_speed=-1;
			}

			if (! right_key_pressed&&! left_key_pressed) {
				current_speed=rear_wheel_revolute_joint.GetMotorSpeed()*0.9;
				if (Math.abs(current_speed)<0.1) {
					current_speed=0;
				}
			}

			rear_wheel_revolute_joint.SetMotorSpeed(current_speed);
			front_wheel_revolute_joint.SetMotorSpeed(current_speed);
		}

		var setKeyPressed = function(keyPressed) {
			if ( keyPressed === "LEFT") {
				right_key_pressed=false;
				left_key_pressed=true;
			} else {
				right_key_pressed=true;
				left_key_pressed=false;
			}
		}

		var getCameraFocus = function() {
			var pos_x;
			var pos_y;

			var cameraX = 0;
			var cameraY = 0; 

			var cameraWidth = canvas.width; // 700
			var cameraHeight = canvas.height; // 500

			var landscapeWidth = 2800;
			var landscapeHeight = 800;

			var cameraRightXLimit = landscapeWidth - 700;
			var cameraLeftXLimit = 0;

			var cameraUpYLimit = landscapeHeight / 2; 
			var cameraDownYLimit = 0;

			setMotorSpeed();
			
			if (following_catapult) {
				pos_x = catapult_chassis_body.GetWorldCenter().x * SCALE;
				pos_y = catapult_chassis_body.GetWorldCenter().y * SCALE;
			} else {
				pos_x = the_cannonball_itself.GetWorldCenter().x * SCALE;
				pos_y = the_cannonball_itself.GetWorldCenter().y * SCALE;
			}

			pos_x = cameraWidth / 2 - pos_x;

			if (pos_x <  -cameraRightXLimit ) {
				pos_x = -cameraRightXLimit;
			};

			if (pos_x > cameraLeftXLimit ) {
				pos_x = cameraLeftXLimit;
			};

			cameraX = pos_x;
			
			pos_y = cameraHeight / 2 - pos_y;
			
			if (pos_y < cameraDownYLimit) {
				pos_y = cameraDownYLimit;
			}

			if (pos_y > cameraUpYLimit ) {
				pos_y = cameraUpYLimit;
			}

			cameraY = pos_y;
		
			return { x: cameraX, y: cameraY };
		}

		var build = function() {
			
			buildCatapultBody();
			buildCatapultArm();
			buildCatapultMotor();

			var frontWheelX = 470;
			var rearWheelX = 220;
			var wheelImgPath = domainPath + "imgs/vehicles/catapults/common/wheel.png";
			buildWheel("front wheel", frontWheelX, 200, wheelImgPath, "front_wheel_body" );
			buildWheel("rear wheel", rearWheelX, 200, wheelImgPath, "rear_wheel_body" );
			
			var frontWheelJointX = 100;
			var rearWheelJointX = -100;
			buildWheelMotors(frontWheelJointX, rearWheelJointX);

			buildCannonball();

		};

		var spawn = function() {
			build(); 
		}

		var vehicleDirection = "right";
		var setDirection = function( dirStr ) {
			vehicleDirection =  dirStr;
		};

		var getDirection = function(  ) {
			return vehicleDirection;
		};

		return {
			spawn: spawn,
			setMaxMotorTorque: setMaxMotorTorque,
			setKeyPressed: setKeyPressed,
			setMotorSpeed: setMotorSpeed,
			getCameraFocus: getCameraFocus,
			setDirection : setDirection
		}

	};

	return CatapultController;

});

