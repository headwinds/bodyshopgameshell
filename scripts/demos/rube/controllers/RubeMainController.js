define([
    "jquery",
    "underscore",
    "backbone",
    "demos/rube/controllers/LoadRubeController",
    "demos/rube/controllers/RubeDemoViewController"
    ], function($, _, Backbone, LoadRubeController, RubeDemoViewController ) {
    
    /*
    Object.prototype.hasOwnProperty = function(property) {
        return typeof(this[property]) !== 'undefined'
    };
    */

    function RubeMainController( model ) {

        var loadRubeController = new LoadRubeController();
        var demoViewController = new RubeDemoViewController();
        
        // loader needs the world reference that the controller creates
        demoViewController.init(loadRubeController);
        //controller.resetScene(); // creates the world 
        //var world = controller.getWorld();

        
        //loadJSON(); 

        //controller.bind("reset", loadJSON);

    }

    return RubeMainController;

});