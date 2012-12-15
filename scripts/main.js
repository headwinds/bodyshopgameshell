// Author: Brandon Flowers / www.headwinds.net / @headwinds

require.config({
  shim: {
      easel: {
          exports: 'createjs'
      },
      tween: {
          deps: ['easel'],
          exports: 'Tween'
      }
  },
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    box2d: 'libs/box2d/Box2dWeb-easeljs',
    easel: 'libs/createjs/easeljs-NEXT.min',
    tween: 'libs/createjs/tweenjs-0.3.0.min',
    text: 'libs/require/text',
    router: 'routes/MainRouter',
    templates: '../templates'
  }
});

require([
  'BodyShopGameShellApp'
], function(BodyShopGameShellApp){
  
  BodyShopGameShellApp.initialize();
});
