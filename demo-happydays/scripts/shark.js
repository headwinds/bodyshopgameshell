var MOVE_LEFT =     0x01;
var MOVE_RIGHT =    0x02;

var shark = function() {
    //constructor
    this.wheelBodies = [];
    this.truckBody = []; 
    this.moveFlags = 0;
}

shark.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 18.43;
    setViewCenterWorld( new b2Vec2( -0.665, 3.318), true );
}

shark.prototype.setup = function() {
    //set up the Box2D scene here - the world is already created

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
      url: "./shark.json",
      dataType: 'json',
      success: callback
    });


    
}

shark.prototype.step = function() {
    //move camera to follow
    if ( this.truckBody[0] ) {
        var pos = this.truckBody[0].GetPosition();
        var vel = this.truckBody[0].GetLinearVelocity();
        var futurePos = new b2Vec2( pos.x + 0.05 * vel.x, pos.y + 0.05 * vel.y );
        setViewCenterWorld( futurePos );
    }

    //this function will be called at the beginning of every time step
    this.updateMotorSpeed();
}

shark.prototype.updateMotorSpeed = function() {
    
    //console.log(this.wheelBodies);

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

shark.prototype.onKeyDown = function(canvas, evt) {
    
    //console.log(evt.keyCode );

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

shark.prototype.onKeyUp = function(canvas, evt) {    
    if ( evt.keyCode == 74 ) {//j
        this.moveFlags &= ~MOVE_LEFT;
        this.updateMotorSpeed();
    }
    else if ( evt.keyCode == 75 ) {//k
        this.moveFlags &= ~MOVE_RIGHT;
        this.updateMotorSpeed();
    }
}

shark.prototype.getComments = function(canvas, evt) {
    return "Testing loading and rendering of image coordinates. Try turning off the 'Shapes' checkbox below to hide the fixture lines.";
}
