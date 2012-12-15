/*
http://www.emanueleferonato.com/2010/05/04/following-a-body-with-the-camera-in-box2d-the-smart-way/
http://sk8r.googlecode.com/hg-history/24d42df9e0bd324f13457ab1fa0ea5483e89467a/experiments/box2d/experiment6/index.html
*/

define(["controllers/physics/actors/ActorsController",
 		"easel", 
		"box2d",
		"config/config"], function(ActorsController) {

	var CatapultController = function( name, canvas, context, cameraWorldContainer, world, SCALE, actors, bodies, catapultScaleX, catapultScaleY, bFaceRight ) {

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

		// catapult parts
		var the_cannonball_itself; //b2Body;
		var catapult_chassis_body; //b2Body;
		var catapult_arm_body; //b2Body;
		var rear_wheel_body; //b2Body;
		var front_wheel_body; //b2Body;
		var arm_revolute_joint; //b2RevoluteJoint;
		var front_wheel_revolute_joint; //b2RevoluteJoint;
		var rear_wheel_revolute_joint; //b2RevoluteJoint;

		var left_key_pressed = false;
		var right_key_pressed = false;
		var following_catapult = false;

		var actorsController = new ActorsController(actors, bodies, world, SCALE);

		var buildCannonball = function() {

			var cannonball = new b2BodyDef();
			cannonball.position.Set(90/SCALE, 90/SCALE);
			cannonball.type = b2Body.b2_dynamicBody;

			var ballSkinImgPath = "../imgs/vehicles/catapults/common/cannonball.png";
			var ballSkinWidth = 53;
			var ballSkinHeight = 44;
			var ballPoint = { x: 90/SCALE, y: 90/SCALE };
			var ballStr = "ball"
			var bSpriteSheet = false;
			var animationObj = null; 


			var cannonballSkin = actorsController.createSkin(	ballSkinImgPath,
																ballSkinWidth,
																ballSkinHeight,
																ballPoint,
																ballStr,
																bSpriteSheet,
																animationObj);

			cameraWorldContainer.addChild(cannonballSkin);

			var density = 20; 
			var friction = 0.9; // 0 no friction to 1
			var restitution = 0.5; // 0 no bounce to 1

			var physicsWidth = 20;
			var physicsHeight = 20;

			the_cannonball_itself = actorsController.createActor("cannonball",
																cannonballSkin, 
																density, 
																friction, 
																restitution, 
																"circle", 
																ballSkinWidth, 
																ballSkinHeight,
																physicsWidth,
																physicsHeight);
		}

		var buildWheelMotors = function() {
			var front_wheel_joint = new b2RevoluteJointDef();
			front_wheel_joint.enableMotor=true;
			front_wheel_joint.Initialize(catapult_chassis_body, front_wheel_body,new b2Vec2(0,0));
			front_wheel_joint.localAnchorA=new b2Vec2(80/SCALE,0);
			front_wheel_joint.localAnchorB=new b2Vec2(0,0);

			front_wheel_revolute_joint = world.CreateJoint(front_wheel_joint);
			front_wheel_revolute_joint.SetMaxMotorTorque(1000000);
			//
			var rear_wheel_joint = new b2RevoluteJointDef();
			rear_wheel_joint.enableMotor = true;
			rear_wheel_joint.Initialize(catapult_chassis_body, rear_wheel_body, new b2Vec2(0,0));
			rear_wheel_joint.localAnchorA = new b2Vec2(-80/SCALE,0);
			rear_wheel_joint.localAnchorB = new b2Vec2(0,0);

			rear_wheel_revolute_joint = new b2RevoluteJointDef();
			rear_wheel_revolute_joint = world.CreateJoint(rear_wheel_joint);
			rear_wheel_revolute_joint.SetMaxMotorTorque(1000000);
		}

		var buildWheels = function() {
			var rear_wheel = new b2BodyDef();
			rear_wheel.position.Set(250/SCALE, 200/SCALE);
			rear_wheel.type = b2Body.b2_dynamicBody;
			
			var rear_wheel_shape = new b2CircleShape(40/SCALE);
			var rear_wheel_fixture = new b2FixtureDef();
			
			rear_wheel_fixture.shape = rear_wheel_shape;
			rear_wheel_fixture.friction = 0.9;
			rear_wheel_fixture.density = 30;
			rear_wheel_fixture.restitution = 0.1;
			
			rear_wheel_body = world.CreateBody(rear_wheel);
			rear_wheel_body.CreateFixture(rear_wheel_fixture);
			
			var front_wheel= new b2BodyDef();
			front_wheel.position.Set(450/SCALE, 200/SCALE);
			front_wheel.type = b2Body.b2_dynamicBody;
			
			var front_wheel_shape = new b2CircleShape(40/SCALE);
			var front_wheel_fixture = new b2FixtureDef();
			
			front_wheel_fixture.shape=front_wheel_shape;
			front_wheel_fixture.friction=0.9;
			front_wheel_fixture.density=30;
			front_wheel_fixture.restitution=0.1;

			front_wheel_body = world.CreateBody(front_wheel);
			front_wheel_body.CreateFixture(front_wheel_fixture);
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

		var buildCatapultArm = function() {
			var catapult_arm = new b2BodyDef();
			catapult_arm.allowSleep = false;
			catapult_arm.position.Set(210/SCALE,110/SCALE);
			catapult_arm.type = b2Body.b2_dynamicBody;
			
			var arm_part = new b2PolygonShape();
			arm_part.SetAsOrientedBox(150/SCALE, 10/SCALE, new b2Vec2(0,0),0);
			
			var arm_part_fixture = new b2FixtureDef();
			arm_part_fixture.shape=arm_part;
			arm_part_fixture.friction=0.9;
			arm_part_fixture.density=5;
			arm_part_fixture.restitution=0.1;
			
			var stopper = new b2PolygonShape();
			stopper.SetAsOrientedBox(10/SCALE, 20/SCALE, new b2Vec2(-140/SCALE,-30/SCALE),0);
			
			var stopper_fixture = new b2FixtureDef();
			stopper_fixture.shape = stopper;
			stopper_fixture.friction = 0.9;
			stopper_fixture.density = 10;
			stopper_fixture.restitution = 0.1;

			catapult_arm_body = world.CreateBody(catapult_arm);
			catapult_arm_body.CreateFixture(arm_part_fixture);
			catapult_arm_body.CreateFixture(stopper_fixture);
		}

		var buildCatapultBody = function() {
			
			var catapult_body = new b2BodyDef();
			catapult_body.position.Set(350/catapultScaleX,200/catapultScaleY);
			catapult_body.type = b2Body.b2_dynamicBody;
			
			var main_part = new b2PolygonShape();
			main_part.SetAsOrientedBox(125/SCALE, 20/SCALE, new b2Vec2(0,0),0);
		
			var chassis_fixture = new b2FixtureDef();
			chassis_fixture.shape = main_part;
			chassis_fixture.friction = 0.9;
			chassis_fixture.density = 50;
			chassis_fixture.restitution = 0.1;
			
			var fixed_arm = new b2PolygonShape();
			fixed_arm.SetAsOrientedBox(20/SCALE, 60/SCALE, new b2Vec2(-80/SCALE,-40/SCALE),0);
			
			var fixed_arm_fixture = new b2FixtureDef();
			fixed_arm_fixture.shape = fixed_arm;
			fixed_arm_fixture.friction = 0.9;
			fixed_arm_fixture.density = 1;
			fixed_arm_fixture.restitution = 0.1;

			catapult_chassis_body = world.CreateBody(catapult_body);
			catapult_chassis_body.CreateFixture(chassis_fixture);
			catapult_chassis_body.CreateFixture(fixed_arm_fixture);
			
		}

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
			buildWheels();
			buildWheelMotors();
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

