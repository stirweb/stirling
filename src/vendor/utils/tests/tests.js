
$(function() {

	QUnit.test( "Test whitelistObjectKeys", function( assert ) {

		var obj = {
			"red": "wine",
			"black": "ink",
			"green": "leaves"
		}

		var newObj = UoS_Utils.whitelistObjectKeys(obj, ["red", "green"]);

		assert.ok( Object.keys(newObj).length === 2, "Object has correct length of keys" );
		assert.ok( newObj.red === "wine", "Key has correct value" );
		assert.ok( newObj.green === "leaves", "Key has correct value" );
		assert.ok( typeof newObj.black === "undefined", "Key has correct value" );

	});

	QUnit.test( "Test blacklistObjectKeys", function( assert ) {

		var obj = {
			"red": "wine",
			"black": "ink",
			"green": "leaves"
		}

		var newObj = UoS_Utils.blacklistObjectKeys(obj, ["red", "green"]);

		assert.ok( Object.keys(newObj).length === 1, "Object has correct length of keys" );
		assert.ok( typeof newObj.red === "undefined", "Key has correct value" );
		assert.ok( typeof newObj.green === "undefined", "Key has correct value" );
		assert.ok( newObj.black === "ink", "Key has correct value" );

	});

});
