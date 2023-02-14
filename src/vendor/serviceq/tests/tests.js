
$(function() {

	QUnit.test( "Test do() run in order", function( assert ) {

		var serviceQ = new UoS_ServiceQ({
			getCacheData: function() {
				return { "country": "Scotland" };
			}
		});

		var i = 0;

		serviceQ.do( function(data) {
			i++;
			assert.ok( i === 1, "do() run run run, a do() run run" );
        } );

		serviceQ.do( function(data) {
			i++;
			assert.ok( i === 2, "do() run run run, a do() run run" );
        } );

		serviceQ.do( function(data) {
			i++;
			assert.ok( i === 3, "do() run run run, a do() run run" );
        } );

	});

	QUnit.test( "Set alternative data getter", function( assert ) {

		var serviceQ = new UoS_ServiceQ({
			getCacheData: function() {
				return "hello";
			}
		});

		serviceQ.do( function(data) {
			assert.ok( data === "hello", "data fetched from alternative read" );
        } );

	});

});
