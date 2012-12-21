define([
	'jquery',
	'underscore',
	'backbone',
	'controllers/game/GameViewController'
	], function($,_,Backbone, GameViewController) {

	var GameView = Backbone.View.extend({

		controller: {},
		el: $("#page"),
	
		initialize: function(options){
			this.collection = options.collection;
			this.model = options.model; 

			//var createjs = //$(window).createjs;
			//console.log(this.createjs, "GameView / initialize / easel");

			this.loadTemplate( this.model.get('template') ); 
		},

		render: function(){
			var that = this;

			that.controller = new GameViewController( that.model );

			that.setupListeners(); 

		},

		setupListeners: function() {

			var that = this;

			$("#play").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				that.controller.play(); 

			});

			$("#stop").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				that.controller.stop(); 
				
			});

			$("#step-forward").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 
				
				that.controller.stepForward(); 
			});

			$("#step-backward").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				//that.controller.stepBackward(); 

				var cssObj = { left : '200px', opacity: 1}

				$("#challenge").animate(cssObj, "slow");
				
			});

			$("#toggle-debug").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				that.controller.toggleDebug(); 
				
			});

			$("#toggle-skins").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				that.controller.toggleSkins(); 
				
			});

			$("#close-challenge").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				var cssObj = { left : '700px', opacity: 0}

				$("#challenge").animate(cssObj, "fast");
				
			});

			$("#pan-left").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				that.controller.pan("left");
				
			});

			$("#pan-right").bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation(); 

				that.controller.pan("right");
				
			});

			// need to hook up to tweenjs later
			$("#pan-left").hide();
			$("#pan-right").hide();
		}, 

		loadTemplate: function( templateStr ) {
			console.log("GameView / loadTemplate / templateStr: " + templateStr)

			var that = this;
			
			switch(templateStr) {
				case "mobile":
					require(['text!templates/game/mobileTemplate.html'], function(mobileTemplate) {
						var mobileData = {};
						var mobileCompiledTemplate = _.template( mobileTemplate, mobileData );
						$("#page").html( mobileCompiledTemplate );

						that.render(); 
					});
				break;
				default: 
					require(['text!templates/game/desktopTemplate.html'], function(desktopTemplate) {
						var desktopData = {};
						var desktopCompiledTemplate = _.template( desktopTemplate, desktopData );
						$("#page").html( desktopCompiledTemplate );

						that.render(); 
					});
				break;
			}

		},

	
	});

  return GameView;
		
}); 
