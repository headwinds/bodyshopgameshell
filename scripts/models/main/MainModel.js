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

			//that.on('change:currentState', that.onStateChangeHandler);

			that.bind("languageChange", this.onLanguageReadyHandler, this);
			that.langCode = options.langCode; 

			switch(this.langCode) {
				case "fr":
					require(['models/languages/FrenchModel'], function(FrenchModel) {
					var frenchModel = new FrenchModel();
					that.set('content', frenchModel);
					});
				break;
				default: 
					require(['models/languages/EnglishModel'], function(EnglishModel) {
					var englishModel = new EnglishModel();
					
					that.set('content', englishModel);
					that.trigger("languageChange", {info:"language changed!"});
				});
				break;
			}

		},

		onStateChangeHandler:function(e) {
			var that = this;
			console.log("MainModel / onStateChangeHandler");
		},

		onLanguageReadyHandler: function(e) {
			var that = this;
			console.log("MainModel / onLanguageReadyHandler");
		},

		onStateChange: function(e) {
			console.log("MainModel / onStateChange");
		}

	});

	return MainModel;
})