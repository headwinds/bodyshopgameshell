define([
	'underscore', 
	'backbone'
], function(_, Backbone ) {
	
	var EnglishModel = Backbone.Model.extend({

		defaults:  {
			episode0 : {
				title: "S'occuper de la Coupe?",
				description: "Au loin, dans le monde éloigné de Kytel, vivent deux tribus séparées de chaque côté par une vaste mer. La tribu occidentale boit du café tandis que la tribu des boissons Pâques thé. Vous arrivez à déterminer le sort de ces tribus en s'engageant dans le commerce international en montgolfière à travers la planète, mais d'abord vous devez prêter serment d'allégeance à la tribu soit. Que buvez-vous?",
				option_a: "thé",
				option_b: "café",
				edit: "éditer"
			},
			langCode : 'fr'
			
		}
	});

	return EnglishModel;
});