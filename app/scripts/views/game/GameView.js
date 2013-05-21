define([
	'jquery',
	'underscore',
	'backbone',
	'controllers/game/GameViewController',
	'demos/manual/controllers/ManualDemoViewController',
	//'demos/rube/controllers/RubeDemoViewController',
	'demos/rube/controllers/RubeMainController',
	'demos/ministirith/controllers/MinisTirithDemoViewController',
	'models/languages/EnglishModel'
	], function($,
				_,
				Backbone, 
				GameViewController, 
				ManualDemoViewController, 
				//RubeDemoViewController,
				RubeMainController,
				MinisTirithDemoViewController,
				EnglishModel) {

	var GameView = Backbone.View.extend({

		events: {
			"click #play" 				: "onPlayClickHandler",
			"click #stop" 				: "onStopClickHandler",
			"click #step-forward" 		: "onStepForwardClickHandler",
			"click #step-backward" 		: "onStepBackwardClickHandler",
			"click #toggle-debug" 		: "onToggleDebugClickHandler",
			"click #toggle-skins" 		: "onToggleSkinsClickHandler",
			"click #close-challenge" 	: "onCloseChallengeClickHandler",
			"click #pan-left" 			: "onPanLeftClickHandler",
			"click #pan-right" 			: "onPanRightClickHandler"
		},

		controller: {},
		el: $("#page"),
	
		initialize: function(options){
			this.collection = options.collection;
			this.model = options.model; 

			this.loadTemplate( this.model.get('template') ); 

			// need to hook up to tweenjs later
			$("#pan-left").hide();
			$("#pan-right").hide();
		},

		render: function() {
			var that = this;

			var gameID = that.model.get('gameID');

			console.log("GameView render %s %c", gameID, "{color:#99000}" );

			switch(gameID) {
				case "manual" :
				that.showControls();
				that.controller = new ManualDemoViewController( that.model );
				break;
				case "rube" :
				that.hideControls();
				that.controller = new RubeMainController( that.model );
				break;
				case "ministirith" :
				that.controller = new MinisTirithDemoViewController( that.model );
				break;
			};
		},

		loadTemplate: function( templateStr ) {
			console.log("GameView / loadTemplate / templateStr: " + templateStr)

			var that = this;

			var lang = new EnglishModel().get('game');
			
			switch(templateStr) {
				case "mobile":
					require(['text!templates/game/mobileTemplate.html'], function(mobileTemplate) {
						var mobileData = {data: lang};
						var mobileCompiledTemplate = _.template( mobileTemplate, mobileData );
						$("#page").html( mobileCompiledTemplate );

						that.render(); 
					});
				break;
				default: 
					require(['text!templates/game/desktopTemplate.html'], function(desktopTemplate) {
						var desktopData = {data: lang};
						var desktopCompiledTemplate = _.template( desktopTemplate, desktopData );
						$("#page").html( desktopCompiledTemplate );

						that.render(); 
					});
				break;
			}

		},

		hideControls: function() {
			$(".game-controls").hide();
			$("#challenge").hide();
		},

		showControls: function(){
			$(".game-controls").show();
			$("#challenge").show();
		},

		onPlayClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.play(); 
		},

		onStopClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.stop(); 
		},

		onStepForwardClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.stepForward(); 
		},

		onStepBackwardClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			
			var cssObj = { left : '200px', opacity: 1}
			$("#challenge").animate(cssObj, "slow");
		},

		onToggleDebugClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.toggleDebug(); 
		},

		onToggleSkinsClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.toggleSkins(); 
		},

		onCloseChallengeClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			var cssObj = { left : '700px', opacity: 0}
			$("#challenge").animate(cssObj, "fast");
		},

		onPanLeftClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.pan("left"); 
		},

		onPanRightClickHandler: function(e) {
			e.preventDefault();
			e.stopPropagation(); 

			var that = this;
			that.controller.pan("right"); 
		}
	
	});

  return GameView;
		
}); 
