$(function() {

    QUnit.test( "Test get method", function( assert ) {

        var level = QueryParams.get("level", null, "wwww.example.com?level=UG");
        assert.equal(level, "UG", "Get correct value" );

        var subject = QueryParams.get("subject", null, "wwww.example.com?subject=history&level=UG");
        assert.equal(subject, "history", "Get correct value" );

    });

    QUnit.test( "Test getAll method", function( assert ) {

        var params = QueryParams.getAll("?level=UG&subject=history");
        
        assert.ok(typeof params === "object", "GetAll correct value" );
        assert.equal(params["level"], "UG", "GetAll correct value" );
        assert.equal(params["subject"], "history", "GetAll correct value" );

    });

    QUnit.test( "Test set method", function( assert ) {

        // level=UG
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") > -1) , "Set correct value" );
        });
        QueryParams.set("level", "UG", false, "");

        // level=UG -> level=PG
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=PG") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("level=UG") === -1) , "Set correct value" ); // has been overwritten
        });
        QueryParams.set("level", "PG", false, "?level=UG");

        // level=PG -> level=UG&subject=history
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=PG") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("subject=history") > -1) , "Set correct value" );
        });
        QueryParams.set("subject", "history", false, "?level=PG");

    });

    QUnit.test( "Test remove method", function( assert ) {

        // attempt to remove existing param
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") === -1) , "Remove correct value" );
        });
        QueryParams.remove("level", false, "http://www.example.com?level=UG");

        // attempt to remove a param that doesn't exist
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") > -1) , "Remove correct value" );
        });
        QueryParams.remove("subject", false, "http://www.example.com?level=UG");

        // attempt to remove param from multiple params
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") === -1) , "Remove correct value" );
            assert.ok( (url.indexOf("subject=history") > -1) , "Remove correct value" );
        });
        QueryParams.remove("level", false, "http://www.example.com?level=UG&subject=history");

    });

    QUnit.test( "Test set method with multiple name/values", function( assert ) {

        // set level=UG, subject=history
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("subject=history") > -1) , "Set correct value" );
        });
        QueryParams.set({
            "level": "UG",
            "subject": "history"
        }, null, false, "");

        // set level=UG, subject=arts (overwrite)
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("subject=arts") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("subject=history") === -1) , "Set correct value" );
        });
        QueryParams.set({
            "level": "UG",
            "subject": "arts"
        }, null, false, "");

        // set level=UG, subject=history alongside existing query params
        QueryParams.setPushStateHandler(function(url) {
            assert.ok( (url.indexOf("level=UG") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("subject=history") > -1) , "Set correct value" );
            assert.ok( (url.indexOf("year=2018") > -1) , "Set correct value" );
        });
        QueryParams.set({
            "level": "UG",
            "subject": "history"
        }, null, false, "?year=2018");

    });

})
