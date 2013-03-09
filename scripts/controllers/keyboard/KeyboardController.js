define([
	"jquery",
	"underscore",
	"backbone"
	], function($, _, Backbone ) {

		var KeyboardController = function() { 

			var vent = _.extend({}, Backbone.Events);

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
				J:74,
				K:75,

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

					//console.log("KeyboardController onKeydown");

					var code = (event.keyCode ? event.keyCode : event.which);

			    	this._pressed[code] = true;
			    	var keyName = this.getKey(code);

			    	vent.trigger("customKeydown", keyName + "_PRESSED");
				},

				onKeyup: function(event) {

					//console.log("KeyboardController onKeyup");

					var code = (event.keyCode ? event.keyCode : event.which);
					var keyName = this.getKey(code);
					
					vent.trigger("customKeyup", keyName + "_RELEASED" );

					delete this._pressed[event.keyCode];
				}
			};
			
			$(window).keydown( function(event) {
				Key.onKeydown(event);
			});

			$(window).keyup( function(event) {
				Key.onKeyup(event);
			});

			return {
				vent : vent
			}


		};

	return KeyboardController;

});
