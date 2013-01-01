define([
	'underscore', 
	'backbone',
	'collections/episodes/EpisodeCollection'
], function(_, Backbone, EpisodeCollection) {
	
	var GameModel = Backbone.Model.extend({

		defaults: {
			gameID: "rube",
			bDemo: true,
			jsonPath: "./scripts/demos/rube/json/image_test-min.json",
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