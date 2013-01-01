define([
	'underscore', 
	'backbone'
], function(_, Backbone) {
	
	var DemoModel = Backbone.Model.extend({

		defaults: {
			demoInfo: {},
			date_created: new Date(),
			date_updated: new Date(),
			template: "desktop",
			version:0
		},

		intialize:function(){

		},

	});

	return DemoModel;
});