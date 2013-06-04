define([
    "jquery",
    "underscore",
    "backbone"
    ], function($, _, Backbone) {

    var RubeBlimpController = function() {   

        var vent = _.extend({}, Backbone.Events);

        var MOVE_LEFT =     0x01;
        var MOVE_RIGHT =    0x02;

        //var controller = demoController;
        var myBike; 

        var Bike = function() {
            //constructor
            this.wheelBodies = [];
            this.bikeBody = []; 
            this.moveFlags = 0;
        }

        Bike.prototype.setNiceViewCenter = function(world, loader) {

            var that = this;
            var startPos = {x: -3.4, y: 0.39};

            // dispatch the event...
            var resetPos = new Box2D.Common.Math.b2Vec2( startPos.x, startPos.y );
            var bReset = true;

            var payload = {resetPos: resetPos, bReset: bReset};

            var bikeBody = loader.getNamedBodies(world, "bikechassis")[0];

            bikeBody.SetPosition(startPos);

            vent.trigger("resetTruck", payload );
        }

        Bike.prototype.setup = function(world, loader ) {
            //set up the Box2D scene here - the world is already created

             var that = this;
            
            that.wheelBodies[0] = loader.getNamedBodies(world, "bikewheelrear")[0];
            that.wheelBodies[1] = loader.getNamedBodies(world, "bikewheelfront")[0];

            that.bikeBody[0] =  loader.getNamedBodies(world, "bikechassis")[0];

            myBike.setNiceViewCenter(world, loader);
        }

        Bike.prototype.getFuturePos = function() {
            //move camera to follow

            if ( this.bikeBody[0] ) {
                var pos = this.bikeBody[0].GetPosition();
                var vel = this.bikeBody[0].GetLinearVelocity();
                
                //var futurePos = controller.getb2Vec2( pos.x + 0.05 * vel.x, pos.y + 0.05 * vel.y );
                var futurePos = new Box2D.Common.Math.b2Vec2( pos.x + 0.05 * vel.x, pos.y + 0.05 * vel.y );

                this.updateMotorSpeed();

                return futurePos;
            }
        }

        Bike.prototype.updateMotorSpeed = function() {

            //console.log(this.wheelBodies, "RubeBlimpController updateMotorSpeed");

            if ( this.wheelBodies.length < 1 )
                return;

            var maxSpeed = 60;
            var desiredSpeed = 0;
            
            if ( (this.moveFlags & MOVE_LEFT) == MOVE_LEFT ) {
                   desiredSpeed = maxSpeed;
            } else if ( (this.moveFlags & MOVE_RIGHT) == MOVE_RIGHT ) {
                desiredSpeed = -maxSpeed;
            }

            //for (i = 0; i < this.wheelBodies.length; i++) {
              //  this.wheelBodies[i].SetAngularVelocity(desiredSpeed);
            //}

            this.wheelBodies[0].SetAngularVelocity(desiredSpeed);
            this.wheelBodies[1].SetAngularVelocity(desiredSpeed);

        }


        Bike.prototype.startDrivingLeft = function()
        {
            this.moveFlags |= MOVE_LEFT;
            this.updateMotorSpeed();
        } 

        Bike.prototype.startDrivingRight = function()
        {
            this.moveFlags |= MOVE_RIGHT;
            this.updateMotorSpeed();
        } 

        Bike.prototype.stopDrivingLeft = function()
        {
            this.moveFlags &= ~MOVE_LEFT;
            this.updateMotorSpeed();
        } 

        Bike.prototype.stopDrivingRight = function()
        {
            this.moveFlags &= ~MOVE_RIGHT;
            this.updateMotorSpeed();
        } 

        Bike.prototype.onKeyUp = function(canvas, evt) {    
            
            if ( evt.keyCode == 74 ) {//j
                this.moveFlags &= ~MOVE_LEFT;
                this.updateMotorSpeed();
            }
            else if ( evt.keyCode == 75 ) {//k
                this.moveFlags &= ~MOVE_RIGHT;
                this.updateMotorSpeed();
            }
        }

        function setup(world, loader ) {
            myBike = new Bike(); 
            myBike.setup(world, loader);
        }

        function getFuturePos() {
            
            if ( myBike !==  undefined) return myBike.getFuturePos();
        }

        function startDrivingLeft() {
            myBike.startDrivingLeft();
        }

        function startDrivingRight() {
            myBike.startDrivingRight();
        }

        function stopDrivingLeft() {
            myBike.stopDrivingLeft();
        }   

        function stopDrivingRight() {
            myBike.stopDrivingRight();
        }

        return {
            setup : setup,
            getFuturePos : getFuturePos,
            startDrivingLeft : startDrivingLeft,
            startDrivingRight : startDrivingRight,
            stopDrivingLeft : stopDrivingLeft,
            stopDrivingRight : stopDrivingRight,
            vent: vent
        }
    }

    return RubeBlimpController;

});


