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

        var loader = new LoadRubeController();
        var controller = new RubeDemoViewController();
        
        // loader needs the world reference that the controller creates
        controller.init();
        controller.resetScene(); // creates the world 
        var world = controller.getWorld();

        //console.log(model, "\ RubeMainController /")

        function onJsonLoadedHandler( jso ) {
               
            if ( loader.loadSceneFromRUBE( jso, world ) ) {
                console.log("RUBE scene loaded successfully.");
                
               // tmp.wheelBodies[0] = getNamedBodies(world, "truckwheel-front")[0];
               // tmp.wheelBodies[1] = getNamedBodies(world, "truckwheel-back")[0];

               // tmp.truckBody[0] =  getNamedBodies(world, "truckshell")[0];
               // .doAfterLoading();
               controller.doAfterLoading(loader);

               //shark.setup(world, loader)

            } else {
                console.log("Failed to load RUBE scene");
            }

        }

        function loadJSON() {
            $.ajax({
              url: "scripts/demos/rube/json/shark.json",
              dataType: 'json',
              success: onJsonLoadedHandler
            });
        }

        loadJSON(); 

    }

    return RubeMainController;

});