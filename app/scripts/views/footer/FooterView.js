define([
  'jquery',
  'underscore',
  'backbone',
  'models/footer/FooterModel',
  'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, FooterModel, footerTemplate) {
  
  var FooterView = Backbone.View.extend({
    el: $("#footer"),

    events: {
      "click #option-a": "onClickHandler",
      "click #option-b": "onClickHandler"
    },

    initialize: function(options) {
      
      var footerModel = new FooterModel(options);

      console.log( "FooterView / init" );
      this.model = footerModel;
      this.render();
    },
    
    render: function(){

      console.log("FooterView / render");
      var that = this;
      var content = that.model.get('content').toJSON();

      var compiledTemplate = _.template( footerTemplate, content );
      that.$el.html(compiledTemplate);
      
    },

    onClickHandler: function(e) {
      var optionSelected = e.currentTarget.id;
      console.log('%s / onClickHandler %s ', this.name, optionSelected)
    }

  });

  return FooterView;

});

/*

TO DO:

Reporting - how many people clicked A or B 

 events: {
      "click #option-a":          "onClickHandler",
      "click #option-b":          "onClickHandler"
    },

    onClickHandler: function(e) {
      var optionSelected = e.currentTarget.id;
      console.log('%s / onClickHandler %s ', this.name, optionSelected)
    }

*/

