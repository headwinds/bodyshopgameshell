define([ 
	'underscore', 
	'backbone'
], function(_, Backbone) {
	
	var ItemModel = Backbone.Model.extend({

		defaults: {
			itemID : 0,
			name : "unknown",
			description: "none",
			price: 100,
			owner : "unknown",
			rarity: "common",
			onSale : false
		},

		initialize: function() {}

	});

	return ItemModel;

});