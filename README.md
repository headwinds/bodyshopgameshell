## About

createjs-box2DWeb-requirejs-backbone-bodyshopgameshell

hacked together by: brandon flowers | [http://www.headwinds.net](http://www.headwinds.net) | [@headwinds](http://twitter.com/headwinds)

So why the clunky project title? 

I'm interested in collaborating with other programmers and thought I'd just list the major libraries [a nod to JQuery which is also involved but doesn't need more promoting] first and followed by a few concatenated keywords that attempt to describe my intentions. 

What am trying to do? 

My main goal is to create a marketing game shell built on Backbone that holds both the game itself running on a HTML5 canvas as well as various pages that support it. I'm also exploring how Box2DWeb works with CreateJS and would like to share a minor alteration to Box2DWeb's Debug drawing rountines which enable them to better support CreateJS's containers and the concept of a camera. After working with RequireJS, you could see how this alteration could have been much easier and less intimidating had Box2DWeb been architected as various modules so that one could their own custom debug drawing module without having to edit code beyond lines 10800.  

## Demo

Tested in Chrome/Firefox/Safari:
[http://www.headwinds.net/lab/bodyshopgameshell/index-dev.html](http://www.headwinds.net/lab/bodyshopgameshell/index-dev.html)

## Major Libraries

CreateJS - [http://www.createjs.com](http://www.createjs.com)

Box2DWeb - [http://code.google.com/p/box2dweb/](http://code.google.com/p/box2dweb/)

RequireJS - [http://requirejs.org/](http://requirejs.org/)

Backbone - [http://backbonejs.org/](http://backbonejs.org/)

I highly recommend Thomas Davis' Backbone.js Tutorials to learn more about Node, Backbone, RequireJS, and MongoDB - [http://backbonetutorials.com](http://backbonetutorials.com). I also made a little contribution to his modular backbone example which was actually the base of this demo. 

## Physics Editor 

R.U.B.E -  [https://www.iforce2d.net/rube/](https://www.iforce2d.net/rube/)

## Body Shop Game Shell

I've described the "gameshell" part above, but the "bodyshop" keyword is basically about playing with physics; applying forces to "bodies"; wiring up creatures and vehicles with motors; and all about rolling up your sleeves and getting greasy with the nuts and bolts of Box2D. 

## How to run r.js and optimize this example

Open the terminal and navigate to the scripts directory of this project and run:

$ node r.js -o build.js

## Copy & Language Support

This is setup to support multiple languages but currently there is only English support. All the copy is found within the language models folder.  
