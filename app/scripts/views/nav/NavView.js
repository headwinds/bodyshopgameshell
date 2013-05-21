define([
  'jquery',
  'underscore',
  'backbone',
  'models/nav/NavModel',
  'text!templates/nav/navTemplate.html'
], function($, _, Backbone, NavModel, navTemplate) {
  
  var NavView = Backbone.View.extend({
    el: $("#nav"),

    events: {
      "click #option-a": "onClickHandler",
      "click #option-b": "onClickHandler",
      "languageChange": "onLanguageReadyHandler"
    },

    initialize: function(options) {
      console.log( "NavView / init");

      //this.set( 'content', options.model.get('content') );
      this.model = new NavModel(options);

      this.model.bind('languageChange', this.onLanguageReadyHandler, this);
      
      this.render();
    },
    
    render: function(){

      console.log("NavView / render");
      var that = this;
      var content = that.model.get('content').toJSON();
   
      var compiledTemplate = _.template( navTemplate, content );
      that.$el.html(compiledTemplate);
      
    },

    onLanguageReadyHandler: function(e) {
      console.log("NavView / onLanguageReadyHandler");
      var that = this;
      that.render();
    },

    onClickHandler: function(e) {
      var optionSelected = e.currentTarget.id;
      console.log('%s / onClickHandler %s ', this.name, optionSelected)
    }

  });

  return NavView;

});


