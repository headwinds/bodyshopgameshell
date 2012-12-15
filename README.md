## About

Project: createjs-box2DWeb-requirejs-backbone-bodyshopgameshell
Author: brandon flowers | [http://www.headwinds.net](http://www.headwinds.net) | [@headwinds](http://twitter.com/headwinds)

Right, so why the clunky project title? 

I'm interested in collaborating with other programmers and thought I'd just list the major libraries [a nod to JQuery which is also involved but doesn't need more promoting] first and followed by a few concatenated keywords that attempt to describe my intentions. 

What am trying to do? 

My main goal is to create a marketing game shell built on Backbone that holds both the game itself running on a HTML5 canvas as well as various pages that support it. I'm also exploring how Box2DWeb works with CreateJS and would like to share a minor alteration to Box2DWeb's Debug drawing rountines which enable them to better support CreateJS's containers and the concept of a camera. This alteration could have been easier and less intimidating had Box2DWeb been architected with requirejs so that one could their own custom debug drawing modules without having to edit code beyond lines 10800.  

I'm a big fan of the indie game movement, and I want to contribute something to this cause. On the weekends, I enjoy pretending I'm a game dev and spend a few hours tinkering on my own game ideas yet I rarely (well honestly never) finish them. As you can see by the demo, this is a obviously a work-n-progress. For me, game design and development is a hobby and I don't get paid to finish them. In fact, I'm not opposed to making a little coin on the side and definitely appreciate those who do scratch out a living off marketing games. If this source can make your lives any easier and save you a day or two banging your head against Box2DWeb, I'm happy to make that contribution and will hopefully get paid back in the joy of playing your game or wild data viz! 

I've realized that it's all about the journey and discovery of experimenting with code and game mechanics that's fun and frustrating at times but can lead to major breakthroughs; many are useful in my day job as a UI programmer. There's something about the process of dealing with complex libaries and attempting to simplify them it into easy-to-use, modular approaches that's very powerful and rewarding.   

## Major Libraries

CreateJS - [http://www.createjs.com](http://www.createjs.com)

Box2DWeb - [http://code.google.com/p/box2dweb/](http://code.google.com/p/box2dweb/)

RequireJS - [http://requirejs.org/](http://requirejs.org/)

Backbone - [http://backbonejs.org/](http://backbonejs.org/)

I highly recommend Thomas Davis' Backbone.js Tutorials to learn more about Node, Backbone, RequireJS, and MongoDB - [http://backbonetutorials.com](http://backbonetutorials.com). I also made a little contribution to his modular backbone example which was actually the base of this demo. 

## Body Shop Game Shell

I've described the "gameshell" part above, but the "bodyshop" keyword is basically about playing with physics; applying forces to "bodies"; wiring up creatures and vehicles with motors; and all about rolling up your sleeves and getting greasy with the nuts and bolts of Box2D. 

## How to run r.js and optimize this example

Open the terminal and navigate to the scripts directory of this project and run:

$ node r.js -o build.js

