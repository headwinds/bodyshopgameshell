define([
  'jquery',
  'underscore',
  'backbone',
  'models/main/MainModel',
  'views/nav/NavView',
  'views/footer/FooterView',
  'text!templates/main/mainTemplate.html'
], function($, _, Backbone, MainModel, NavView, FooterView, mainTemplate) {
  
  var MainView = Backbone.View.extend({
    el: $("#page"),

    events: {
      "click #option-a": "onClickHandler",
      "click #option-b": "onClickHandler",
      "click #option-c": "onClickHandler",
      "click #option-d": "onClickHandler",
      "languageChange": "onLanguageReadyHandler"
    },

    initialize: function(options) {
      console.log( "MainView / init");

      var mainModel = new MainModel(options);

      this.model = mainModel; 
      this.model.bind('languageChange', this.onLanguageReadyHandler, this);
      this.model.bind('change', this.onModelChangeHandler, this);
      this.options = options; 

    },
    
    render: function(){

      console.log("MainView / render");
      var that = this;
      var options = { content: that.model.get('content') };

      // nav 
      var navView = new NavView(options);

      // footer 
      var footerView = new FooterView(options);

    },

    onModelChangeHandler:function(e) {
      var that = this;
      console.log("MainView / onModelChangeHandler");
    },

    onLanguageReadyHandler: function(e) {
      console.log("MainView / onLanguageReadyHandler");
      var that = this;
      var content = that.model.get('content').toJSON();
   
      var compiledTemplate = _.template( mainTemplate, content );
      that.$el.html(compiledTemplate);

      this.render();

    },

    onClickHandler: function(e) {
      //e.preventDefault();
      //e.stopPropagation();

      var that = this;
      var optionSelected = e.currentTarget.id;

      var vent = that.options.vent;

      switch(optionSelected) {
        case "option-a" :
          console.log("MainView / changing state / start new game");
          that.model.set({currentState:'start game'});
          break;
        case "option-b" :
          that.trigger("click:continue game");
          break;
        case "option-c" :
          that.trigger("click:options");
          break;
        case "option-d" :
          that.trigger("click:credits");
          break;
      }
    }

  });

  return MainView;

});


