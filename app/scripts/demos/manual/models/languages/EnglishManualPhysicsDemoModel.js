define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishManualPhysicsDemoModel = Backbone.Model.extend({

		defaults:  {
			langCode : "en",
			instructions : "<p>CONTROLS: PRESS SPACE TO LAUNCH THE CANNONBALL <br> LEFT RIGHT ARROW KEYS TO DRIVE </p>",
			demo : {
				title: "Manual Physics Demo",
				description: "a demo about how to put together box2D bodies manually",
				hacker: "brandon flowers",
				site: "http://www.headwinds.net"
			},
			goblin : {
				name: "Zoltan",
				title: "goblin",
				description: "these dark, foul creatures of low repute and a hankering for fish pie"
			},
			orc : {
				name: "Clarg",
				title: "orc",
				description: "born with full armor on in the bowels of mount doom; faces even their mothers couldn't love"
			},
			cavetroll : {
				name: "Uggg",
				description: "extremely bad beasts of little words in fact none"
			}
		}
	});

	return EnglishManualPhysicsDemoModel;
});