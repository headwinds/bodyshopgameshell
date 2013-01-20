## About

createjs-box2DWeb-requirejs-backbone-bodyshopgameshell

hacked together by: brandon flowers | [http://www.headwinds.net](http://www.headwinds.net) | [@headwinds](http://twitter.com/headwinds)

Every good indie game needs an good marketing site around it. Unlike a turtle, the game itself also needs to run fast and live outside its shell.

I'd like to create a responsive marketing game shell that I can simply skin and re-use for other games; saving me time and allowing me to focus on the game; or even just game ideas. Like sketching, I enjoy creating small game-related prototypes and will use this shell as a mini gallery of these unfinished and pretty mangled canvases. 

Starting anything is the easy part; it's fun and challenging to attempt something new; finishing them is hard but you learn things along the way that are worth sharing even if the game isn't finished yet or ever so instead of tossing away game sketches, I'd like to think there is value in sharing and learning from them. 

I'm also exploring how Box2DWeb works with CreateJS and would like to share a minor alteration to Box2DWeb's Debug drawing rountines which enable them to better support CreateJS's containers and the concept of a camera. After working with RequireJS, you could see how this alteration could have been much easier and less intimidating had Box2DWeb been architected as various modules so that one could their own custom debug drawing module without having to edit code beyond lines 10800.  

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

With this editor, you can fairly easily create a scene by dragging and dropping box2D objects and then export that scene as json. I've taken the javascript loader sample from the site and massaged it to work with createjs. See the rube demo in the demos folder. 

rubeAllDemos.zip <- this zip contains all the original javascript demos by Chris Campbell but I stripped out the social stuff to make it a bit easier to create my own sandbox

ORIGINAL
[http://www.headwinds.net/lab/rube/rube-javascript-demo/demo.html](http://www.headwinds.net/lab/rube/rube-javascript-demo/demo.html)

MY SANDBOX 
[http://www.headwinds.net/lab/rube/happydays/demo.html](http://www.headwinds.net/lab/rube/happydays/demo.html)


## Contributing Demos

Speaking of the demos folder, that's where you could contribute and work with me on the project. You can fork this project; create your own demo; and make a pull request. I'd be happy to review your code and merge it back into the project. With the demo template, you'll see how to credit your work and I've included automatic credit simply for being a github contributor.  

## Body Shop Game Shell

I've described the "gameshell" part above, but the "bodyshop" keyword is basically about playing with physics; applying forces to "bodies"; wiring up creatures and vehicles with motors; and all about rolling up your sleeves and getting greasy with the nuts and bolts of Box2D. 

## How to run r.js and optimize this example

Open the terminal and navigate to the scripts directory of this project and run:

$ node r.js -o build.js

## Copy & Language Support

This is setup to support multiple languages but currently there is only English support. All the copy is found within the language models folder.  
