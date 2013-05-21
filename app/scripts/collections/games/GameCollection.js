define([
  'underscore',
  'backbone',
  'models/game/GameModel'
], function(_, Backbone, GameModel) {

	var GameCollection = Backbone.Collection.extend({

		model : GameModel, 

		initialize:function() {

			//var game0 = new GameModel(1, "toothbrush", "none", 5, "unknown", "common", false); 
		
		}

	});

	return new GameCollection;
});