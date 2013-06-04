
define([
  'jquery',
  'underscore',
  'backbone',
  'models/demo/DemoModel',
  'collections/demos/DemosCollection',
  'text!templates/demos/demosTemplate.html'
], function($, _, Backbone, DemoModel, DemosCollection, demosTemplate){
  
  var DemosView = Backbone.View.extend({
    
    initialize: function(){
    
      this.el = $("#page");

      var demo0Data = { 
        title: 'manual',
        demoId: 'manual',
        demoPath: '#/newgame?gameID=manual',
        description: 'catapults and things',
        success: '',
        fail: '',
        sentiment:'good',
        timeBreakdown:'1 week - 2hrs a day',
        hours: '14',
        awesome: 0,
        thumbPath: 'imgs/demos/manual/manual.png',
        date_created: new Date(),
        date_updated: new Date(),
        template: "desktop",
        version:0
      };


      var demo0 = new DemoModel(demo0Data);

      var demo1Data = { 
        title: 'minis tirith',
        demoId: 'ministirith',
        demoPath: '#/newgame?gameID=ministirith',
        description: 'trebuchets...',
        success: '',
        fail: '',
        sentiment:'good',
        timeBreakdown:'1 week - 2hrs a day',
        hours: '14',
        awesome: 0,
        thumbPath: 'imgs/demos/ministirith/ministirith.png',
        date_created: new Date(),
        date_updated: new Date(),
        template: "desktop",
        version:0
      };

      var demo1 = new DemoModel(demo1Data);
      
      var demo2Data = { 
        title: 'rube',
        demoId: 'rube',
        demoPath: '#/newgame?gameID=rube',
        description: 'happy days and bear sharks',
        success: '',
        fail: '',
        sentiment:'good',
        timeBreakdown:'1 week - 2hrs a day',
        hours: '14',
        awesome: 0,
        thumbPath: 'imgs/demos/rube/rube.png',
        date_created: new Date(),
        date_updated: new Date(),
        template: "desktop",
        version:0
      };


      var demo2 = new DemoModel(demo2Data);

      var demo3Data = { 
        title: 'svg',
        demoId: 'svg',
        demoPath: '#/newgame?gameID=svg',
        description: 'lemonade stand in the sky',
        success: '',
        fail: '',
        sentiment:'good',
        timeBreakdown:'1 week - 2hrs a day',
        hours: '14',
        awesome: 0,
        thumbPath: 'imgs/demos/svg/svg.png',
        date_created: new Date(),
        date_updated: new Date(),
        template: "desktop",
        version:0
      };


      var demo3 = new DemoModel(demo3Data);

      this.collection = new DemosCollection([demo0, demo1, demo2, demo3]); 

    },

    bindAddHandler: function( model ){
      console.log("DemosView / bindAddHandler / mission added: %s", model.get("name") );
    },

    render: function(){
      var that = this; 
      
      console.log("DemosView / render");
      
      var data = {
        demos: that.collection.models,
        _: _
      };
      
      var compiledTemplate = _.template( demosTemplate, data );
      that.el.html( compiledTemplate );
      
    }
  });

  return DemosView;
});