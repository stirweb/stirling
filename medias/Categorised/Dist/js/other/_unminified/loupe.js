(function(loupes) {

	if(!loupes) return;

	function Loupe(container, loupe, map) {
    
		var toggle = this.toggle.bind(this);
		var set    = this.set.bind(this);
		var update = this.update.bind(this);
		var zoom   = this.zoom.bind(this);
		var reset  = this.reset.bind(this);
		
		this.x = 0;
		this.y = 0;
		this.height = 300;
		this.width = 300;
		this.scalingFactor = {};
		this.rect;
		this.zoomlevels = [200, 100];
		this.radius =  this.zoomlevels[0];
		this.container = container;   // HTML wrapper (div) element
		this.loupe = loupe;           // HTML Loupe (svg#use) element
		this.map = map;               // HTML map (svg) element	
		this.zoomed = false;
		
		window.addEventListener("resize", reset);
		window.addEventListener("scroll", reset);
		this.init();
	
		function trackPointerMovement(event) {
			set(event);
			update();
		}
	
		this.loupe.addEventListener("click", function(event) {
			zoom();
			update();
		});

		this.container.addEventListener("click", function(event) {
			if(container == event.target) { 
				toggle(false);
			}
		});
	
		this.container.addEventListener("pointerleave", function(event) {
			toggle(false);
		});
		
		this.container.addEventListener("pointerenter", function(event) {
			if(container == event.target) {
				toggle(true);
				event.preventDefault();
			}
		});
	
		this.container.addEventListener("pointermove", trackPointerMovement, false);
	
	};
	
	Loupe.prototype.init = function init() {
		this.toggle(true);
		var loupeDimensions = this.loupe.getBoundingClientRect();
		this.toggle(false);
		this.width = loupeDimensions.width;
		this.height = loupeDimensions.height;
		this.reset();
	};
	
	Loupe.prototype.reset = function reset() {
		this.rect = this.container.getBoundingClientRect();
		var viewBox = this.map.getAttribute("viewBox");
		if(viewBox) {
			viewBox = viewBox.split(" ");
			this.scalingFactor.x = viewBox[2]>this.rect.width?viewBox[2]/this.rect.width:this.rect.width/viewBox[2];
			this.scalingFactor.y = viewBox[3]>this.rect.height?viewBox[3]/this.rect.height:this.rect.height/viewBox[3];
		}
	};
	
	Loupe.prototype.toggle = function toggle(show) {
		this.loupe.style.display = show ? "block" : "none";
		if(!show) this.zoomed = false;
	};
	
	Loupe.prototype.set = function set(event) {
		var offset = {
			top:  this.rect.top,// + document.body.scrollTop,
			left: this.rect.left// + document.body.scrollLeft
		}
		this.x = Math.round(event.clientX - offset.left),
		this.y = Math.round(event.clientY - offset.top);
	};
	
	Loupe.prototype.update = function update() {
		var x1, y1, viewBox;
		/*
		x1 = Math.round((this.x/this.rect.width) * this.intrinsic.width) - this.radius/2;
		y1 = Math.round((this.y/this.rect.height) * this.intrinsic.height) - this.radius;
		x1 = Math.round(((this.x) * this.scalingFactor.x));
		y1 = Math.round((this.y) * this.scalingFactor.y);
		*/
 		x1 = Math.round((this.x * this.scalingFactor.x) - this.width / 2);
		y1 = Math.round((this.y * this.scalingFactor.y) - this.height / 2);
		viewBox = x1.toString() + ' ' + y1.toString() + ' ' + this.radius.toString() + ' ' + this.radius.toString();
		this.loupe.setAttribute("viewBox", viewBox);
		this.loupe.style.top  = (this.y - this.height*0.8) + "px";
		this.loupe.style.left = (this.x - this.width/2) + "px";
		/* this.container.setAttribute('data-data',`x:${this.x} y:${this.y} | x1:${x1} y1:${y1}` ); */
	};
	
	Loupe.prototype.zoom = function zoom(){
		this.radius = this.zoomed ?  this.zoomlevels[0] :  this.zoomlevels[1];
		this.loupe.style.cursor = this.zoomed ? "zoom-in": "zoom-out";
		this.zoomed =! this.zoomed;
	};

	Array.prototype.forEach.call( loupes , container => {

		if(!container || !container.querySelector) return;

//		var rect = container.getBoundingClientRect();
//		if(rect && rect.width && rect.width <= 460) return;

		var loupe = container.querySelector(".loupe");
		var map = container.querySelector("svg:not(.loupe)");
			 
		if(loupe && map) new Loupe(container, loupe, map);

	});

})( document.querySelectorAll('.c-zoom') );