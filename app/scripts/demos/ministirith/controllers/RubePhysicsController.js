
// credit: 
// I basically took what I needed from loadrube.js and testbed.js scripts by Chris Cambell (iforce2d.net)
// and wrapped them in a define block to modularize it; fix some namespace issues; and then added my own update method.

define( ["jquery",
        "underscore",
        "backbone"], function ($, _, Backbone) { 

    var RubePhysicsUtil = function(canvas, 
                  context, 
                  cameraWorldContainer, 
                  cameraWorldSkinsContainer, 
                  cameraWorldContainerDebugBG, 
                  domainPath) {

        var b2CircleShape = Box2DEaselJS.Collision.Shapes.b2CircleShape,
          b2EdgeChainDef = Box2DEaselJS.Collision.Shapes.b2EdgeChainDef,
          b2EdgeShape = Box2DEaselJS.Collision.Shapes.b2EdgeShape,
          b2MassData = Box2DEaselJS.Collision.Shapes.b2MassData,
          b2PolygonShape = Box2DEaselJS.Collision.Shapes.b2PolygonShape,
          b2Shape = Box2DEaselJS.Collision.Shapes.b2Shape,
          b2CircleContact = Box2DEaselJS.Dynamics.Contacts.b2CircleContact,
          b2Contact = Box2DEaselJS.Dynamics.Contacts.b2Contact,
          b2ContactConstraint = Box2DEaselJS.Dynamics.Contacts.b2ContactConstraint,
          b2ContactConstraintPoint = Box2DEaselJS.Dynamics.Contacts.b2ContactConstraintPoint,
          b2ContactEdge = Box2DEaselJS.Dynamics.Contacts.b2ContactEdge,
          b2ContactFactory = Box2DEaselJS.Dynamics.Contacts.b2ContactFactory,
          b2ContactRegister = Box2DEaselJS.Dynamics.Contacts.b2ContactRegister,
          b2ContactResult = Box2DEaselJS.Dynamics.Contacts.b2ContactResult,
          b2ContactSolver = Box2DEaselJS.Dynamics.Contacts.b2ContactSolver,
          b2EdgeAndCircleContact = Box2DEaselJS.Dynamics.Contacts.b2EdgeAndCircleContact,
          b2NullContact = Box2DEaselJS.Dynamics.Contacts.b2NullContact,
          b2PolyAndCircleContact = Box2DEaselJS.Dynamics.Contacts.b2PolyAndCircleContact,
          b2PolyAndEdgeContact = Box2DEaselJS.Dynamics.Contacts.b2PolyAndEdgeContact,
          b2PolygonContact = Box2DEaselJS.Dynamics.Contacts.b2PolygonContact,
          b2PositionSolverManifold = Box2DEaselJS.Dynamics.Contacts.b2PositionSolverManifold,
          b2Body = Box2DEaselJS.Dynamics.b2Body,
          b2_staticBody = Box2DEaselJS.Dynamics.b2Body.b2_staticBody,
          b2_kinematicBody = Box2DEaselJS.Dynamics.b2Body.b2_kinematicBody,
          b2_dynamicBody = Box2DEaselJS.Dynamics.b2Body.b2_dynamicBody,
          b2BodyDef = Box2DEaselJS.Dynamics.b2BodyDef,
          b2ContactFilter = Box2DEaselJS.Dynamics.b2ContactFilter,
          b2ContactImpulse = Box2DEaselJS.Dynamics.b2ContactImpulse,
          b2ContactListener = Box2DEaselJS.Dynamics.b2ContactListener,
          b2ContactManager = Box2DEaselJS.Dynamics.b2ContactManager,
          b2DebugDraw = Box2DEaselJS.Dynamics.b2DebugDraw,
          b2DestructionListener = Box2DEaselJS.Dynamics.b2DestructionListener,
          b2FilterData = Box2DEaselJS.Dynamics.b2FilterData,
          b2Fixture = Box2DEaselJS.Dynamics.b2Fixture,
          b2FixtureDef = Box2DEaselJS.Dynamics.b2FixtureDef,
          b2Island = Box2DEaselJS.Dynamics.b2Island,
          b2TimeStep = Box2DEaselJS.Dynamics.b2TimeStep,
          b2World = Box2DEaselJS.Dynamics.b2World,
          b2Color = Box2DEaselJS.Common.b2Color,
          b2internal = Box2DEaselJS.Common.b2internal,
          b2Settings = Box2DEaselJS.Common.b2Settings,
          b2Mat22 = Box2DEaselJS.Common.Math.b2Mat22,
          b2Mat33 = Box2DEaselJS.Common.Math.b2Mat33,
          b2Math = Box2DEaselJS.Common.Math.b2Math,
          b2Sweep = Box2DEaselJS.Common.Math.b2Sweep,
          b2Transform = Box2DEaselJS.Common.Math.b2Transform,
          b2Vec2 = Box2DEaselJS.Common.Math.b2Vec2,
          b2Vec3 = Box2DEaselJS.Common.Math.b2Vec3,
          b2AABB = Box2DEaselJS.Collision.b2AABB,
          b2Bound = Box2DEaselJS.Collision.b2Bound,
          b2BoundValues = Box2DEaselJS.Collision.b2BoundValues,
          b2Collision = Box2DEaselJS.Collision.b2Collision,
          b2ContactID = Box2DEaselJS.Collision.b2ContactID,
          b2ContactPoint = Box2DEaselJS.Collision.b2ContactPoint,
          b2Distance = Box2DEaselJS.Collision.b2Distance,
          b2DistanceInput = Box2DEaselJS.Collision.b2DistanceInput,
          b2DistanceOutput = Box2DEaselJS.Collision.b2DistanceOutput,
          b2DistanceProxy = Box2DEaselJS.Collision.b2DistanceProxy,
          b2DynamicTree = Box2DEaselJS.Collision.b2DynamicTree,
          b2DynamicTreeBroadPhase = Box2DEaselJS.Collision.b2DynamicTreeBroadPhase,
          b2DynamicTreeNode = Box2DEaselJS.Collision.b2DynamicTreeNode,
          b2DynamicTreePair = Box2DEaselJS.Collision.b2DynamicTreePair,
          b2Manifold = Box2DEaselJS.Collision.b2Manifold,
          b2ManifoldPoint = Box2DEaselJS.Collision.b2ManifoldPoint,
          b2Point = Box2DEaselJS.Collision.b2Point,
          b2RayCastInput = Box2DEaselJS.Collision.b2RayCastInput,
          b2RayCastOutput = Box2DEaselJS.Collision.b2RayCastOutput,
          b2Segment = Box2DEaselJS.Collision.b2Segment,
          b2SeparationFunction = Box2DEaselJS.Collision.b2SeparationFunction,
          b2Simplex = Box2DEaselJS.Collision.b2Simplex,
          b2SimplexCache = Box2DEaselJS.Collision.b2SimplexCache,
          b2SimplexVertex = Box2DEaselJS.Collision.b2SimplexVertex,
          b2TimeOfImpact = Box2DEaselJS.Collision.b2TimeOfImpact,
          b2TOIInput = Box2DEaselJS.Collision.b2TOIInput,
          b2WorldManifold = Box2DEaselJS.Collision.b2WorldManifold,
          ClipVertex = Box2DEaselJS.Collision.ClipVertex,
          Features = Box2DEaselJS.Collision.Features,
          IBroadPhase = Box2DEaselJS.Collision.IBroadPhase,
          b2Joint = Box2DEaselJS.Dynamics.Joints.b2Joint,
          b2JointDef = Box2DEaselJS.Dynamics.Joints.b2JointDef,
          b2JointEdge = Box2DEaselJS.Dynamics.Joints.b2JointEdge,
          b2LineJoint = Box2DEaselJS.Dynamics.Joints.b2LineJoint,
          b2LineJointDef = Box2DEaselJS.Dynamics.Joints.b2LineJointDef,
          b2MouseJoint = Box2DEaselJS.Dynamics.Joints.b2MouseJoint,
          b2MouseJointDef = Box2DEaselJS.Dynamics.Joints.b2MouseJointDef,
          b2PrismaticJoint = Box2DEaselJS.Dynamics.Joints.b2PrismaticJoint,
          b2PrismaticJointDef = Box2DEaselJS.Dynamics.Joints.b2PrismaticJointDef,
          b2PulleyJoint = Box2DEaselJS.Dynamics.Joints.b2PulleyJoint,
          b2PulleyJointDef = Box2DEaselJS.Dynamics.Joints.b2PulleyJointDef,
          b2RevoluteJoint = Box2DEaselJS.Dynamics.Joints.b2RevoluteJoint,
          b2RevoluteJointDef = Box2DEaselJS.Dynamics.Joints.b2RevoluteJointDef,
          b2WeldJoint = Box2DEaselJS.Dynamics.Joints.b2WeldJoint,
          b2WeldJointDef = Box2DEaselJS.Dynamics.Joints.b2WeldJointDef,
          b2DistanceJoint = Box2DEaselJS.Dynamics.Joints.b2DistanceJoint,
          b2DistanceJointDef = Box2DEaselJS.Dynamics.Joints.b2DistanceJointDef,
          b2FrictionJoint = Box2DEaselJS.Dynamics.Joints.b2FrictionJoint,
          b2FrictionJointDef = Box2DEaselJS.Dynamics.Joints.b2FrictionJointDef;

        var e_shapeBit = 0x0001;
        var e_jointBit = 0x0002;
        var e_aabbBit = 0x0004;
        var e_pairBit = 0x0008;
        var e_centerOfMassBit = 0x0010;

        var PTM = 32;

        var SCALE = PTM, STEP = 20, TIMESTEP = 1/STEP;

        var world = null;
        var lastTimestamp = Date.now();
        var fixedTimestepAccumulator = 0;
        var bodiesToRemove = [];
        var actors = [];
        var bodies = [];
        var wheelBodies = [];
        var mouseJointGroundBody;
        var canvas;
        var context;
        var myDebugDraw;        
        var mouseDownQueryCallback;
        var visibleFixturesQueryCallback;
        var mouseJoint = null;        
        var run = true;
        var frameTime60 = 0;
        var statusUpdateCounter = 0;
        var showStats = false;        
        var mouseDown = false;
        var shiftDown = false;
        var originTransform;
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

        var setup = function(){
          createWorld(); 

          wheelBodies = getNamedBodies(world, "truckwheel");
    
            if ( world.images ) {
                for (var i = 0; i < world.images.length; i++) {
                    var imageObj = new Image();
                    imageObj.src = world.images[i].file;
                    world.images[i].imageObj = imageObj;
                }
            }
            
  
            resettingScene = false;
        }

        var myRound = function(val,places) {
            var c = 1;
            for (var i = 0; i < places; i++)
                c *= 10;
            return Math.round(val*c)/c;
        }
                
        var getWorldPointFromPixelPoint = function(pixelPoint) {
            return {                
                x: (pixelPoint.x - canvasOffset.x)/PTM,
                y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
            };
        }

        var updateMousePos = function(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            mousePosPixel = {
                x: evt.clientX - rect.left,
                y: canvas.height - (evt.clientY - rect.top)
            };
            mousePosWorld = getWorldPointFromPixelPoint(mousePosPixel);
        }

        var setViewCenterWorld = function(b2vecpos, instantaneous) {
            var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            var toMoveX = b2vecpos.x - currentViewCenterWorld.x;
            var toMoveY = b2vecpos.y - currentViewCenterWorld.y;
            var fraction = instantaneous ? 1 : 0.25;
            canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
            canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
        }

        var createWorld = function() {

            if ( world != null ) { 
                Box2DEaselJS.destroy(world);
                world = null;
            };

            var gravity =  new b2Vec2(0.0, -9.8);
            var allowSleep = true;   
            world = new b2World( gravity, allowSleep );
            //world = new Box2DEaselJS.Dynamics.b2World(new Box2DEaselJS.Common.Math.b2Vec2(0, 9.8) /* gravity */, true /* allowSleep */);

            addDebug(); 
          
            //mouseJointGroundBody = world.CreateBody( new b2BodyDef() );

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


        var getWorld = function() {
            return world;
        };  

        var getWorldInfo = function() {
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
        var resetScene = function() {
            resettingScene = true;
            createWorld();
            draw();
        }
        
        //Object.prototype.hasOwnProperty = function(property) {
          //  return typeof(this[property]) !== 'undefined'
        //};

        var loadBodyFromRUBE = function(bodyJso, world) {
            //console.log(bodyJso);
            
            if ( ! bodyJso.hasOwnProperty('type') ) {
                console.log("Body does not have a 'type' property");
                return null;
            }    
            
            var bd = new b2BodyDef();

            if ( bodyJso.type == 2 )
                bd.type = b2_dynamicBody;
            else if ( bodyJso.type == 1 )
                bd.type = b2_kinematicBody;

            if ( bodyJso.hasOwnProperty('angle') ) {
                bd.angle = bodyJso.angle;
            }
            
            if ( bodyJso.hasOwnProperty('angularVelocity') )
                bd.angularVelocity = bodyJso.angularVelocity;
            
            if ( bodyJso.hasOwnProperty('active') )
                bd.awake = bodyJso.active;        
            
            if ( bodyJso.hasOwnProperty('fixedRotation') )
                bd.fixedRotation = bodyJso.fixedRotation;
            
            if ( bodyJso.hasOwnProperty('linearVelocity') && bodyJso.linearVelocity instanceof Object )
                bd.linearVelocity.SetV( bodyJso.linearVelocity );
            
            if ( bodyJso.hasOwnProperty('position') && bodyJso.position instanceof Object ) { 
                
                // all good 
                /* 
                if ( bodyJso.name === "trebuchetArm") {
                  console.log("checking position");
                
                  console.log(bodyJso, "Found one bodyJso.position name: " + bodyJso.name);
                  console.log("-----------------");
                }
                */
                
                bd.position.SetV( bodyJso.position );
            }
            
            if ( bodyJso.hasOwnProperty('awake') )
                bd.awake = bodyJso.awake;
            else
                bd.awake = false;

            var bodyName = bodyJso.name;
            var body = world.CreateBody(bd, bodyName );

            if ( bodyJso.hasOwnProperty('fixture') ) {
                for (k = 0; k < bodyJso['fixture'].length; k++) {
                    var fixtureJso = bodyJso['fixture'][k];
                    loadFixtureFromRUBE(body, fixtureJso);
                }
            }

            //console.log(bd);

            //if ( body.name === "trebuchetBody") console.log(bd, "body def"); 

            if ( bodyJso.hasOwnProperty('name') )
                body.name = bodyJso.name;


            return body;
        }

        var loadFixtureFromRUBE = function(body, fixtureJso) {    
            //console.log(fixtureJso);
            var fd = new b2FixtureDef();
            if (fixtureJso.hasOwnProperty('friction'))
                fd.friction = fixtureJso.friction;
            if (fixtureJso.hasOwnProperty('density'))
                fd.density = fixtureJso.density;
            if (fixtureJso.hasOwnProperty('restitution'))
                fd.restitution = fixtureJso.restitution;
            if (fixtureJso.hasOwnProperty('sensor'))
                fd.isSensor = fixtureJso.sensor;
            if ( fixtureJso.hasOwnProperty('filter-categoryBits') )
                fd.filter.categoryBits = fixtureJso['filter-categoryBits'];
            if ( fixtureJso.hasOwnProperty('filter-maskBits') )
                fd.filter.maskBits = fixtureJso['filter-maskBits'];
            if ( fixtureJso.hasOwnProperty('filter-groupIndex') )
                fd.filter.groupIndex = fixtureJso['filter-groupIndex'];
            if (fixtureJso.hasOwnProperty('circle')) {
                fd.shape = new b2CircleShape();
                fd.shape.m_radius = fixtureJso.circle.radius;
                if ( fixtureJso.circle.center )
                    fd.shape.m_p.SetV(fixtureJso.circle.center);
                var fixture = body.CreateFixture(fd);        
                if ( fixtureJso.name )
                    fixture.name = fixtureJso.name;
            }
            else if (fixtureJso.hasOwnProperty('polygon')) {
                fd.shape = new b2PolygonShape();
                var verts = [];
                for (v = 0; v < fixtureJso.polygon.vertices.x.length; v++) 
                   verts.push( new b2Vec2( fixtureJso.polygon.vertices.x[v], fixtureJso.polygon.vertices.y[v] ) );
                fd.shape.SetAsArray(verts, verts.length);
                var fixture = body.CreateFixture(fd);        
                if ( fixture && fixtureJso.name )
                    fixture.name = fixtureJso.name;
            }
            else if (fixtureJso.hasOwnProperty('chain')) {
                fd.shape = new b2PolygonShape();
                var lastVertex = new b2Vec2();
                for (v = 0; v < fixtureJso.chain.vertices.x.length; v++) {
                    var thisVertex = new b2Vec2( fixtureJso.chain.vertices.x[v], fixtureJso.chain.vertices.y[v] );
                    if ( v > 0 ) {
                        fd.shape.SetAsEdge( lastVertex, thisVertex );
                        var fixture = body.CreateFixture(fd);        
                        if ( fixtureJso.name )
                            fixture.name = fixtureJso.name;
                    }
                    lastVertex = thisVertex;
                }
            }
            else {
                console.log("Could not find shape type for fixture");
            }
        }

        var getVectorValue = function(val) {
            if ( val instanceof Object )
                return val;
            else
                return { x:0, y:0 };
        }

        var loadJointCommonProperties = function(jd, jointJso, loadedBodies) {    
            jd.bodyA = loadedBodies[jointJso.bodyA];
            jd.bodyB = loadedBodies[jointJso.bodyB];
            jd.localAnchorA.SetV( getVectorValue(jointJso.anchorA) );
            jd.localAnchorB.SetV( getVectorValue(jointJso.anchorB) );
            if ( jointJso.collideConnected )
                jd.collideConnected = jointJso.collideConnected;
        }

        var loadJointFromRUBE = function(jointJso, world, loadedBodies) {
            if ( ! jointJso.hasOwnProperty('type') ) {
                console.log("Joint does not have a 'type' property");
                return null;
            }    
            if ( jointJso.bodyA >= loadedBodies.length ) {
                console.log("Index for bodyA is invalid: " + jointJso.bodyA );
                return null;
            }    
            if ( jointJso.bodyB >= loadedBodies.length ) {
                console.log("Index for bodyB is invalid: " + jointJso.bodyB );
                return null;
            }
            
            var joint = null;
            if ( jointJso.type == "revolute" ) {
                var jd = new b2RevoluteJointDef();
                loadJointCommonProperties(jd, jointJso, loadedBodies);
                if ( jointJso.hasOwnProperty('refAngle') )
                    jd.referenceAngle = jointJso.refAngle;
                if ( jointJso.hasOwnProperty('lowerLimit') )
                    jd.lowerAngle = jointJso.lowerLimit;
                if ( jointJso.hasOwnProperty('upperLimit') )
                    jd.upperAngle = jointJso.upperLimit;
                if ( jointJso.hasOwnProperty('maxMotorTorque') )
                    jd.maxMotorTorque = jointJso.maxMotorTorque;
                if ( jointJso.hasOwnProperty('motorSpeed') )
                    jd.motorSpeed = jointJso.motorSpeed;
                if ( jointJso.hasOwnProperty('enableLimit') )
                    jd.enableLimit = jointJso.enableLimit;
                if ( jointJso.hasOwnProperty('enableMotor') )
                    jd.enableMotor = jointJso.enableMotor;
                joint = world.CreateJoint(jd);
            }
            else if ( jointJso.type == "distance" ) {
                var jd = new b2DistanceJointDef();
                loadJointCommonProperties(jd, jointJso, loadedBodies);
                if ( jointJso.hasOwnProperty('length') )
                    jd.length = jointJso.length;
                if ( jointJso.hasOwnProperty('dampingRatio') )
                    jd.dampingRatio = jointJso.dampingRatio;
                if ( jointJso.hasOwnProperty('frequency') )
                    jd.frequencyHz = jointJso.frequency;
                joint = world.CreateJoint(jd);
            }
            else if ( jointJso.type == "prismatic" ) {
                var jd = new b2PrismaticJointDef();
                loadJointCommonProperties(jd, jointJso, loadedBodies);        
                if ( jointJso.hasOwnProperty('localAxisA') )
                    jd.localAxisA.SetV( getVectorValue(jointJso.localAxisA) );         
                if ( jointJso.hasOwnProperty('refAngle') )
                    jd.referenceAngle = jointJso.refAngle;
                if ( jointJso.hasOwnProperty('enableLimit') )
                    jd.enableLimit = jointJso.enableLimit;
                if ( jointJso.hasOwnProperty('lowerLimit') )
                    jd.lowerTranslation = jointJso.lowerLimit;
                if ( jointJso.hasOwnProperty('upperLimit') )
                    jd.upperTranslation = jointJso.upperLimit;
                if ( jointJso.hasOwnProperty('enableMotor') )
                    jd.enableMotor = jointJso.enableMotor;
                if ( jointJso.hasOwnProperty('maxMotorForce') )
                    jd.maxMotorForce = jointJso.maxMotorForce;
                if ( jointJso.hasOwnProperty('motorSpeed') )
                    jd.motorSpeed = jointJso.motorSpeed;            
                joint = world.CreateJoint(jd);
            }
            else if ( jointJso.type == "wheel" ) {
                //Make a fake wheel joint using a line joint and a distance joint.
                //Return the line joint because it has the linear motor controls.
                //Use ApplyTorque on the bodies to spin the wheel...
                
                var jd = new b2DistanceJointDef();
                loadJointCommonProperties(jd, jointJso, loadedBodies);
                jd.length = 0.0;
                if ( jointJso.hasOwnProperty('springDampingRatio') )
                    jd.dampingRatio = jointJso.springDampingRatio;
                if ( jointJso.hasOwnProperty('springFrequency') )
                    jd.frequencyHz = jointJso.springFrequency;
                world.CreateJoint(jd);
                
                jd = new b2LineJointDef();
                loadJointCommonProperties(jd, jointJso, loadedBodies);
                if ( jointJso.hasOwnProperty('localAxisA') )
                    jd.localAxisA.SetV( getVectorValue(jointJso.localAxisA) );
                    
                joint = world.CreateJoint(jd);
            }
            else {
                console.log("Unsupported joint type: " + jointJso.type);
                console.log(jointJso);
            }
            if ( joint && jointJso.name )
                joint.name = jointJso.name;
            return joint;
        }

        var makeClone = function(obj) {
          var newObj = (obj instanceof Array) ? [] : {};
          for (var i in obj) {
            if (obj[i] && typeof obj[i] == "object") 
              newObj[i] = makeClone(obj[i]);
            else
                newObj[i] = obj[i];
          }
          return newObj;
        };

        var loadImageFromRUBE = function(imageJso, world, loadedBodies) {
            var image = makeClone(imageJso);
            
            if ( image.hasOwnProperty('body') && image.body >= 0 )
                image.body = loadedBodies[image.body];//change index to the actual body
            else
                image.body = null;
                
            image.center = new b2Vec2();
            image.center.SetV( getVectorValue(imageJso.center) );
            
            return image;
        }

        //load the scene into an already existing world variable
        var loadSceneIntoWorld = function(worldJso) {
            
          console.log("RubePhysicsController loadSceneIntoWorld");

            var success = true;

            bodies = [];

            var loadedBodies = [];
            if ( worldJso.hasOwnProperty('body') ) {

                for (var i = 0; i < worldJso.body.length; i++) {
                    var bodyJso = worldJso.body[i];
                    var body = loadBodyFromRUBE(bodyJso, world);
                    if ( body )
                        loadedBodies.push( body );
                    else 
                        success = false;
                }
            }
            
            var loadedJoints = [];
            if ( worldJso.hasOwnProperty('joint') ) {
                for (var i = 0; i < worldJso.joint.length; i++) {
                    var jointJso = worldJso.joint[i];
                    var joint = loadJointFromRUBE(jointJso, world, loadedBodies);
                    if ( joint )
                        loadedJoints.push( joint );
                    else
                        success = false;
                }
            }
            
            var loadedImages = [];
            if ( worldJso.hasOwnProperty('image') ) {
                for (var i = 0; i < worldJso.image.length; i++) {
                    var imageJso = worldJso.image[i];
                    var image = loadImageFromRUBE(imageJso, world, loadedBodies);
                    if ( image )
                        loadedImages.push( image );
                    else
                        success = false;
                }        
                world.images = loadedImages;
            }

            bodies = loadedBodies;
            
            return success;
        }

        // not used... probably can delete...
        /*
        var loadWorldFromRUBE = function(worldJso) {
            var gravity = new b2Vec2(0,0);
            if ( worldJso.hasOwnProperty('gravity') && worldJso.gravity instanceof Object )
                gravity.SetV( worldJso.gravity );
            var world = new b2World( gravity );
            if ( ! loadSceneIntoWorld(worldJso) )
                return false;
            return world;
        }
        */

        var getNamedBodies = function(world, name) {
            var bodies = [];
            for (b = world.m_bodyList; b; b = b.m_next) {
                if ( b.name == name )
                    bodies.push(b);
            }
            return bodies;
        }

        var getNamedFixtures = function(world, name) {
            var fixtures = [];
            for (b = world.m_bodyList; b; b = b.m_next) {
                for (f = b.m_fixtureList; f; f = f.m_next) {
                    if ( f.name == name )
                        fixtures.push(f);
                }
            }
            return fixtures;
        }

        var getNamedJoints = function(world, name) {
            var joints = [];
            for (j = world.m_jointList; j; j = j.m_next) {
                if ( j.name == name )
                    joints.push(j);
            }
            return joints;
        };

        var update = function() {

            //console.log("RubePhysicsController / update");

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
                
                
                //var cameraFocusPoint = things[0].getCameraFocus();
                // cameraWorldContainer.x = cameraFocusPoint.x; 
                //cameraWorldContainer.y = cameraFocusPoint.y; 
                
                world.Step(TIMESTEP, 10, 10);
                updateMotorSpeed();

                fixedTimestepAccumulator -= STEP;
                world.ClearForces();
                
                world.DrawDebugData(); // will now clear any debug drawings before attempting to draw again 
                
                if(bodies.length > 30) {
                    bodiesToRemove.push(bodies[0]);
                    bodies.splice(0,1);
                }

            }
        };

        var updateMotorSpeed = function() {
            if ( wheelBodies.length < 1 )
                return;
            var maxSpeed = 20;
            var desiredSpeed = 0;
            if ( ( moveFlags & MOVE_LEFT) == MOVE_LEFT )
                desiredSpeed = maxSpeed;
            else if ( (moveFlags & MOVE_RIGHT) == MOVE_RIGHT )
                desiredSpeed = -maxSpeed;
            for (i = 0; i < wheelBodies.length; i++)
                wheelBodies[i].SetAngularVelocity(desiredSpeed);
        };

        var setMaxMotorTorque = function( maxTorque, targetJoint ) {
          
            
         }; 

        var trigger = function(event, keyName) {

          console.log("RubePhysicsController / trigger / %s: ", keyName); 

          switch( keyName ) {

            case "SPACE" :

              var targetJoint = getNamedJoints(world, "trebuchetArmJoint")[0];

              if ( targetJoint !== undefined)  {
                console.log("releasing trebuchet!")
                targetJoint.SetMotorSpeed(10000);
                targetJoint.SetMaxMotorTorque(100000);
              }
              
              break;
            case "LEFT" :
            case "RIGHT" :
              
              break;    
           }
        };

        return {
            getWorld: getWorld,
            update: update,
            trigger: trigger,
            setup: setup,
            loadSceneIntoWorld: loadSceneIntoWorld
        }

    };



    return RubePhysicsUtil; 

});









