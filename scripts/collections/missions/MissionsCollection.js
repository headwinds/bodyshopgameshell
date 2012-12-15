define([
  'jquery',
  'underscore',
  'backbone',
  'models/missions/MissionModel'
], function($, _, Backbone, MissionModel) {

	var MissionsCollection = Backbone.Collection.extend({

		defaults: {
			episodeID: 0 
		},

		model : MissionModel, 

		initialize:function() {

			var mission0 = new MissionModel("mission 0",  5, 1); 
			var mission1 = new MissionModel("mission 1",  5, 1);
			var mission2 = new MissionModel("mission 2",  5, 1); 
		},

		getMission: function(nameStr) {
      		return this.filter(function(item){ return item.get(nameStr); });
    	}

	});

	return MissionsCollection;
});