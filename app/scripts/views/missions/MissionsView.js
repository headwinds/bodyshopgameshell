
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/missions/MissionsCollection',
  'text!templates/missions/missionsTemplate.html'
], function($, _, Backbone, MissionsCollection, missionsTemplate){
  
  var MissionsView = Backbone.View.extend({
    
    el: $("#page"),
    initialize: function(){
      
      var missionsCollection = new MissionsCollection();

      this.collection = missionsCollection;
      this.collection.bind("add", this.bindAddHandler);
      this.collection = missionsCollection.add({ name: "trolls", score: 20, difficulty: 0});
    },

    bindAddHandler: function( model ){
      console.log("MissionsView / bindAddHandler / mission added: %s", model.get("name") );
    },

    render: function(){
       console.log("MissionsView / render");
      
      var data = {
        missions: this.collection.models,
        _: _
      };
      var compiledTemplate = _.template( missionsTemplate, data );
      $("#page").html( compiledTemplate );
      
    }
  });

  return MissionsView;
});