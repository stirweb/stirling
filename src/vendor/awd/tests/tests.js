
$(function() {

	QUnit.test( "Set options", function( assert ) {

		var awd = new UoS_AWD({
			breakpoints: ["small", "medium", "large", "xlarge"], // extra breakpoint
			getCurrent: function() {
				return "current";
			}
		});

		assert.equal(awd.options.breakpoints.length, 4, "Options set");
		assert.equal(awd.options.getCurrent(), "current", "Options set");

	});

	QUnit.test( "Set options", function( assert ) {

		var awd = new UoS_AWD({
			breakpoints: ["small", "medium", "large", "xlarge"]
		});

		// small
		assert.equal( awd.compare("small only", "small"), true, "Options set");

		assert.equal( awd.compare("small down", "small"), true, "Options set");
		assert.equal( awd.compare("small down", "medium"), false, "Options set");
		assert.equal( awd.compare("small down", "large"), false, "Options set");
		assert.equal( awd.compare("small down", "xlarge"), false, "Options set");

		assert.equal( awd.compare("small up", "small"), true, "Options set");
		assert.equal( awd.compare("small up", "medium"), true, "Options set");
		assert.equal( awd.compare("small up", "large"), true, "Options set");
		assert.equal( awd.compare("small up", "xlarge"), true, "Options set");

		// medium
		assert.equal( awd.compare("medium only", "medium"), true, "Options set");

		assert.equal( awd.compare("medium down", "small"), true, "Options set");
		assert.equal( awd.compare("medium down", "medium"), true, "Options set");
		assert.equal( awd.compare("medium down", "large"), false, "Options set");
		assert.equal( awd.compare("medium down", "xlarge"), false, "Options set");

		assert.equal( awd.compare("medium up", "small"), false, "Options set");
		assert.equal( awd.compare("medium up", "medium"), true, "Options set");
		assert.equal( awd.compare("medium up", "large"), true, "Options set");
		assert.equal( awd.compare("medium up", "xlarge"), true, "Options set");

		// large
		assert.equal( awd.compare("large only", "large"), true, "Options set");

		assert.equal( awd.compare("large down", "small"), true, "Options set");
		assert.equal( awd.compare("large down", "medium"), true, "Options set");
		assert.equal( awd.compare("large down", "large"), true, "Options set");
		assert.equal( awd.compare("large down", "xlarge"), false, "Options set");

		assert.equal( awd.compare("large up", "small"), false, "Options set");
		assert.equal( awd.compare("large up", "medium"), false, "Options set");
		assert.equal( awd.compare("large up", "large"), true, "Options set");
		assert.equal( awd.compare("large up", "xlarge"), true, "Options set");

		// xlarge
		assert.equal( awd.compare("xlarge only", "xlarge"), true, "Options set");

		assert.equal( awd.compare("xlarge down", "small"), true, "Options set");
		assert.equal( awd.compare("xlarge down", "medium"), true, "Options set");
		assert.equal( awd.compare("xlarge down", "large"), true, "Options set");
		assert.equal( awd.compare("xlarge down", "xlarge"), true, "Options set");

		assert.equal( awd.compare("xlarge up", "small"), false, "Options set");
		assert.equal( awd.compare("xlarge up", "medium"), false, "Options set");
		assert.equal( awd.compare("xlarge up", "large"), false, "Options set");
		assert.equal( awd.compare("xlarge up", "xlarge"), true, "Options set");

	});

	QUnit.test( "Test handler runs once", function( assert ) {

		var awd = new UoS_AWD({
			getCurrent: function() {
				return "medium"; // fake
			}
		});

		var count = 0;

		// normally we'd pass as an anonymous function, but we want to attempt to
		// run it twice through the adaptTo, so we need to make it a variable here
		// and when we do adaptTo again, it'll try to run it again (thus simulating
		// it being run again when window resizes). The idea is that it should only
		// run once.
		var handler = function() {
			count++;
		};

		awd.adaptTo("medium up", handler);

		// run again, as though window resize occured
		awd.adaptTo("medium up", handler);

		assert.equal( count, 1, "Run!");

	});

	QUnit.test( "Test handler runs with options.run_once", function( assert ) {

		var awd = new UoS_AWD({
			getCurrent: function() {
				return "medium"; // fake
			},
			run_once: false
		});

		var count = 0;

		// normally we'd pass as an anonymous function, but we want to attempt to
		// run it twice through the adaptTo, so we need to make it a variable here
		// and when we do adaptTo again, it'll try to run it again (thus simulating
		// it being run again when window resizes). The idea is that it should only
		// run once.
		var handler = function() {
			count++;
		};

		awd.adaptTo("medium up", handler);

		// run again, as though window resize occured
		awd.adaptTo("medium up", handler);

		assert.equal( count, 2, "Run!");

	});

});
