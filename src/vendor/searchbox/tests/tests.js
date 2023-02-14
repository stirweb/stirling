
$(function() {

	QUnit.test( "Active filters multiple tests", function( assert ) {

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({});
		var active_filters = searchBox.active_filters;

		var filters = active_filters.getFilters();
		var ordered_filters = active_filters.getOrderedFilters();

		// check correct menu from the head link's text
		assert.ok( typeof filters === "object", "Filters is an empty object" );
		assert.ok( typeof ordered_filters === "object" && ordered_filters.length === 0, "Ordered filters is an empty array" );

		// add a filter value "level": "Undergraduate"
		active_filters.add("level", "Undergraduate");
		assert.ok( typeof filters["level"] !== "undefined" && typeof filters["level"]["Undergraduate"] !== "undefined", "Filters has level:Undergraduate" );
		assert.ok(
			ordered_filters.length === 1 &&
			ordered_filters[0]["name"] === "level" &&
			ordered_filters[0]["value"] === "Undergraduate", "Ordered filters has correct length" );

		// add a filter value "level": "Postgraduate"
		active_filters.add("level", "Postgraduate");
		assert.ok( typeof filters["level"] !== "undefined" && typeof filters["level"]["Postgraduate"] !== "undefined", "Filters has level:Postgraduate" );
		assert.ok(
			ordered_filters.length === 2 &&
			ordered_filters[1]["name"] === "level" &&
			ordered_filters[1]["value"] === "Postgraduate", "Ordered filters has correct length" );

		// add a filter value "method": "FT"
		active_filters.add("method", "FT");
		assert.ok( typeof filters["method"] !== "undefined" && typeof filters["method"]["FT"] !== "undefined", "Filters has method:FT" );
		assert.ok(
			ordered_filters.length === 3 &&
			ordered_filters[2]["name"] === "method" &&
			ordered_filters[2]["value"] === "FT", "Ordered filters has correct length" );

		// add a filter value "level": "Jedi"
		active_filters.add("level", "Jedi");
		assert.ok( typeof filters["level"] !== "undefined" && typeof filters["level"]["Jedi"] !== "undefined", "Filters has level:Jedi" );
		assert.ok(
			ordered_filters.length === 4 &&
			ordered_filters[3]["name"] === "level" &&
			ordered_filters[3]["value"] === "Jedi", "Ordered filters has correct length" );

		// test the has method
		assert.ok( active_filters.has("level"), "Filters has level" );
		assert.ok( active_filters.has("level", "Undergraduate"), "Filters has level:Undergraduate" );
		assert.ok( active_filters.has("level", "Postgraduate"), "Filters has level:Postgraduate" );
		assert.ok( active_filters.has("level", "Jedi"), "Filters has level:Jedi" );
		assert.ok( active_filters.has("method"), "Filters has method" );
		assert.ok( active_filters.has("method", "FT"), "Filters has method:FT" );

		// test order of ordered_filters - Undergraduate, Postgraduate, FT, Jedi
		for(var i=0; i<ordered_filters.length; i++) {
			assert.ok( ordered_filters[i]["name"] === ["level","level","method","level"][i], "Order is ok");
			assert.ok( ordered_filters[i]["value"] === ["Undergraduate","Postgraduate","FT","Jedi"][i], "Order is ok");
		}

		// remove a single filter from "method"
		active_filters.remove("method", "FT");
		assert.ok( typeof filters["method"] === "undefined", "Filters has removed method:FT" );
		assert.ok( !active_filters.has("method", "FT"), "Filters has removed method:FT" );

		// test order of ordered_filters - Undergraduate, Postgraduate, FT, Jedi
		for(var i=0; i<ordered_filters.length; i++) {
			assert.ok( ordered_filters[i]["name"] === ["level","level","level"][i], "Order is ok");
			assert.ok( ordered_filters[i]["value"] === ["Undergraduate","Postgraduate","Jedi"][i], "Order is ok");
		}

		// remove a single filter from "level"
		active_filters.remove("level", "Jedi");
		assert.ok( typeof filters["level"]["Jedi"] === "undefined", "Filters has removed level:Jedi" );
		assert.ok( !active_filters.has("level", "Jedi"), "Filters has removed level:Jedi" );

		// test order of ordered_filters - Undergraduate, Postgraduate, FT, Jedi
		for(var i=0; i<ordered_filters.length; i++) {
			assert.ok( ordered_filters[i]["name"] === ["level","level"][i], "Order is ok");
			assert.ok( ordered_filters[i]["value"] === ["Undergraduate","Postgraduate"][i], "Order is ok");
		}

		// remove multi filter from "level"
		active_filters.remove("level");
		assert.ok( typeof filters["level"] === "undefined", "Filters has removed level" );
		assert.ok( !active_filters.has("level"), "Filters has removed level" );

		// check correct menu from the head link's text
		assert.ok( typeof filters === "object", "Filters is an empty object" );
		assert.ok( typeof ordered_filters === "object" && ordered_filters.length === 0, "Ordered filters is an empty array" );


		// test reset
		active_filters.reset(); // then reset
		filters = active_filters.getFilters(); // fetch newly created empty vars TODO ??
		ordered_filters = active_filters.getOrderedFilters(); // fetch newly created empty vars TODO ??
		assert.ok( typeof filters === "object", "Filters is an empty object" );
		assert.ok( typeof ordered_filters === "object" && ordered_filters.length === 0, "Ordered filters is an empty array" );

	});

	QUnit.test( "Test formatters with getResults", function( assert ) {

		//
		var data = [
			{name: "James", age: 21},
			{name: "Robert", age: 31},
		];

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					formatters: {
						name: function(value, result) {

							// change james only
							if (value === "James") {
								value = "Jimmy";
							}
							return value;
						},
						age: function(value, result) {

							// double all ages
							return value * 2;
						},

						// dynamic property based on name
						full_name: function(value, result) {

							// double all ages
							return "Mr " + result.name;
						},

						eyes: 2
					}
				}
			}
		});

		// searchBox.options.datasets.results.renderer(data);
		var dataset = searchBox.options.datasets.results;
		var results = searchBox.getResults(data, dataset.filters, dataset.formatters);

		assert.ok( results[0].name === "Jimmy", "Formatter is working" );
		assert.ok( results[0].age === 42, "Formatter is working" );
		assert.ok( results[0].full_name === "Mr Jimmy", "Formatter is working" );
		assert.ok( results[0].eyes === 2, "Formatter is working" );

		assert.ok( results[1].age === 62, "Formatter is working" );
		assert.ok( results[1].full_name === "Mr Robert", "Formatter is working" );
		assert.ok( results[1].eyes === 2, "Formatter is working" );

	});

	QUnit.test( "Test getResults with default operator (AND)", function( assert ) {

		//
		var data = [
			{name: "James", job: "Techie", hobbies: ["Cycling","Movies"]},
			{name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]},
			{name: "Mick", job: "Sales", hobbies: ["Reading","Running"]},
		];

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					filters: {
						job: function(resultValue, filterValue) {
	                        return (resultValue === filterValue);
	                    },
						hobbies: function(resultValue, filterValue) {
	                        return ($.inArray(filterValue, resultValue) !== -1);
	                    },
					}
				}
			}
		});

		searchBox.active_filters.add("job", "Techie");
		searchBox.active_filters.add("hobbies", "Running");

		var dataset = searchBox.options.datasets.results;
		var results = searchBox.getResults(data, dataset.filters);

		assert.ok( results.length === 1, "Filtered results is correct length" );
		assert.ok( results[0].name === "Robert", "Filtered results is correct person" );

	});

	QUnit.test( "Test getResults with AND operator", function( assert ) {

		//
		var data = [
			{name: "James", job: "Techie", hobbies: ["Cycling","Movies"]},
			{name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]},
			{name: "Mick", job: "Sales", hobbies: ["Reading","Running"]},
		];

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					filters: {
						job: function(resultValue, filterValue) {
	                        return (resultValue === filterValue);
	                    },
						hobbies: function(resultValue, filterValue) {
	                        return ($.inArray(filterValue, resultValue) !== -1);
	                    },
					}
				}
			}
		});

		searchBox.active_filters.add("job", "Techie");
		searchBox.active_filters.add("hobbies", "Running");

		var dataset = searchBox.options.datasets.results;
		var results = searchBox.getResults(data, dataset.filters, null, {
			filters__operator: "AND"
		});

		assert.ok( results.length === 1, "Filtered results is correct length" );
		assert.ok( results[0].name === "Robert", "Filtered results is correct person" );

	});

	QUnit.test( "Test getResults with OR operator", function( assert ) {

		//
		var data = [
			{name: "James", job: "Techie", hobbies: ["Cycling","Movies"]},
			{name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]},
			{name: "Mick", job: "Sales", hobbies: ["Reading","Running"]},
		];

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					filters: {
						job: function(resultValue, filterValue) {
	                        return (resultValue === filterValue);
	                    },
						hobbies: function(resultValue, filterValue) {
	                        return ($.inArray(filterValue, resultValue) !== -1);
	                    },
					}
				}
			}
		});

		searchBox.active_filters.add("job", "Techie");
		searchBox.active_filters.add("hobbies", "Running");

		var dataset = searchBox.options.datasets.results;
		var results = searchBox.getResults(data, dataset.filters, null, {
			filters__operator: "OR"
		});

		assert.ok( results.length === 3, "Filtered results is correct length" );
		assert.ok( results[0].name === "James", "Filtered results is correct person" );

	});

	QUnit.test( "Test validate with default operator (AND)", function( assert ) {

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					filters: {
						job: function(resultValue, filterValue) {
							return (resultValue === filterValue);
						},
						hobbies: function(resultValue, filterValue) {
							return ($.inArray(filterValue, resultValue) !== -1);
						},
					}
				}
			}
		});

		var dataset = searchBox.options.datasets.results;

		//
		var james = {name: "James", job: "Techie", hobbies: ["Cycling", "Movies"]};
		var robert = {name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]};
		var mick = {name: "Mick", job: "Sales", hobbies: ["Reading","Cycling"]};

		searchBox.active_filters.add("job", "Techie");
		searchBox.active_filters.add("hobbies", "Running");

		var resp1 = searchBox.validate(james, dataset.filters);
		var resp2 = searchBox.validate(robert, dataset.filters);
		var resp3 = searchBox.validate(mick, dataset.filters);

		assert.ok( !resp1, "Validate returned correct value" );
		assert.ok( resp2, "Validate returned correct value" );
		assert.ok( !resp3, "Validate returned correct value" );

	});

	QUnit.test( "Test validate with AND operator", function( assert ) {

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					filters: {
						job: function(resultValue, filterValue) {
							return (resultValue === filterValue);
						},
						hobbies: function(resultValue, filterValue) {
							return ($.inArray(filterValue, resultValue) !== -1);
						},
					}
				}
			}
		});

		var dataset = searchBox.options.datasets.results;

		//
		var james = {name: "James", job: "Techie", hobbies: ["Cycling", "Movies"]};
		var robert = {name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]};
		var mick = {name: "Mick", job: "Sales", hobbies: ["Reading","Cycling"]};

		searchBox.active_filters.add("job", "Techie");
		searchBox.active_filters.add("hobbies", "Running");

		var resp1 = searchBox.validate(james, dataset.filters, "AND");
		var resp2 = searchBox.validate(robert, dataset.filters, "AND");
		var resp3 = searchBox.validate(mick, dataset.filters, "AND");

		assert.ok( !resp1, "Validate returned correct value" );
		assert.ok( resp2, "Validate returned correct value" );
		assert.ok( !resp3, "Validate returned correct value" );

	});

	QUnit.test( "Test validate with OR operator", function( assert ) {

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					filters: {
						job: function(resultValue, filterValue) {
							return (resultValue === filterValue);
						},
						hobbies: function(resultValue, filterValue) {
							return ($.inArray(filterValue, resultValue) !== -1);
						},
					}
				}
			}
		});

		var dataset = searchBox.options.datasets.results;

		//
		var james = {name: "James", job: "Techie", hobbies: ["Cycling", "Movies"]};
		var robert = {name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]};
		var mick = {name: "Mick", job: "Sales", hobbies: ["Reading","Cycling"]};

		searchBox.active_filters.add("job", "Techie");
		searchBox.active_filters.add("hobbies", "Running");

		var resp1 = searchBox.validate(james, dataset.filters, "OR");
		var resp2 = searchBox.validate(robert, dataset.filters, "OR");
		var resp3 = searchBox.validate(mick, dataset.filters, "OR");

		assert.ok( resp1, "Validate returned correct value" );
		assert.ok( resp2, "Validate returned correct value" );
		assert.ok( !resp3, "Validate returned correct value" );

	});

	QUnit.test( "Test mapData with request", function( assert ) {

		//
		var data = {
			"results": [
				{name: "James", job: "Techie", hobbies: ["Cycling","Movies"]},
				{name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]},
				{name: "Mick", job: "Sales", hobbies: ["Reading","Running"]},
			]
		};

		// options just needs to be empty, so we can get searchBox.active_filters
		var searchBox = new SearchBox({
			datasets: {
				results: {
					request: {
						__searchBox_response: data,
					},
					mapData: function(data) {
						return data.results;
					},
					renderer: function(data) {
						assert.ok( data.length === 3, "Results is correct length" );
					}
				}
			}
		});

		searchBox.request();

	});

	QUnit.test( "Test events and rendering function calls", function( assert ) {

		var eventsFired = {
			requesting: 0,
			requested: 0,
			rendering: 0,
			rendered: 0,

			// these aren't events, but just to track how many times renderers are called
			suggest_renderer: 0,
			results_renderer: 0
		};

		//
		var suggestData = ["arts", "art", "article"];

		//
		var resultsData = [
			{name: "James", job: "Techie", hobbies: ["Cycling","Movies"]},
			{name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]},
			{name: "Mick", job: "Sales", hobbies: ["Reading","Running"]},
		];

		// even though this searchBox has multiple datasets, events should only fire once
		var searchBox = new SearchBox({
			datasets: {
				suggest: {
					request: {
						__searchBox_response: suggestData,
					},
					renderer: function(data) {
						eventsFired.suggest_renderer++;
					}
				},
				results: {
					request: {
						__searchBox_response: resultsData,
					},
					renderer: function(data) {
						eventsFired.results_renderer++;
					}
				}
			}
		});

		searchBox.on("search:requesting", function(options) {
			eventsFired.requesting++;
		});

		searchBox.on("search:requested", function(options) {
			eventsFired.requested++;
		});

		searchBox.on("search:rendering", function(options) {
			eventsFired.rendering++;
		});

		searchBox.on("search:rendered", function(options) {
			eventsFired.rendered++;
		});

		searchBox.request();

		// assertions
		assert.ok( eventsFired.requesting === 1, "Requesting event fired only once" );
		assert.ok( eventsFired.requested === 1, "Requested event fired only once" );
		assert.ok( eventsFired.rendering === 1, "Rendering event fired only once" );
		assert.ok( eventsFired.rendered === 1, "Rendered event fired only once" );

		assert.ok( eventsFired.suggest_renderer === 1, "Suggest renderer fired only once" );
		assert.ok( eventsFired.results_renderer === 1, "Results renderer fired only once" );

	});

	QUnit.test( "Test filtered events", function( assert ) {

		var eventsFired = {
			filters_updated: 0,
		};

		// just need an empty SearchBox
		var searchBox = new SearchBox({
			// datasets: {
			// 	results: {
			// 		renderer: function(data) {
			//
			// 		}
			// 	}
			// }
		});

		searchBox.on("filters:updated", function(options) {
			eventsFired.filters_updated++;
		});

		searchBox.active_filters.add("filterName", "filterValue");

		// assertions
		assert.equal( eventsFired.filters_updated, 1, "Requesting event fired only once" );

	});

	QUnit.test( "Test custom events and trigger", function( assert ) {

		var value1, value2, value3;

		// just need an empty SearchBox
		var searchBox = new SearchBox({
			// datasets: {
			// 	results: {
			// 		renderer: function(data) {
			//
			// 		}
			// 	}
			// }
		});

		searchBox.on("custom_event", function(arg1, arg2, arg3) {
			value1 = arg1;
			value2 = arg2;
			value3 = arg3;
		});

		var argsArray = [1.1, "hello"];

		searchBox.trigger("custom_event", argsArray);

		// assertions
		assert.equal( value1, argsArray[0], "Custom event argument 1 ok" );
		assert.equal( value2, argsArray[1], "Custom event argument 2 ok" );
		assert.equal( typeof value3, "undefined", "Custom event argument 3 ok" );

	});

	QUnit.test( "Test off clears filters", function( assert ) {

		var flag1 = true;
		var flag2 = true;

		// just need an empty SearchBox
		var searchBox = new SearchBox();

		searchBox.on("custom_event", function() {
			flag1 = false;
		});

		searchBox.on("custom_event", function() {
			flag2 = false;
		});

		// clear those events
		searchBox.off("custom_event");

		searchBox.trigger("custom_event");

		// assertions
		assert.ok(flag1, "Event did not trigger" );
		assert.ok(flag2, "Event did not trigger" );

	});

	QUnit.test( "Test sortObjectKeys", function( assert ) {

		// even though this searchBox has multiple datasets, events should only fire once
		var searchBox = new SearchBox();

		var ordered = searchBox.sortObjectKeys({
			z: 1,
			c: "hello",
			f: false,
			m: null
		});

		assert.ok( JSON.stringify( Object.keys(ordered) ) === '["c","f","m","z"]', "Object keys in correct order" );

	});

	QUnit.test( "Test generateQueryChecksum", function( assert ) {

		// even though this searchBox has multiple datasets, events should only fire once
		var searchBox = new SearchBox();

		var query = {
			z: 1,
			c: "hello",
			f: false,
			m: null
		};

		var cache_id = searchBox.generateQueryChecksum(query);

		assert.ok( cache_id === '{"c":"hello","f":false,"m":null,"z":1}', "Object keys in correct order" );

	});

});
