
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/about/aboutTemplate.html'
], function($, _, Backbone, aboutTemplate){
  
  var AboutView = Backbone.View.extend({
    
    el: $("#page"),
    initialize: function(){

    },

    render: function(){
       console.log("AboutView / render");
      
      var about = {title: "title here", description: "description here"};

      var data = {about: about};
      var compiledTemplate = _.template( aboutTemplate, data );
      $("#page").html( compiledTemplate );
      
    }
  });

  return AboutView;
});