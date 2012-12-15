define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var NavModel = Backbone.Model.extend({

		defaults: {
			content: {}
		},

		intialize:function( options ){
			console.log("NavModel / intialize");
			this.set( 'content', options.model.get('content') );
		},

		update: function() {
			
		}
	});

	return NavModel;
});