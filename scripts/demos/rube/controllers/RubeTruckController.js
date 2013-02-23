define([
    "jquery",
    "underscore",
    "backbone"
    ], function($, _, Backbone) {

    var RubeTruckController = function( demoController ) {   

        var MOVE_LEFT =     0x01;
        var MOVE_RIGHT =    0x02;

        var controller = demoController;
        var myTruck; 

        var Truck = function() {
            //constructor
            this.wheelBodies = [];
            this.truckBody = []; 
            this.moveFlags = 0;
        }

        Truck.prototype.setNiceViewCenter = function() {
            //called once when the user changes to this test from another test
            PTM = 18.43;
            controller.setViewCenterWorld( new b2Vec2( -0.665, 3.318), true );
        }

        Truck.prototype.setup = function(world, loader ) {
            //set up the Box2D scene here - the world is already created

             console.log(loader, "######## RubeTruckController / Truck.setup ############");

             var that = this;
            
            that.wheelBodies[0] = loader.getNamedBodies(world, "truckwheel-front")[0];
            that.wheelBodies[1] = loader.getNamedBodies(world, "truckwheel-back")[0];

            that.truckBody[0] =  loader.getNamedBodies(world, "truckshell")[0];

             /*
             var tmp = this;
            
             var callback = function(jso) {
               
                if ( loadSceneFromRUBE( jso ) ) {
                    console.log("RUBE scene loaded successfully.");
                    
                    tmp.wheelBodies[0] = getNamedBodies(world, "truckwheel-front")[0];
                    tmp.wheelBodies[1] = getNamedBodies(world, "truckwheel-back")[0];

                    tmp.truckBody[0] =  getNamedBodies(world, "truckshell")[0];
                    doAfterLoading();
                } else {
                    console.log("Failed to load RUBE scene");
                }

            }

            $.ajax({
              url: "json/Truck.json",
              dataType: 'json',
              success: callback
            });

            */

        }

        Truck.prototype.getFuturePos = function() {
            //move camera to follow

            if ( this.truckBody[0] ) {
                var pos = this.truckBody[0].GetPosition();
                var vel = this.truckBody[0].GetLinearVelocity();
                
                //var futurePos = controller.getb2Vec2( pos.x + 0.05 * vel.x, pos.y + 0.05 * vel.y );
                var futurePos = new Box2D.Common.Math.b2Vec2( pos.x + 0.05 * vel.x, pos.y + 0.05 * vel.y );

                this.updateMotorSpeed();

                return futurePos;
            }
        }

        Truck.prototype.updateMotorSpeed = function() {

            if ( this.wheelBodies.length < 1 )
                return;

            var maxSpeed = 20;
            var desiredSpeed = 0;
            if ( (this.moveFlags & MOVE_LEFT) == MOVE_LEFT )
                desiredSpeed = maxSpeed;
            else if ( (this.moveFlags & MOVE_RIGHT) == MOVE_RIGHT )
                desiredSpeed = -maxSpeed;
            for (i = 0; i < this.wheelBodies.length; i++)
                this.wheelBodies[i].SetAngularVelocity(desiredSpeed);
        }

        Truck.prototype.onKeyDown = function(canvas, evt) {
            
            console.log("RubeTruckController / evt.keyCode ");

            if ( evt.keyCode == 74 ) {//j
                this.moveFlags |= MOVE_LEFT;
                this.updateMotorSpeed();

            }
            else if ( evt.keyCode == 75 ) {//k
                this.moveFlags |= MOVE_RIGHT;
                this.updateMotorSpeed();

            }

            /* why does the browser move?!
            if ( evt.keyCode == 37 ) {// RIGHT
                this.moveFlags |= MOVE_LEFT;
                this.updateMotorSpeed();

            }
            else if ( evt.keyCode == 39 ) {//LEFT
                this.moveFlags |= MOVE_RIGHT;
                this.updateMotorSpeed();

            }
            */
        }

        Truck.prototype.startDrivingLeft = function()
        {
            this.moveFlags |= MOVE_LEFT;
            this.updateMotorSpeed();
        } 

        Truck.prototype.startDrivingRight = function()
        {
            this.moveFlags |= MOVE_RIGHT;
            this.updateMotorSpeed();
        } 

        Truck.prototype.stopDrivingLeft = function()
        {
            this.moveFlags &= ~MOVE_LEFT;
            this.updateMotorSpeed();
        } 

        Truck.prototype.stopDrivingRight = function()
        {
            this.moveFlags &= ~MOVE_RIGHT;
            this.updateMotorSpeed();
        } 


        Truck.prototype.onKeyUp = function(canvas, evt) {    
            
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
            myTruck = new Truck(); 
            myTruck.setup(world, loader);
        }

        function getFuturePos() {
            
            if ( myTruck !==  undefined) return myTruck.getFuturePos();
        }

        function startDrivingLeft() {
            myTruck.startDrivingLeft();
        }

        function startDrivingRight() {
            myTruck.startDrivingRight();
        }

        function stopDrivingLeft() {
            myTruck.stopDrivingLeft();
        }   

        function stopDrivingRight() {
            myTruck.stopDrivingRight();
        }

        return {
            setup : setup,
            getFuturePos : getFuturePos,
            startDrivingLeft : startDrivingLeft,
            startDrivingRight : startDrivingRight,
            stopDrivingLeft : stopDrivingLeft,
            stopDrivingRight : stopDrivingRight
        }
    }

    return RubeTruckController;

});


