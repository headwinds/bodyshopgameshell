define(["jquery","underscore","backbone","controllers/physics/PhysicsController","controllers/keyboard/KeyboardController","config/config","easel"],function(e,t,n,r,i){var s=function(e){var t=document.getElementById("gameCanvas"),n=t.getContext("2d"),s=new createjs.Stage(t),o=e,u=t.width,a=t.height,f=!0,l=0,c=function(){var e=document.domain,t;e==="localhost"?t=config.img_path_dev:t=config.img_path_prod;return t},h=c(),p=2800,d=800,v=new createjs.Container;v.width=p;v.height=a;var m=config.actorSettings.landscape.imgPath;console.log("GameViewController / load imgPath: "+m);var g=new createjs.Bitmap(m);g.x=0;g.y=-(d-a);g.alpha=1;g.width=p;g.height=d;g.snapToPixel=!0;g.mouseEnabled=!1;g.name="cameraWorldContainerLandscapeBG";var y=new createjs.Container;y.x=0;y.y=0;y.alpha=1;y.width=p;y.height=d;y.name="cameraWorldSkinsContainer";var b=new createjs.Container;b.name="cameraWorldContainerDebugBG";b.x=0;b.y=0;b.width=p;b.height=a;b.visible=!1;var w=new createjs.Graphics;w.width=p;w.height=a;b.graphics=w;b.mouseEnabled=!1;v.addChild(g,b,y);var E=new r(t,n,v,y,b,h);E.setup();var S=new i,x=function(e,t){console.log("GameViewController / onKeyboardHandler /keyName: "+t);E.trigger(e,t);t=="LEFT"};S.bind(event,x);s.mouseEventsEnabled=!0;s.autoClear=!1;s.snapPixelsEnabled=!0;var T;T=new createjs.Text("FPS","20px Arial","#FFF");T.alpha=1;T.x=20;T.y=26;s.addChild(v,T);f=!0;var N=0,C=3,k=function(){E.update();T.text=Math.floor(createjs.Ticker.getMeasuredFPS())+" FPS";s.update()},L=function(){f&&k()};createjs.Ticker.setFPS(60);createjs.Ticker.useRAF=!0;createjs.Ticker.addListener(L);E.spawn("body-simple","goblin");E.spawn("body-simple","orc");E.spawn("body-complex","cavetroll");E.spawn("blueprint","catapult");E.spawn("body-simple","knight");E.spawn("body-simple","legolas");var A=function(){f=!0},O=function(){f=!1},M=function(){f=!1;k()},_=function(){console.log("GameViewController / send challenge")},D=!0,P=function(){D?b.visible=!1:b.visible=!0;D=!D},H=!0,B=function(){H?y.visible=!1:y.visible=!0;H=!H},j=function(e){};return{stop:O,play:A,stepForward:M,stepBackward:_,toggleDebug:P,toggleSkins:B,pan:j}};return s});