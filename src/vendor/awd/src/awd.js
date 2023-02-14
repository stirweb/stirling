/**
 * ...
 */

//var UoS_AWD = (function() {

	//var AWD = function(options) {

		/**
		 * @var {object} Set default options
		 */
		// object defaults
		/* this.options = {
			breakpoints : ["small", "medium", "large"],
			getCurrent: function() { return undefined; },
			run_once: true
		};
 */
		// overwrite the defaults with any new vals
		/* for(var index in options) 
			this.options[index] = options[index]; */

		/*
		// jQuery original (Martyn)
		this.options = $.extend(true, {

			breakpoints: ["small", "medium", "large"],

			// method to get current breakpoint
		    getCurrent: function() {
				return undefined;
			},

			// allows the handlers to be run multiple times
			run_once: true

		}, options);
		*/
	//};

    /**
     * This is public so that we can test it
     */
	/* AWD.prototype.compare = function(operator, current) {

		var opParts = operator.split(" ");
		var breakpoints = this.options.breakpoints;

		switch (opParts[1]) { // e.g. "up"
			case "only":
				return opParts[0] === current;
			case "up":
				return breakpoints.indexOf(opParts[0]) <= breakpoints.indexOf(current);
			case "down":
				return breakpoints.indexOf(opParts[0]) >= breakpoints.indexOf(current);
			default:
				console.log("AWD error: invalid operator");
		}

	};

	AWD.prototype.adaptTo = function(breakpoint, handler) {
		var _this = this;
		var options = this.options;

	    // load on page load
	    if (_this.compare(breakpoint, options.getCurrent())) {
			if (!handler.__uos_awd__initialized || !options.run_once) {
				handler();
				handler.__uos_awd__initialized = true;
			}
		}

		// ...also on resize (if not already loaded)
		window.onresize = function(e){ 
			if (_this.compare(breakpoint, options.getCurrent())) {

				// if this handler has been run already, don't run again?
				if (!handler.__uos_awd__initialized || !options.run_once) {
					handler();
					handler.__uos_awd__initialized = true;
				}
			}
		};

	};

	return AWD; */

//})();
