define([
  'underscore',
  'backbone',
  'models/main/MainModel'
], function(_, Backbone, MainModel) {

	var ItemCollection = Backbone.Collection.extend({

		model : MainModel, 

		initialize:function( options ) {

			var content = options.content.get('game');

			var option0 = new MainModel();
			var option1 = new MainModel();
			var option2 = new MainModel();
			var option3 = new MainModel();

			option0.set('label', content.option_a);
			option1.set('label', content.option_b);
			option2.set('label', content.option_c);
			option3.set('label', content.option_d);

		},

		onSale: function() {
			return this.filter(function(item){ return item.get('onSale'); });
		}

	});

	return new ItemCollection;
});