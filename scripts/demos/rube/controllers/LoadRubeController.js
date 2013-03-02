define([
    "jquery",
    "underscore",
    "backbone",
    "box2d"
    ], function($, _, Backbone) {
    
    /*
    Object.prototype.hasOwnProperty = function(property) {
        return typeof(this[property]) !== 'undefined'
    };
    */

    function LoadRubeController() {

        // Box2d vars
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

        function loadBodyFromRUBE(bodyJso, world) {

            if ( ! bodyJso.hasOwnProperty('type') ) {
                ////console.log("Body does not have a 'type' property");
                return null;
            }    
            
            var bd = new b2BodyDef();
            if ( bodyJso.type == 2 )
                bd.type = b2_dynamicBody;
            else if ( bodyJso.type == 1 )
                bd.type = b2_kinematicBody;
            if ( bodyJso.hasOwnProperty('angle') )
                bd.angle = bodyJso.angle;
            if ( bodyJso.hasOwnProperty('angularVelocity') )
                bd.angularVelocity = bodyJso.angularVelocity;
            if ( bodyJso.hasOwnProperty('active') )
                bd.awake = bodyJso.active;        
            if ( bodyJso.hasOwnProperty('fixedRotation') )
                bd.fixedRotation = bodyJso.fixedRotation;
            if ( bodyJso.hasOwnProperty('linearVelocity') && bodyJso.linearVelocity instanceof Object )
                bd.linearVelocity.SetV( bodyJso.linearVelocity );
            if ( bodyJso.hasOwnProperty('position') && bodyJso.position instanceof Object )
                bd.position.SetV( bodyJso.position );
            if ( bodyJso.hasOwnProperty('awake') )
                bd.awake = bodyJso.awake;
            else
                bd.awake = false;
            var body = world.CreateBody(bd);
            if ( bodyJso.hasOwnProperty('fixture') ) {
                for (k = 0; k < bodyJso['fixture'].length; k++) {
                    var fixtureJso = bodyJso['fixture'][k];
                    loadFixtureFromRUBE(body, fixtureJso);
                }
            }
            if ( bodyJso.hasOwnProperty('name') )
                body.name = bodyJso.name;
            return body;
        }

        function loadFixtureFromRUBE(body, fixtureJso) {    
            ////console.log(fixtureJso);
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
                //console.log("Could not find shape type for fixture");
            }
        }

        function getVectorValue(val) {
            if ( val instanceof Object )
                return val;
            else
                return { x:0, y:0 };
        }

        function loadJointCommonProperties(jd, jointJso, loadedBodies) {    
            jd.bodyA = loadedBodies[jointJso.bodyA];
            jd.bodyB = loadedBodies[jointJso.bodyB];
            jd.localAnchorA.SetV( getVectorValue(jointJso.anchorA) );
            jd.localAnchorB.SetV( getVectorValue(jointJso.anchorB) );
            if ( jointJso.collideConnected )
                jd.collideConnected = jointJso.collideConnected;
        }

        function loadJointFromRUBE(jointJso, world, loadedBodies)
        {
            if ( ! jointJso.hasOwnProperty('type') ) {
                //console.log("Joint does not have a 'type' property");
                return null;
            }    
            if ( jointJso.bodyA >= loadedBodies.length ) {
                //console.log("Index for bodyA is invalid: " + jointJso.bodyA );
                return null;
            }    
            if ( jointJso.bodyB >= loadedBodies.length ) {
                //console.log("Index for bodyB is invalid: " + jointJso.bodyB );
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
                //console.log("Unsupported joint type: " + jointJso.type);
                //console.log(jointJso);
            }
            if ( joint && jointJso.name )
                joint.name = jointJso.name;
            return joint;
        }

        function makeClone(obj) {
          var newObj = (obj instanceof Array) ? [] : {};
          for (var i in obj) {
            if (obj[i] && typeof obj[i] == "object") 
              newObj[i] = makeClone(obj[i]);
            else
                newObj[i] = obj[i];
          }
          return newObj;
        };

        function loadImageFromRUBE(imageJso, world, loadedBodies)
        {
            var image = makeClone(imageJso);
            
            if ( image.hasOwnProperty('body') && image.body >= 0 )
                image.body = loadedBodies[image.body];//change index to the actual body
            else
                image.body = null;
                
            image.center = new b2Vec2();
            image.center.SetV( getVectorValue(imageJso.center) );
            
            return image;
        }



        //mainly just a convenience for the testbed - uses global 'world' variable
        function loadSceneFromRUBE(worldJso, world) {
            return loadSceneIntoWorld(worldJso, world);
        }

        //load the scene into an already existing world variable
        function loadSceneIntoWorld(worldJso, world) {
            var success = true;

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
            
            return success;
        }

        //create a world variable and return it if loading succeeds
        function loadWorldFromRUBE(worldJso) {
            var gravity = new b2Vec2(0,0);
            if ( worldJso.hasOwnProperty('gravity') && worldJso.gravity instanceof Object )
                gravity.SetV( worldJso.gravity );
            var world = new b2World( gravity );
            if ( ! loadSceneIntoWorld(worldJso, world) )
                return false;
            return world;
        }

        function getNamedBodies(world, name) {
            var bodies = [];
            for (b = world.m_bodyList; b; b = b.m_next) {
                if ( b.name == name )
                    bodies.push(b);
            }

            //console.log(bodies, "LoadRubeController / getNamedBodies")

            return bodies;
        }

        function getNamedFixtures(world, name) {
            var fixtures = [];
            for (b = world.m_bodyList; b; b = b.m_next) {
                for (f = b.m_fixtureList; f; f = f.m_next) {
                    if ( f.name == name )
                        fixtures.push(f);
                }
            }
            return fixtures;
        }

        function getNamedJoints(world, name) {
            var joints = [];
            for (j = world.m_jointList; j; j = j.m_next) {
                if ( j.name == name )
                    joints.push(j);
            }
            return joints;
        }

        return {
            loadSceneFromRUBE : loadSceneFromRUBE,
            getNamedBodies : getNamedBodies
        }
    }

    return LoadRubeController;

});    

/*
//these need to be kept global for closure advanced optimization
window['loadSceneFromRUBE'] = loadSceneFromRUBE;
window['getNamedBodies'] = getNamedBodies;
window['getNamedFixtures'] = getNamedFixtures;
window['getNamedJoints'] = getNamedJoints;
*/








