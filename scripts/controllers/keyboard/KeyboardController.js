define([
	"jquery",
	"underscore",
	"backbone"
	], function($, _, Backbone) {

		var KeyboardController = function() { 

			console.log("KeyboardController / listening...")

			var Key = {
				_pressed: {},

				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				DOWN: 40,
				SPACE: 32,
				SHIFT: 16,
				CTRL: 17,
				CAM_LEFT: 190,
				CAM_RIGHT: 188,
				A: 65,
				S: 83,
				D: 68,
				DB_1: 49,
				DB_2: 50,
				DB_3: 51,
				DB_4: 52,
				DB_5: 53,
				DB_6: 54,
				DB_7: 55,
				DB_8: 56,
				DB_9: 57,

				isDown: function(keyCode) {
					return this._pressed[keyCode];
				},

				getKey : function(value){

				var keyname = "not mapped / code: " + value;

				for(var key in this ){
				    if(this[key] == value){

				    keyname = key;

				      return keyname;
				    }
				  }

				  return keyname;
				},

				onKeydown: function(event) {

					var code = (event.keyCode ? event.keyCode : event.which);

			    	this._pressed[code] = true;
			    	console.log("is down: " + code);

			    	var keyName = this.getKey(code);

			    	$(window).trigger("customKeydown", keyName );
				},

				onKeyup: function(event) {
					delete this._pressed[event.keyCode];
				}
			};
			
			$(window).keydown( function(event) {
				Key.onKeydown(event);
			});

			$(window).keyup( function(event) {
				Key.onKeyup(event);
			});

			var bind = function( event, callback ) {
				
				$(window).bind("customKeydown", function(event, keyName) {
					console.log(keyName, "KeyboardController ");

					keyName = typeof keyName !== 'defined' ? keyName : "no key pressed";

					callback(event, keyName); 
				});

			};

			return {
				bind: bind
			}


		};

	return KeyboardController;

});
