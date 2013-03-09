define([
  'jquery',
  'underscore',
  'backbone',
  'router' 
], function($, _, Backbone, MainRouter){
  var initialize = function(){   

    var vent = _.extend({}, Backbone.Events);

    MainRouter.initialize();
  }

  return {
    initialize: initialize
  };

});