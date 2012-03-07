/* 
 * circles.js
 * (C) 2012 Bradley Momberger.
 * @version 1.0
 *  Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * game of circles 
 * object: draw as many circles as you can by clicking and having them expand
 *         until they touch another surface.
 * circles move in random directions
 * end game: the circle just created is smaller than the last one 
 * */
(function(){

	 var width = 400;
	 var height = 400;

	 var circleStack = [];

	 var gameStarted = false;

	 function Circle(radius, x, y) {
		 if (this.constructor!==arguments.callee) {
			 return new Circle(radius, x, y);
		 }

		 var moCo = 3;
		 var _radius = radius,
		 _x = x,
		 _y = y,
		 _vx = Math.random() * (y % 2 ? -1 : 1),
		 _vy = Math.random() * (x % 2 ? -1 : 1);

		 this.radius = function radius() { return _radius; };
		 this.x = function x() { return _x; };
		 this.y = function y() { return _y; };
		 this.vx = function vx() { return _vx; };
		 this.vy = function vy() { return _vy; };
		 this.setMotionVector = function(vx, vy) {
			 _vx = vx;
			 _vy - vy;
		 };
		 this.distanceFromEdge = function distanceFromEdge(x0, y0) {
			 var dx = x0 - _x, dy = y0 - _y;
			 return Math.sqrt(dx * dx + dy * dy) - _radius;
		 };
		 this.translate = function translate() {
			 _x += _vx * moCo;
			 _y += _vy * moCo;

			 if(_x < radius) { _x = radius; _vx *= -1; }
			 if(_x + radius >= width) { _x = width - radius; _vx *= -1; }
			 if(_y < radius) { _y = radius; _vy *= -1; }
			 if(_y + radius >= height) { _y = height - radius; _vy *= -1; }

			 var start = false;
			 for(var i = 0; i < circleStack.length; i++ ) {
				 var circ = circleStack[i];
				 //if(circ === this) { 
				//	 start = true;
				//	 continue;
				// }
				// if(!start) continue;
				 if(circ !== this && circ.distanceFromEdge(_x, _y) < _radius) {
					 var ny = (circ.y() - _y),
					 nx = (circ.x() - _x),
					 c = (_vx * nx + _vy * ny) / (nx * nx + ny * ny) * 2;

					 _vx = _vx - c * nx;
					 _vy = _vy - c * ny;

					 //c = (circ.vx() * nx + circ.vy() * ny) / (nx * nx + ny * ny) * 2;
					 //circ.setMotionVector(circ.vx() - c * nx, circ.vy() - c * ny);
				 }
			 }
		 }
		 return this;
	 }


	 function endGameCheck() {
		 return circleStack.length > 1 && (circleStack[0].radius() <= circleStack[1].radius());
	 }

	 function newCircle(x, y) {
		 var minBoundary = Math.min(
			 x,
			 y,
			 width - x,
			 height - y
		 );

		 for(var i = 0; i < circleStack.length; i++) {
			 var d = circleStack[i].distanceFromEdge(x, y);
			 if(d < minBoundary) 
				 minBoundary = d;
		 }

		 if(minBoundary > 0) // < 0 implies inside another circle
			 return new Circle(minBoundary, x, y);
	 }

	 var canvas = document.getElementById("game_canvas"),
	     context = canvas.getContext("2d");

	 canvas.addEventListener("click", 
						   function(ev) {
							   var canvasX = canvas.offsetLeft,
							       canvasY = canvas.offsetTop;
							   if(gameStarted) {
								   var circ = newCircle(
									   ev.pageX - canvasX, 
									   ev.pageY - canvasY
								   );
								   circ && circleStack.unshift(circ);
							   } else {
								   gameStarted = true;
								   gameLoop();
							   }
						   }, false);


	 
	 function gameLoop() {
		 gameStarted = true;
		 var sTime = new Date().getTime();

		 clearCanvas();
		 moveCircles();
		 drawCircles();

		 if(endGameCheck()){
			 doEndGame();
			 return;
		 }

		 setTimeout(gameLoop, 30 - new Date().getTime() + sTime);
	 }
	 
	 function moveCircles() {
		 for(var i = 0; i < circleStack.length; i++) {
			 var c = circleStack[i];
			 c.translate();
		 }
	 }

	 function clearCanvas() {
		 context.fillStyle = "rgb(0,0,0)";
		 context.fillRect(0, 0, width, height);
	 }

	 function drawCircles() {
		 for(var i = 0; i < circleStack.length; i++) {
			 var c = circleStack[i];
			 context.beginPath();
			 //context.moveTo(c.x(), c.y());
			 context.arc(c.x(), c.y(), c.radius(), 0, Math.PI * 2, false);
			 context.strokeStyle = "rgb(255, 255, 255)";
			 context.stroke();
		 }
	 }

	 function doEndGame() {
		 if(window.localStorage.getItem('hiScore') < circleStack.length) {
			 
			 window.localStorage.setItem('hiScore', circleStack.length);
		 }
		 context.textAlign = "center";
		 context.font = "48px sans-serif";
		 context.fillStyle = "rgb(255, 255, 255)";
		 context.fillText("Game Over", 200, 50);
		 context.fillText("Your score: " + circleStack.length, 200, 150);
		 context.fillText("High score: " + window.localStorage.getItem('hiScore'), 200, 250);
		 context.fillText("Click to play again", 200, 350);
		 gameStarted = false;
		 circleStack = [];
	 }

	 //startup code
	 clearCanvas();
	 context.textAlign = "center";
	 context.font = "48px sans-serif";
	 context.fillStyle = "rgb(255, 255, 255)";
	 context.fillText("Click to play", 200, 200);
 })();