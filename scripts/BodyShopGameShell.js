define([
  'jquery',
  'underscore',
  'backbone',
  'router' 
], function($, _, Backbone, MainRouter){
  var initialize = function(){    
    MainRouter.initialize();
  }

  return {
    initialize: initialize
  };

});