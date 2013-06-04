define([
  'underscore',
  'backbone',
  'models/demo/DemoModel'
], function(_, Backbone, DemoModel) {

	var DemosCollection = Backbone.Collection.extend({

		model : DemoModel, 

		initialize:function() {

		}
	});

	return DemosCollection;
});