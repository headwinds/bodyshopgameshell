define([
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
  'views/about/AboutView',
  'views/demos/DemosView',
  'views/game/GameView',
  'models/game/GameModel'
], function($, _, Backbone, MainView, AboutView, DemosView, GameView, GameModel) {

  var MainRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'home': 'showMain',
      'game': 'showNewGame',
      'demos': 'showDemos',
      'about': 'showAbout',
      'newgame?:params': 'showNewGame',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function() {

    var vent = _.extend({}, Backbone.Events);
    var app_router = new MainRouter;

    console.log("MainRouter / initialize");

    ///////////////////////////////////////////////////////// TOP NAV

    app_router.on('route:showMain', function () {
      launchMain();
    });

    app_router.on('route:showAbout', function () {
      var options = {};
      var aboutView = new AboutView(options);
      aboutView.render();
    });

    app_router.on('route:showDemos', function () {
     
     console.log("MainRouter / showDemos");

      var options = {};
      var demosView = new DemosView(options);
      demosView.render();

    });

    app_router.on('route:defaultAction', function (actions) {
      launchMain();
    });

    var launchMain = function() {
      console.log("MainRouter / showMain");

      var that = this;
       
      var options = {vent:vent, langCode: "en"};
      var mainView = new MainView(options);

      
    };

    ///////////////////////////////////////////////////////// PLAY DEMO
  
    app_router.on('route:showNewGame', function (params) {
     
      var gameID;

      if (params !== undefined ) gameID = params.split("=")[1];
      else gameID = 'manual';

      console.log(gameID, "MainRouter / showNewGame / window width: " + $(window).width() );
    
      var gameModel = new GameModel({ template:"desktop", 
                                      gameID: gameID,
                                      jsonPath: "./scripts/demos/" + gameID + "/json/" + gameID + ".json", 
                                      bDemo: true});
    
      var options = {vent:vent, model:gameModel};
      var gameView = new GameView(options);

    });

    Backbone.history.start();

  };

  return { 
    initialize: initialize
  };

});