define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishRubeModel = Backbone.Model.extend({

		defaults:  {
			langCode : "en",
			instructions : "<p>CONTROLS: LEFT RIGHT ARROW KEYS TO DRIVE THE BIKE</p>",
			demo : {
				title: "R.U.B.E. Physics Demo",
				description: "a demo about how to display box2D bodies within EaselJS that were created within the R.U.B.E. physics editor",
				hacker: "brandon flowers",
				site: "http://www.headwinds.net"
			}
		}
	});

	return EnglishRubeModel;
});