// QUnit.test( "hello test", function( assert ) {
// 	assert.ok( 1 == "1", "Passed!" );
// });

$(function() {

	QUnit.test( "Step 1. Option open_at on init shows home menu", function( assert ) {

		$(".slidemenu").slidemenu({
			scroll_to: false,
			auto_adjust_height: false,
			open_at: $(".slidemenu li a[href='/']:first")[0]
		});

		var $currentMenu = $(".slidemenu__current");
		var $link = $currentMenu.prev("a");

		// check correct menu from the head link's text
		assert.ok( "Home" === $link.html(), "Passed!" );

		// as this is the top level, we'll be checking for a home link
		assert.equal( $currentMenu.children("li.slidemenu__home-link").length, 1, "Has a title" );

		assert.equal( $currentMenu.children("li.slidemenu__back-links").length, 0, "Has zero back links" );
		assert.equal( $currentMenu.children("li.slidemenu__goto").length, 1, "Has a goto" );


		QUnit.test( "Step 2. Menu 1 (down) shows correct menu", function( assert ) {

			$(".slidemenu__current").find("a[href='/menu1']").click();

			var $currentMenu = $(".slidemenu__current");
			var $link = $currentMenu.prev("a");

			// check correct menu from the head link's text
			assert.ok( "Menu 1" === $link.html(), "Has correct link text" );
			assert.equal( $currentMenu.children("li.slidemenu__title").length, 1, "Has a title" );
			assert.equal( $currentMenu.children("li.slidemenu__back").length, 1, "Has a back link" );
			assert.equal( $currentMenu.children("li.slidemenu__goto").length, 1, "Has a goto" );


			QUnit.test( "Step 3. Sub Menu 4 (down) shows correct menu", function( assert ) {

				$(".slidemenu__current").find("a[href='/menu1/sub-menu4']").click();

				var $currentMenu = $(".slidemenu__current");
				var $link = $currentMenu.prev("a");

				// check correct menu from the head link's text
				assert.ok( "Sub Menu 4" === $link.html(), "Has correct link text" );
				assert.equal( $currentMenu.children("li.slidemenu__title").length, 1, "Has a title" );
				assert.equal( $currentMenu.children("li.slidemenu__back").length, 2, "Has two back links" );
				assert.equal( $currentMenu.children("li.slidemenu__goto").length, 1, "Has a goto" );

				QUnit.test( "Step 4. Menu 1 (up) shows correct menu", function( assert ) {

					// click the back link, not the original link (outside current menu)
					$(".slidemenu__current .slidemenu__back:nth-child(2) a:first").click();

					var $currentMenu = $(".slidemenu__current");
					var $link = $currentMenu.prev("a");

					// check correct menu from the head link's text
					assert.ok( "Menu 1" === $link.html(), "Has correct link text" );
					assert.equal( $currentMenu.children("li.slidemenu__title").length, 1, "Has a title" );
					assert.equal( $currentMenu.children("li.slidemenu__back").length, 1, "Has a back link" );
					assert.equal( $currentMenu.children("li.slidemenu__goto").length, 1, "Has a goto" );

				});

			});

		});

	});

})
