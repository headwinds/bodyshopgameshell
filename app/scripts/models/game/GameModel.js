define([
	'underscore', 
	'backbone',
	'collections/episodes/EpisodeCollection'
], function(_, Backbone, EpisodeCollection) {
	
	var GameModel = Backbone.Model.extend({

		defaults: {
			gameID: "ministirith",
			bDemo: true,
			jsonPath: "./scripts/demos/ministirith/json/minisTirithScene.json",
			date_created: new Date(),
			date_updated: new Date(),
			template: "desktop",
			version:0
		},

		intialize:function(){

		}

	});

	return GameModel;
});