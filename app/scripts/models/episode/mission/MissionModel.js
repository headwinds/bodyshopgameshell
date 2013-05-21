define([
	'underscore', 
	'backbone',
	'langauges/en/en'
], function(_, Backbone, en) {
	
	var MissionModel = Backbone.Model.extend({

		defaults: {
			content: en.episode0.mission0,
			dateCreated: new Date(),
			dateUpdated: new Date(),
			version: 0
		}

	});

	return MissionModel;
});