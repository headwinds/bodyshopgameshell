define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishModel = Backbone.Model.extend({

		defaults:  {
			langCode : 'en',
			game : {
				title: "Your Game Name Here",
				description: "a game about whatever your game is about",
				option_a: "start new game",
				option_b: "continue game",
				option_c: "options",
				option_d: "credits"
			},
			nav : {
				option_a: "Home",
				option_b: "Game",
				option_c: "About",
				option_d: "Sketches"
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
			},
			footer : {
				option_a: "developers",
				option_b: "artists",
				option_c: "half-elf archer/magic-users",
				option_d: "contact"
			}
		}
	});

	return EnglishModel;
});