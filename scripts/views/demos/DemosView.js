
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/demos/DemosCollection',
  'text!templates/demos/demosTemplate.html'
], function($, _, Backbone, DemosCollection, demosTemplate){
  
  var DemosView = Backbone.View.extend({
    
    initialize: function(){
      
      //var demosCollection = new DemosCollection();

      //this.collection = demosCollection;
      //this.collection.bind("add", this.bindAddHandler);
      //this.collection = demosCollection.add( demoModel );

      this.el = $("#page");

    },

    bindAddHandler: function( model ){
      console.log("DemosView / bindAddHandler / mission added: %s", model.get("name") );
    },

    render: function(){
      var that = this; 
       console.log("DemosView / render");
      
      /*
      var data = {
        demos: this.collection.models,
        _: _
      };
      */
      
      var compiledTemplate = _.template( demosTemplate );
      that.el.html( compiledTemplate );
      
    }
  });

  return DemosView;
});