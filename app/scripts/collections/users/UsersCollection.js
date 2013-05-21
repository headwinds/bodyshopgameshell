define([
  'jquery',
  'underscore',
  'backbone',
  'models/user/UserModel'
], function($, _, Backbone, UserModel) {

	var UsersCollection = Backbone.Collection.extend({

		model : UserModel, 

		initialize:function() {

			var mission0 = new UserModel(); 
			var mission1 = new UserModel();
			var mission2 = new UserModel(); 

			console.log("UserModel / init / name: " + mission0.get('name') );

			this.add([mission0, mission1, mission2] );
		},

		getMission: function(nameStr) {
      		return this.filter(function(item){ return item.get(nameStr); });
    	}

	});

	return UsersCollection;
});