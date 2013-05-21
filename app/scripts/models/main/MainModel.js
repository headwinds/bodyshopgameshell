define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	
	var MainModel = Backbone.Model.extend({

		url: 'game',

		defaults: {
			mainOptionACount:0,
			mainOptionBCount:0,
			content: {},
			langCode: "en",
			currentState: "main",
			states: ["main", "start game", "continue game", "options", "credits"]
		},

		initialize: function(options) {

			var that = this;

			that.langCode = options.langCode; 

			that.bind("change:content", this.onLanguageReadyHandler, this);

			switch(this.langCode) {
				case "fr":
					require(['models/languages/FrenchModel'], function(FrenchModel) {
						var frenchModel = new FrenchModel();

						that.set('langCode', 'fr');
						that.set('content', frenchModel);
					});
				break;
				default: 
					require(['models/languages/EnglishModel'], function(EnglishModel) {
						var englishModel = new EnglishModel();
						
						that.set('langCode', 'en');
						that.set('content', englishModel);
					});
				break;
			}

		},

		onStateChangeHandler:function(e) {
			var that = this;
			console.log("MainModel / onStateChangeHandler");
		},

		onStateChange: function(e) {
			console.log("MainModel / onStateChange");
		}

	});

	return MainModel;
})