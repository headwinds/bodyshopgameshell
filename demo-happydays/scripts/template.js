
var testbed_template = function() {
    //constructor
}

testbed_template.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 32;
    setViewCenterWorld( new b2Vec2(0,0), true );
}

testbed_template.prototype.setup = function() {
    //set up the Box2D scene here - the world is already created
}

testbed_template.prototype.step = function() {
    //this function will be called at the beginning of every time step
}

testbed_template.prototype.onKeyDown = function(canvas, evt) {
    if ( evt.keyCode == 65 ) { // 'a'
        //do something when the 'a' key is pressed
    }
}

testbed_template.prototype.onKeyUp = function(canvas, evt) {
    if ( evt.keyCode == 65 ) { // 'a'
        //do something when the 'a' key is released
    }
}
