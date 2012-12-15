define([
  'underscore',
  'backbone',
  'models/episode/EpisodeModel'
], function(_, Backbone, EpisodeModel) {

	var EpisodeCollection = Backbone.Collection.extend({

		model : EpisodeModel, 

		initialize:function() {

			var episode0 = new EpisodeModel(); 
			var episode1 = new EpisodeModel();
			var episode2 = new EpisodeModel();
			
		}

	});

	return new EpisodeCollection;
});