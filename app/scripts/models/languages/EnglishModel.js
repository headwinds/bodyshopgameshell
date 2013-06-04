define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishModel = Backbone.Model.extend({

		defaults:  {
			langCode : 'en',
			main : {
				title: "Featured: Manual",
				description: "demonstrates new debug drawing methods that allows Easeljs to draw Box2DWeb physics",
				imagePath: "imgs/demos/manual/manual.png",
				option_a: "play demo"
			},
			game : {
				instructions : "<p>CONTROLS: LEFT AND RIGHT ARROW KEYS TO DRIVE - SPACE TO FIRE!</p>",
				challenge: "<p>Like the indie hit Braid or Brett Victor&apos;s <a href='http://www.youtube.com/watch?v=PUv66718DII' target='_blank'>Inventing on Principle talk</a> the ability to control time is a cool game mechanic; something that many of us wish we could do in real life.</p><p>Unfortunately, I haven't been able to discover if Box2D supports reverse time control yet. While you can step forward, it doesn't appear that you can step backwards to review past movements and collisions. </p><p> In theory, I believe one control rewind time by keeping track of all the states of a previous step. For instance, you save 10 steps, you should be able to step back 10 times. Perhaps, using the R.U.B.E. bson history...</p><p>If you know how to do this, please fork this project (or create your own project) and take a crack at it! </p><p><a href='#' id='challenge-close'>close</a></p>",
				labels : { play: "play", 
						   stop: "stop",
						   stepForward : "step forward",
						   stepBackward: "step backward",
						   toggleDebug: "toggleDebug",
						   toggleSkins: "toggleSkins",
						   panLeft: "panLeft",
						   panRight: "panRight",
						   close: "close"}
			},
			nav : {
				option_a: "home",
				option_b: "about",
				option_c: "demo",
				option_d: "gallery"
			},
			footer : {
				fork_text: "fork me on github",
				fork_path: "https://github.com/headwinds/bodyshopgameshell"
			}
		}
	});

	return EnglishModel;
});