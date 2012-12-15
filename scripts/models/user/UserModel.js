define( [
	'underscore',
	'backbone',
	'collections/items/ItemCollection'
	], function(_, Backbone, ItemCollection) {

	var UserModel = Backbone.Model.extend({

		defaults: {
			userID : "unknown",
			name : "unknown",
			paid: false,
			social: "facebook",
			gameID : "unknown"
		},

		initialize:function() {

		},	

		addCredits: function(creditsAdded) {
			this.credits + creditsAdded;
		},

		subtractCredits: function(creditsSubtracted){
			this.credits - creditsSubtracted;
		} 

	});

	return UserModel;

});