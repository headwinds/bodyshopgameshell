define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishMinisTirithModel = Backbone.Model.extend({

		defaults:  {
			langCode : "en",
			instructions : "<p>CONTROLS: PRESS SPACE TO LAUNCH THE CANNONBALL <br> LEFT RIGHT ARROW KEYS TO DRIVE </p>",
			demo : {
				title: "Minis Tirith Physics Demo",
				description: "a demo about how to put together box2D bodies with the R.U.B.E. physics editor",
				hacker: "brandon flowers",
				site: "http://www.headwinds.net"
			}
		}
	});

	return EnglishMinisTirithModel;
});