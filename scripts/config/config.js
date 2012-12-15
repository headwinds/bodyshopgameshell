// Please carefull not commit this file to your public repos 
// I have separate version (real-config.js) with my actual server info for the sake of this demo
// see .gitignore

define([], function(){

    this.config = {
        lang_code:'en',
        mongoose_auth_dev: '',
        mongoose_auth_staging: '',
        mongoose_auth_prod: '',
        env_dev: '',
        env_staging: '',
        env_prod: '',
        fb_id:'',
        actorSettings: {
            goblin : { name: "goblin", 
                        path: "../imgs/creatures/goblins/goblinSpriteSheet.png",
                        bSpriteSheet: false,
                        animationObj: null,
                        width: 49, 
                        height: 92,
                        physicsWidth: 22,
                        physicsHeight: 40,
                        x: 520,
                        y: 470,
                        density: 1,
                        restitution: 0,
                        friction: 0, 
                        collisionCategory: "teamA", 
                        bodyType: "box"
            },
            orc : { name: "orc", 
                    path: "../imgs/creatures/orcs/orcSpriteSheet.png",
                    bSpriteSheet: true,
                    animationObj: { labels:["walk"], animations: { walk: [0, 4, "walk"] } },
                    spriteSheetX: 0,
                    spriteSheetY: 0,
                    width: 100,
                    height: 100,
                    physicsWidth: 60,
                    physicsHeight: 90,
                    x: 460,
                    y: 420,
                    density: 1,
                    restitution: 0,
                    friction: 0,
                    bodyType: "box"
            },
            cavetroll : [
                {   name: "cavetrollhead",
                    path: "../imgs/creatures/cavetrolls/cavetrollHeadSpriteSheet.png",
                    bSpriteSheet: true,
                    animationObj: { labels:["roar"], animations: { roar: [0, 4, "roar"] } },
                    spriteSheetX: 0,
                    spriteSheetY: 0,
                    width: 100,
                    height: 100,
                    physicsWidth: 50,
                    physicsHeight: 50,
                    x: 380,
                    y: 200,
                    density: 1,
                    restitution: 0,
                    friction: 0,
                    collisionCategory: "teamA", 
                    bodyType: "circle"
                },
                {   name: "cavetrollbody",
                    path: "../imgs/creatures/cavetrolls/cavetrollBodySpriteSheet.png",
                    bSpriteSheet: true,
                    animationObj: { labels:["shuffle"], animations: { shuffle: [0, 4, "shuffle"] } },
                    spriteSheetX: 0,
                    spriteSheetY: 0,
                    width: 200,
                    height: 200,
                    physicsWidth: 100,
                    physicsHeight: 170,
                    x: 360,
                    y: 300,
                    density: 1,
                    restitution: 0,
                    friction: 0,
                    collisionCategory: "teamA", 
                    bodyType: "box"
                },
                {   name: "joint",
                    connects:["cavetrollhead", "cavetrollbody"],
                    maxSpeed: -2,
                    maxTorque: 10,
                    bodyType: "revoluteJoint"
                }
            ],
            catapult : [
                { note : "see CatapultController.js for settings" }
            ],
            episode0 : {
                landscape: "../imgs/landscapes/episode0LandscapeBG.jpg"
            }
        }
    }

  return config;

});


