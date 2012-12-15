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
				option_d: "Leaderboard"
			},
			goblin : {
				name: "Zoltan",
				title: "goblin",
				description: "they dark foul creatures of low repute"
			},
			orc : {
				name: "Clarg",
				title: "orc",
				description: "born in the bowels of mount doom"
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
			},
			episode0 : {
				title: "And they have a cavetroll!",
				description: "about the experiment here?",
				option_a: "war",
				option_b: "peace",
				edit: "edit"
			}
		}
	});

	return EnglishModel;
});