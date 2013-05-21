define([
	'underscore', 
	'backbone',
	'collections/missions/MissionsCollection'
], function(_, Backbone, MissionCollection) {
	
	var EpisodeModel = Backbone.Model.extend({

		defaults: {
			episodeID : 0,
			missions: {},
			content: {},
			language: 'en',
			dateCreated: new Date(),
			dateUpdated: new Date(),
			version: 0
		},

		intialize:function( userID, languageCode, episodeContent ){
			console.log("EpisodeModel / intialize");

			this.userID = userID;
			this.language = languageCode;
			this.content = episodeContent;

			this.missions = this.getMissions();


		},

		getMissions: function() {

			var that = this;

			var options = {episodeID: that.episodeID};
			var missionCollection = MissionsCollection(options);

			return missionCollection;
		}



	});

	return EpisodeModel;
});