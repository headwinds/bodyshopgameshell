define([
  'underscore',
  'backbone',
  'models/items/ItemModel'
], function(_, Backbone, ItemModel) {

	var ItemCollection = Backbone.Collection.extend({

		model : ItemModel, 

		initialize:function() {

			var item1 = new ItemModel(1, "toothbrush", "none", 5, "unknown", "common", false); 
			var item2 = new ItemModel(2, "balloon", "none", 5, "unknown", "common", false);
			var item3 = new ItemModel(3, "hand grenade", "none", 500, "unknown", "rare", false);
			var item4 = new ItemModel(4, "notebook", "none", 25, "unknown", "common", false);
			var item5 = new ItemModel(5, "pen", "none", 5, "unknown", "common", false);
			var item6 = new ItemModel(6, "champagne", "none", 50, "unknown", "uncommon", false);
		},

		onSale: function() {
      		return this.filter(function(item){ return item.get('onSale'); });
    	}

	});

	return new ItemCollection;
});