define([
	'underscore', 
	'backbone',
	'collections/episodes/EpisodeCollection'
], function(_, Backbone, EpisodeCollection) {
	
	var GameModel = Backbone.Model.extend({

		defaults: {
			mission: {},
			date_created: new Date(),
			date_updated: new Date(),
			template: "desktop",
			version:0
		},

		intialize:function(){

			this.mission = this.getMission();
		},

		getMission:function(){

			console.log("EpisodeCollection / getMission / which one am I on?!")

			// have the episodes been created?

			// if not create them... 

			var episodeCollection = new EpisodeCollection();

			// get mission 0 


			//return new EpisodeCollection(); 

			// ... if so grab them
			return {};
		}

	});

	return GameModel;
});