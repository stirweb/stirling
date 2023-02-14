
/**
 * Slide menu is a mobile drill down menu but also provides an intuitive way to
 * access menu page links. For example, if we drill down to Menu > Sub-menu 2 >
 * Deep menu 3 .. Deep menu 3 might have another level beyond but perhaps we want
 * to open this menu page instead of drilling down. This slide menu allows that
 * by putting the page link at the sub-menu links.
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>
 */

$(function() {

	// PRIVATE PROPERTIES

	/**
	 * @var {integer} z index as we always want the new menu item to appear on top
	 */
	var _z = 100000;

	/**
	 * @var {Array} Breadcrumb trail array. Contains menu element. Used to generate the
	 * breadcrumbs and track menus to retract when _bc link is clicked
	 * Initially it will always
	 */
	var _bc = [];

	/**
	 * @var {Object} Store event handlers
	 */
	var _event_handlers = {};

	/**
	 * @var {Object} Options stored from init
	 */
	var _init_options = {};

	/**
	 * @var {DOM} This is the root link stored during init
	 */
	var _root_link = null;


	// PRIVATE METHODS

	/**
	 * Open a given links menu, or it's parent if that $link has no submenus
	 *  however, if the link is an end point just go to that page
	 * @param {$element} $link The link to to push element from
	 * @param {object} options
	 */
	var _openAt = function($link, options) {

		// if no link found, break the switch (nothing to do)
		if(!$link.length) return;

		// if no submenus found, grab the parent link and proceed with that
		// TODO why do we do this? if no submenus, load the page they clicked
		if (!$link.next("ul").length) {
			$link = $link.closest("ul").prev("a").addClass("slidemenu__active-link");
			$link.parent("li").addClass("slidemenu__active");
		}

		var $childMenu = $link.next("ul");

		// cycle through each ul to build up the breadcrumb trail as it
		// would be if we were to drill our way down to that menu
		var $upLink = $link;
		var links = [];

		while($upLink.length && $upLink[0].href !== _root_link.href) {

			links.push($upLink);

			// move up one
			$upLink = $upLink.closest("ul").prev("a");

		}

		links.push($upLink);

		// breadcrumbs expects a reverse order from what we've built working backwards
		links.reverse();

		_bc = [];
		links.forEach(function($link) {

			var $childMenu = $link.next("ul");

			// add element to breadcrumb trail
			_bc.push({
				"text": $link.html(),
				"href": $link.attr("href"),
				"el": $link[0] // this will be the link to return to
			});

			// as we're pushing items into the breadcrumbs, we need to also prepare
			// each of those menus
			_renderBreadcrumbs($link, options);
			_renderDrilldowns($link, options);

			$childMenu.css("right", "0px");
			$childMenu.css("z-index", _z++);
		});

		_setCurrentMenu($link, options);
	}

	/**
	 * @param {string} text The original text of the link
	 * @param {string} pattern The pattern to replace it eg. "%s home"
	 * @param {object} options
	 */
	var _setCurrentMenu = function($link, options) {

		$("ul.slidemenu__current").removeClass("slidemenu__current");
		$link.next("ul").addClass("slidemenu__current");

		if (options.auto_scroll_to && $(options.auto_scroll_to).position()) {
			var titleTop = Math.floor( $(options.auto_scroll_to).position().top );

			if (typeof options.auto_scroll_animate !== "undefined" && options.auto_scroll_animate) {
				$(options.auto_scroll_container).animate({ scrollTop: titleTop + "px" });
			} else {
				$(options.auto_scroll_container).scrollTop(titleTop);
			}
		}

		_fireEvent("set_current_menu", [options, $link]);
	};

	/**
	 * @param {string} text The original text of the link
	 * @param {string} pattern The pattern to replace it eg. "%s home"
	 * @param {object} options
	 */
	var _renderLinkText = function(text, pattern, options) {

		// if pattern is a function, use that instead of String.replace
		switch (typeof pattern) {
			case "string":
				return pattern.replace("%s", text);
			case "function":
				return pattern(text);
		}

		return text;
	};

	/**
	 * @param {$} $link
	 * @param {object} options
	 */
	var _renderBreadcrumbs = function($link, options) {

		// var $link = $(this);
		var $childMenu = $link.next("ul");

		// check if this menu has been initiated yet. That is, has it been
		// provided with the breadcrumb <li> and overview trail yet. If so,
		// we can return coz it's already been done
		if ($($childMenu).data("has-breadcrumbs")) {
			return;
		}

		var $a, $li;

		// first, give all submenu links a class to identify them before we add
		// breadcrumb links
		$childMenu.find("> li").each( function(index, el) {
			$(el).addClass("slidemenu__subitem").find("> a").addClass("slidemenu__subitem-link");
		} );

		// for each item in _bc, output a back link. on the last one, create
		// as a link for the actual page of this menu (as the clicked link
		// serves as a drilldown, we still need some link to go to the page)
		// work backwards :)
		for (var i=(_bc.length-1); i>=0; i--) {

			// TODO repeat stuff here, dry it up

			if (i == (_bc.length-1)) { // last item

				// this is last item so we wanna actually go to page if clicked
				$a = $('<a href="' + _bc[i].href + '" class="slidemenu__bc-link slidemenu__goto-link">' + _renderLinkText(_bc[i].text, options.goto_text_format, options) + '</a>');

				// append the link, prepend the menu item
				$li = $('<li class="slidemenu__bc slidemenu__goto">').append($a);
				$childMenu.prepend( $li );

				// // the last item in the _bc trail will be the title
				// var last = _bc[ _bc.length-1 ];

				// if this is the top level, we'll make the Home text clickable
				if (_bc.length === 1) {
					$childMenu.prepend( '<li class="slidemenu__bc slidemenu__home-link"><a href="' + _bc[i].href + '">' + _renderLinkText(_bc[i].text, options.title_text_format, options) + '</a></li>' );
				} else {
					$childMenu.prepend( '<li class="slidemenu__bc slidemenu__title"><span>' + _renderLinkText(_bc[i].text, options.title_text_format, options) + '</span></li>' );
				}

				// $childMenu.prepend( '<li class="slidemenu__bc slidemenu__title"><span>' + _renderLinkText(_bc[i].text, options.title_text_format, options) + '</span></li>' );

			} else { // not last item

				// the purpose of this link will be to go back to previous menu,
				// no href required
				$a = $('<a href="#" class="slidemenu__bc slidemenu__back-link">' + _renderLinkText(_bc[i].text, options.back_text_format, options) + '</a>');

				// attach behaviour to link to go back
				// we need to create a closure so that it isolates `i` at its
				// current value (and not what its next increment)
				(function(i) {

					// `i` here is a local variable, and no longer of the for loop
					$a.on("click", function(e) {

						$link = $(this);

						_fireEvent("drilling", [options, $link]);
						_fireEvent("drilling_up", [options, $link]);

						// pop breadcrumbs until we are at the selected menu
						var removedItem, $removedMenu;
						do {
							$removedMenu = $( _bc.pop().el ).next("ul");
							// $removedMenu = removedItem.el;
							$removedMenu.css("right", "calc(100% + 10px)");
						} while ( i < (_bc.length-1));

						// set the current menu of the last bc item
						_setCurrentMenu( $(_bc[_bc.length-1].el), _init_options );

						_fireEvent("drilled_up", [options, $link]);
						_fireEvent("drilled", [options, $link]);

						e.preventDefault();
					});

				})(i);

				// append the link, prepend the menu item
				$li = $('<li class="slidemenu__bc slidemenu__back">').append($a);
				$childMenu.prepend( $li );
			}
		}

		// // adjust the height to full page size
		// // REMOVED 2nd March, replaced with adjust to largest menu, register an event in future
		// if (options.auto_adjust_height) {
		// 	$childMenu.css("height", $(document).height() + "px");
		// }

		// lastly, place a rendered flag so we can skip this process
		// should the user re-open this menu
		$childMenu.attr("data-has-breadcrumbs", "true");

	}

	/**
	 * @param {$} $link
	 * @param {object} options
	 */
	var _renderDrilldowns = function($link, options) {

		// var $link = $(this);
		var $childMenu = $link.next("ul");

		// check if this menu has been initiated yet. That is, has it been
		// provided with the breadcrumb <li> and overview trail yet. If so,
		// we can return coz it's already been done
		if ($($childMenu).data("has-drilldown")) {
			return;
		}

		// now, we wanna check each li item and see if it has a submenu
		// if so, we will give it a specific class
		$("> li", $childMenu).each(function(index, li) {
			if ( $(li).find("> ul").length ) { // has submenus
				$(this).addClass("slidemenu__has-submenu");
			}
		});

		// lastly, place a rendered flag so we can skip this process
		// should the user re-open this menu
		$childMenu.attr("data-has-drilldown", "true");
	}

	/**
	 * Fire events when they happen and receive params specific to that event
	 * @param {string} name Name of event e.g. "initiating"
 	 * @param {object} args Arguments as an object specific to this event
	 */
	var _fireEvent = function(name, args) {

		// ignore if no handlers registered for this event, otherwise go though
		// each event handler and call
		!_event_handlers[name] || _event_handlers[name].forEach(function(handler) {
			handler.apply(null, args); // func.apply(thisArg, [argsArray])
		})
	}

	/**
	 * Slide menu is a mobile drilldown menu but also provides an intuative
	 * way to access menu page links. For example, if we drill down to Menu >
	 * Sub-menu 2 > Deep menu 3 .. Deep menu 3 might have another level beyond
	 * but perhaps we want to open this menu page instead of drilling down.
	 * This slide menu allows that by putting the page link at the sub-menu links.
	 */
	$.fn.slidemenu = function(method, options) {

		// if method is not a string, then we can assume it's "init" and the first
		// argument is its options.
		if (typeof method !== "string") {
			options = method;
			method = "init";
		}

		// methods
		switch (method) {
			case "register_event_handler":

				if (_event_handlers[options.event] === undefined) {
					_event_handlers[options.event] = [];
				}

				_event_handlers[options.event].push(options.callback.bind(this));

				break;

			case "init":

				// Default options for this method, store in _init_options coz
				// we might use these for the duration of the slide menu's lifetime
				_init_options = $.extend(true, {
					// auto_adjust_height: true,
					auto_scroll_to: null,
					open_at: $(this).find("a:first")[0]
				}, options);

				// // if we store the options now we have the option of overriding
				// // them when we want a slightly different behaviour (e.g. on init
				// // we don't wanna scroll even if set to do so)
				// _init_options = $.extend(true, {}, options);

				_fireEvent("initiating", [options]);

				// store root_href so we can detect when we have reached the top
				// for later use in e.g. "open" method
				_root_link = $("a:first", this)[0];

				// As these links are only existing links on load, they don't include
				// the _goto and _back links yet so we can assume that this click
				// event is only for drilling down
				$("a", this).on("click", function(e) {

					var $link = $(this);

					// if link has no submenu items then we don't use javascript
					// neither will we bother with events (e.g. drilling_down)
					if ( !$link.closest("li").hasClass("slidemenu__has-submenu") ) {
						return true;
					}

					_fireEvent("drilling", [ _init_options, $link ]);
					_fireEvent("drilling_down", [ _init_options, $link ]);

					_openAt($link, _init_options);

					_fireEvent("drilled_down", [ _init_options, $link ]);
					_fireEvent("drilled", [ _init_options, $link ]);

					e.preventDefault();

				});

				// create the initial "Home" breadcrumb trail
				// by declaring this after the on("click") for links, it won't get the
				// breadcrumb behaviour - which is how we want it anyway
				_renderDrilldowns( $(this), _init_options );

				_fireEvent("initiated", [_init_options]);

				// open root (or wherever open_at is set to )
				_openAt( $(_init_options.open_at), $.extend(true, {}, _init_options, {
					auto_scroll_to: null, // override scroll here
				}) );

				break;

		}
	};
});
