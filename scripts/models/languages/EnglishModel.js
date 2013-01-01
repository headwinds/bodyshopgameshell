define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishModel = Backbone.Model.extend({

		defaults:  {
			langCode : 'en',
			game : {
				title: "Featured Game Demo: Manual Box2D Physics",
				description: "demonstrates new debug drawing methods that allows Easeljs to draw Box2DWeb physics",
				option_a: "play demo"
			},
			nav : {
				option_a: "home",
				option_b: "game",
				option_c: "about",
				option_d: "demos"
			},
			footer : {
				option_a: "developers",
				option_b: "artists",
				option_c: "half elf archer magic users",
				option_d: "contact"
			}
		}
	});

	return EnglishModel;
});