define([
	"jquery",
	"underscore",
	"backbone",
	"config/config",
	"easel"
	], function($, _, Backbone) {

	var PixiesViewController = function(canvas, fpsFld, screen) { 

		var pixies = []; 
		var maxPixies = 20;

		var getPixie = function() {

			//console.log("GameViewController / getPixie");

			var pixie = new createjs.Shape();
			pixie.compositeOperation = "lighter";
			
			pixie.graphics.beginFill( createjs.Graphics.getRGB(20,10,90,Math.random()*0.1+0.1)).drawCircle(0,0,50);
			pixie.graphics.beginFill( createjs.Graphics.getRGB(55,30,65,Math.random()*0.2+0.2), 100, Math.random()*5+90, 1).drawPolyStar(0,0,20,6);
			
			var a = Math.random()*Math.PI*2;
			var d = Math.random()*110+40;
			pixie._x = Math.cos(a)*d;
			pixie._y = Math.sin(a)*d;
			pixie.z = Math.random()*50+100;
			a = Math.random()*Math.PI*2;
			d = Math.random()*15+10;
			pixie.velX = Math.cos(a)*d;
			pixie.velY = Math.sin(a)*d;
			pixie.velZ = Math.random()*30-15;
			pixie.alpha = 0.5;
			
			return pixie;
		};

		var removePixie = function() {

			//console.log("GameViewController / removePixie");

			if (pixies.length == 0) { return; }
			var pixie = pixies.pop();
			if (pixie.parent) { pixie.parent.removeChild(pixie); }
		}; 

		var drawPixies = function(volDelta, avgVol, vol, audio ) {

			//console.log("GameViewController / drawPixies");
			
			fpsFld.text = Math.round(createjs.Ticker.getMeasuredFPS())+"fps";
		
			// pixie cloud
			
			var createPixieCount = 0;
		
			while (createPixieCount < maxPixies) {
							
				var pixie = getPixie();
				pixies.push(pixie);
				
				createPixieCount++;
			}
		
			var max = (avgVol.right+avgVol.left)/2*maxPixies;
			var focalDistance = 350;
			
			for (var pixieCounter=createPixieCount-1; pixieCounter>=0; pixieCounter--) {
				var pixie = pixies[pixieCounter];
				pixie.velX += pixie.x*-0.005;
				pixie.velY += pixie.y*-0.005;
				pixie.velZ += pixie.z*-0.005;
				pixie._x += pixie.velX;
				pixie._y += pixie.velY;
				pixie.z += pixie.velZ;
				
				var p = focalDistance/(pixie.z+1000);
				
				pixie.x = pixie._x*p + (canvas.width / 2);
				pixie.y = pixie._y*p + (canvas.height / 2);
				
				pixie.scaleX = pixie.scaleY = (vol.left*vol.left*1.1+0.4)*p*2;
				pixie.alpha = vol.left+vol.right+0.4;
				
				if (pixie.z > 0) {
					if (Math.sqrt(pixie.x*pixie.x + pixie.y*pixie.y) < 60 || (Math.random() < 0.15 && pixie.z >= 100) && createPixieCount > max) {				
						if (pixie.parent) { pixie.parent.removeChild(pixie); }
						pixies.splice(pixieCounter,1);
					} else {
						//screen.addChild(pixie);
					}
				} else {
					screen.addChild(pixie);
				}
				
				var curTime =  audio.currentTime;
				var duration = audio.duration;
				
				if (curTime >=  duration)
				{
					if (pixie.parent) { pixie.parent.removeChild(pixie); }
					pixies.splice(pixieCounter,1);
				}
				
				//if ( vol ) {
					//if (pixie.parent) { pixie.parent.removeChild(pixie); }
					//pixies.splice(i,1);
				//	}
			}
			
			if ( pixie._x > -1500 ) {
				removePixie();
			}
		};

		var update = function() {

			//console.log("GameViewController / update");

			var	volDelta = {left: 0, right: 0};
			var	avgVol = {left: 0, right: 0};
			
			var vol = volDelta;
			var audio = avgVol;
			
			drawPixies(volDelta, avgVol, vol, audio); 
		
		};

		return {
			update: update
		}


	};

	return PixiesViewController;
});