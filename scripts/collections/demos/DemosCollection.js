define([
  'underscore',
  'backbone',
  'models/demo/DemoModel'
], function(_, Backbone, DemoModel) {

	var DemosCollection = Backbone.Collection.extend({

		model : DemoModel, 

		initialize:function() {

			var demo0 = new DemoModel(); 
			var demo1 = new DemoModel();
			var demo2 = new DemoModel();
			
		}

	});

	return new DemosCollection;
});