define([
	'underscore', 
	'backbone'
], function(_, Backbone) {
	
	var DemoModel = Backbone.Model.extend({

		defaults: {
			title: 'minis tirith',
			description: '',
			success: '',
			fail: '',
			sentiment:'good',
			timeBreakdown:'1 week - 2hrs a day',
			hours: '14',
			awesome: 0,
			thumbPath: 'demos/ministirith/ministirith.png',
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