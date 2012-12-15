define([
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
  'views/users/UsersView',
  'views/missions/MissionsView',
  'models/game/GameModel',
  'views/game/GameView'
], function($, _, Backbone, MainView, UsersView, MissionsView, GameModel, GameView) {

  var MainRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'home': 'showMain',
      'game': 'showNewGame',
      'players': 'showPlayers',
      'missions': 'showMissions',
      'about': 'showAbout',
      'newgame': 'showNewGame',
      'continuegame': 'showContinueGame',
      'options': 'showOptions',
      'credits': 'showCredits',
    
      // Default
      '*actions': 'defaultAction'
    }
  });


  var initialize = function() {

    var vent = _.extend({}, Backbone.Events);
    var app_router = new MainRouter;

    ///////////////////////////////////////////////////////// TOP NAV

    app_router.on('route:showMain', function () {
      launchMain();
    });
    
    app_router.on('route:showPlayers', function () {
     
      console.log("MainRouter / showPlayers");

      var options = {vent:vent};
      var usersView = new UsersView(options);
      usersView.render();

    });

    app_router.on('route:showMissions', function () {
     
     console.log("MainRouter / showMissions");

      var options = {vent:vent};
      var missionsView = new MissionsView(options);
      missionsView.render();

    });

    app_router.on('route:defaultAction', function (actions) {
      launchMain();
    });

    var launchMain = function() {
      console.log("MainRouter / showMain");

      var that = this;
       
      var options = {vent:vent};
      var mainView = new MainView(options);
      
    };

    ///////////////////////////////////////////////////////// MAIN MENU 

    app_router.on('route:showNewGame', function () {
     console.log("MainRouter / showNewGame / window width: " + $(window).width() );
     
      var gameModel = new GameModel({template:"desktop"});
      var options = {vent:vent, model:gameModel};
      var gameView = new GameView(options);

    });

    app_router.on('route:showContinueGame', function () {
     console.log("MainRouter / showContinueGame");
    });

    app_router.on('route:showOptions', function () {
     console.log("MainRouter / showOptions");
    });

    app_router.on('route:showCredits', function () {
     console.log("MainRouter / showCredits");
    });


    Backbone.history.start();

  };

  return { 
    initialize: initialize
  };

});