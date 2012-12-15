define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
  var MissionModel = Backbone.Model.extend({
    defaults: {
      name: "mission name",
      score: 100,
      difficulty: 0 
    },

    initialize: function(){
    }

  });

  return MissionModel;
});