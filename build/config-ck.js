// Please carefull not commit this file to your public repos 
// I have separate version (real-config.js) with my actual server info for the sake of this demo
// see .gitignore
define([],function(){this.config={lang_code:"en",mongoose_auth_dev:"",mongoose_auth_staging:"",mongoose_auth_prod:"",env_dev:"",env_staging:"",env_prod:"",img_path_prod:"http://www.headwinds.net/lab/bodyshopgameshell/",img_path_dev:"../",fb_id:"",actorSettings:{goblin:{name:"goblin",imgPath:"imgs/creatures/goblins/goblinSpriteSheet.png",bSpriteSheet:!1,animationObj:null,width:49,height:92,physicsWidth:20,physicsHeight:40,x:460,y:450,density:1,restitution:0,friction:0,bodyType:{shape:"box",type:"dynamic"},collisionCategory:"teamA",bFaceRight:!0},orc:{name:"orc",imgPath:"imgs/creatures/orcs/orcSpriteSheet.png",bSpriteSheet:!0,animationObj:{labels:["walk"],animations:{walk:[0,4,"walk"]}},spriteSheetX:0,spriteSheetY:0,width:100,height:100,physicsWidth:30,physicsHeight:90,x:400,y:420,density:2,restitution:0,friction:0,bodyType:{shape:"box",type:"dynamic"},collisionCategory:"teamA",bFaceRight:!0},cavetroll:[{name:"cavetrollbody",imgPath:"imgs/creatures/cavetrolls/cavetrollBodySpriteSheet.png",bSpriteSheet:!0,animationObj:{labels:["shuffle"],animations:{shuffle:[0,4,"shuffle"]}},spriteSheetX:0,spriteSheetY:0,width:200,height:200,physicsWidth:35,physicsHeight:160,x:350,y:380,density:5,restitution:0,friction:0,bodyType:{shape:"box",type:"dynamic"},collisionCategory:"teamA",bFaceRight:!0},{name:"cavetrollhead",imgPath:"imgs/creatures/cavetrolls/cavetrollHeadSpriteSheet.png",bSpriteSheet:!0,animationObj:{labels:["roar"],animations:{roar:[0,4,"roar"]}},spriteSheetX:0,spriteSheetY:0,width:100,height:100,physicsWidth:50,physicsHeight:50,x:380,y:330,density:5,restitution:0,friction:0,bodyType:{shape:"circle",type:"static"},collisionCategory:"teamA",bFaceRight:!0},{name:"joint",connects:["cavetrollhead","cavetrollbody"],maxSpeed:-2,maxTorque:10,bodyType:"revoluteJoint"}],catapult:[{note:"see CatapultController.js for settings - to do: configure this here"}],knight:{name:"knight",imgPath:"imgs/creatures/knights/knightSpriteSheet.png",bSpriteSheet:!1,animationObj:null,width:49,height:92,physicsWidth:22,physicsHeight:40,x:2400,y:470,density:1,restitution:0,friction:0,bodyType:{shape:"box",type:"dynamic"},collisionCategory:"teamB",bFaceRight:!1},legolas:{name:"legolas",imgPath:"imgs/creatures/heros/legolas/legolasSpriteSheet.png",bSpriteSheet:!1,animationObj:null,width:49,height:92,physicsWidth:22,physicsHeight:40,x:2500,y:470,density:1,restitution:0,friction:0,bodyType:{shape:"box",type:"dynamic"},collisionCategory:"teamB",bFaceRight:!1},trebuchet:[{note:"see TrebuchetController.js for settings - to do: configure this here"}],floor:{name:"grass",imgPath:"imgs/environments/floors/grass/grassSpriteSheet.png",bSpriteSheet:!1,animationObj:null,width:2800,height:10,physicsWidth:4800,physicsHeight:10,x:0,y:470,density:1e10,restitution:0,friction:.9,bodyType:{shape:"box",type:"static"},collisionCategory:"teamEnvironment",bFaceRight:!1},landscape:{name:"landscape",imgPath:"imgs/environments/backgrounds/demoBG.jpg"}}};return config});