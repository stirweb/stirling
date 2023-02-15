// requestAnim shim layer by Paul Irish
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
var stir = stir || {};
stir.snow = function () {
  var draw, W, H;
  var elapsed = 0;
  var twoPi = Math.PI * 2;
  function Snow(maxParticles) {
    //canvas init
    this.canvas = document.getElementById("wintertime");
    this.ctx = this.canvas.getContext("2d");
    W = 0;
    H = 0;
    draw = this.draw.bind(this);

    //canvas dimensions
    //snowflake particles
    this.resize();
    this.running = true;
    this.mp = maxParticles || 20; //max particles
    this.particles = [];
    for (var i = 0; i < this.mp; i++) {
      this.particles.push(this.flake('top'));
    }
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";

    //angle will be an ongoing incremental flag.
    //Sin and Cos functions will be applied to it to
    //create vertical and horizontal movements of the flakes
    this.angle = 0.01;

    //begin animation loop
    this.start();
  }

  //Function to move the snowflakes
  Snow.prototype.update = function () {
    this.angle += 0.01;
    var sin = Math.sin(this.angle) * 2;
    for (var i = 0; i < this.mp; i++) {
      var p = this.particles[i];
      //Updating X and Y coordinates
      //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
      //Every particle has its own density which can be used to make the downward movement different for each flake
      //Lets make it more random by adding in the radius
      p.y += p.rate;
      p.x += sin;

      //Sending flakes back from the top when it exits
      //Lets make it a bit more organic and let flakes enter from the left and right also.
      if (p.x > W + 5 || p.x < -5 || p.y > H) {
        if (i % 3 > 0)
          //66.67% of the flakes
          {
            this.particles[i] = this.flake('top');
          } else {
          //If the flake is exitting from the right
          if (sin > 0) {
            //Enter from the left
            this.particles[i] = this.flake('left');
          } else {
            //Enter from the right
            this.particles[i] = this.flake('right');
          }
        }
      }
    }
  };
  Snow.prototype.flake = function (enter) {
    var flake = {
      x: Math.random() * W,
      //x-coordinate
      y: Math.random() * H,
      //y-coordinate
      r: Math.random() * 4 + 1,
      //radius
      d: Math.floor(Math.random() * this.mp) //density
    };

    flake.rate = Math.floor(Math.cos(flake.d)) + 1 + flake.r;
    if (!enter) return flake;
    if (enter === 'left') flake.x = -5;
    if (enter === 'right') flake.x = W + 5;
    if (enter === 'top') flake.y = 0 - flake.y;
    return flake;
  };
  Snow.prototype.draw = function (timestamp) {
    //if(timestamp-elapsed > 33) {
    //this.particles.pop();
    //this.mp--;
    //this.stop();
    //}
    //elapsed = timestamp;

    this.ctx.clearRect(0, 0, W, H);
    this.ctx.beginPath();
    for (var i = 0; i < this.mp; i++) {
      var p = this.particles[i];
      if (p.x > 0 && p.y > 0) {
        // don't render offscreen flakes
        this.ctx.moveTo(p.x, p.y);
        this.ctx.arc(p.x, p.y, p.r, 0, twoPi, true);
      }
    }
    this.ctx.fill();
    this.update();
    this.running && requestAnimFrame(draw);
  };
  Snow.prototype.resize = function () {
    W = this.canvas.width = this.canvas.parentElement.clientWidth;
    H = this.canvas.height = this.canvas.parentElement.clientHeight;
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
  };
  Snow.prototype.stop = function () {
    this.running = false;
  };
  Snow.prototype.start = function () {
    this.running = true;
    requestAnimFrame(draw);
  };
  return Snow;
}();