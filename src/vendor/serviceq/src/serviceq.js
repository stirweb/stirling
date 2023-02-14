/**
 * Allows a single call to be made to fetch data and then that same data re-used
 * multiple times. Useful were we want to cut down on api calls due to usage restrictions
 */

/* var UoS_ServiceQ = (function() {

	var ServiceQ = function(options) {

		var _this = this;

		
		//@var {object} Set default options
		this.options = $.extend(true, {

			// method to get data, can be overwriten (e.g. fetch from cookie)
			getCacheData: function() {
				return _this.data;
			},

			// method to set data, can be overwriten (e.g. set to cookie)
			setCacheData: function(data) {
				_this.data = data;
			}

		}, options, {

			request: {

				// what to do with data when we receive it
				success: function( data ) {
					_this.readyState = 2;
					_this.options.setCacheData(data);
					_this.do();
				}

			}

		});
		
		//@var {object} This will store the cached info
		this.data = null;

		//@var {boolean} First call = 0; In progress = 1; Ready = 2
		this.readyState;

		//@var {boolean} If we have a load of requests, then we wanna queue success handlers
		this.queue = [];

		// make ajax call on instatiation here if required
		var data = this.options.getCacheData();
		if (data) {
			this.readyState = 2;
		} else {
			this.readyState = 1; // in progress
			$.ajax(this.options.request);
		}

	};

	ServiceQ.prototype.do = function(success) {

		// queue this handler
		if (typeof success === "function") this.queue.push(success);

		// only if status is complete will we proceed to call each in the queue
		if (this.readyState === 2) {
			var data = this.options.getCacheData();
			while (this.queue.length) {
				this.queue.shift()(data);
			};
		}

	};

	return ServiceQ;

})(); */
