define([
	"jquery",
	"underscore",
	"backbone"
	], function($, _, Backbone) {

		var Controller = function() { 


		return {
			trigger : trigger,
			bind : bind
		}

	};

	return Controller;
}