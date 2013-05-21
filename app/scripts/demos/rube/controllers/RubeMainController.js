define([
    "jquery",
    "underscore",
    "backbone",
    "demos/rube/controllers/LoadRubeController",
    "demos/rube/controllers/RubeDemoViewController"
    ], function($, _, Backbone, LoadRubeController, RubeDemoViewController ) {
    

    function RubeMainController( model ) {

        var loadRubeController = new LoadRubeController();
        var demoViewController = new RubeDemoViewController();
        
        // loader needs the world reference that the controller creates
        demoViewController.init(loadRubeController);
        
    }

    return RubeMainController;

});