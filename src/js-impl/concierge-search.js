/**
 * HEADER CONCIERGE SEARCH ver 4.0
 * @author: Ryan Kaye <ryan.kaye@stir.ac.uk>, Robert Morrison <r.w.morrison@stir.ac.uk>
 */

// we will add some new modules to the stir library
var stir = stir || {};

/**
 * Concierge
 * Instantiated below with `new stir.Concierge();`
 */
stir.Concierge = function Concierge(popup) {
		
	if(!stir.addSearch) return;
		
	const button = document.querySelector("#header-search__button");
	const buttons = [...document.querySelectorAll(".header-search-button"), ...[button]];

	if (!popup || !buttons.length) return;

	// var obj2param = this.obj2param;

	// DOM elements
	const nodes = {
		overlay: popup.querySelector(".overlay"),
		input: popup.querySelector('input[name="query"],input[name="term"]'),
		submit: popup.querySelector("button"),
		wrapper: popup.querySelector("#header-search__wrapper"),
		news: popup.querySelector(".c-header-search__news"),
		courses: popup.querySelector(".c-header-search__courses"),
		all: popup.querySelector(".c-header-search__all"),
		suggestions: popup.querySelector(".c-header-search__suggestions"),
	};

	const courseUrl = "https://www.stir.ac.uk/courses/";
	const searchUrl = "https://www.stir.ac.uk/search/";

	var search, results, spinner; // dynamic view managers
	var prevQuery = "";
	const keyUpTime = 400; // milliseconds; keystroke idle time, i.e. stopped typing
	const minQueryLength = 3; // min query length for activating the suggest box

	// Init IIFE 
	(function init() {
		search  = new stir.ToggleWidget(popup, "stir__fadeIn", "stir__fadeOut");
		results = new stir.ToggleWidget(nodes.wrapper, "stir__slidedown", "stir__slideup");
		spinner = new stir.Spinner(nodes.input.parentElement);
		spinner.element.classList.add("c-search-loading__spinner-small");

		// hide the results panel (no results to show yet)
		results.hide();

		// Assign various event handlers
		buttons.forEach((openButton) => {
			openButton.addEventListener("click", opening);
		});

		nodes.input.addEventListener("focus", focusing);
		nodes.input.addEventListener("keyup", stir.debounce(handleInput, keyUpTime));

		popup.addEventListener("click", function (event) {
			// trap all clicks _except_ those on the overlay
			if (event.target !== nodes.overlay) {
				event.stopPropagation();
			}
		});
	})();
	
	const renderSuggestions = parseSuggestions.bind(nodes.suggestions);

	//  H E L P E R   F U N C T I O N S

	function doSearches(query) {
		stir.addSearch.getSuggestions(query, renderSuggestions);
	}

	// R E N D E R E R S

	function render(label, data) {
		if (this.nodeType !== 1) return;
		this.innerHTML = renderHeading(label.heading, label.icon) + "<ul>" + renderBody(label, data) + "</ul>";
	}

	const renderHeading = (title, icon) => {
		return `
				<h3 class="c-header-search__title header-stripped">
					<span class="${icon}"></span> 
					${title}
				</h3>`;
	};

	const renderBody = (label, data) => (data.length > 0 ? data.join("") : renderGenericItem(label.none));

	const renderGenericItem = (text) => `<li class="c-header-search__item">${text}</li>`;

	const renderAllItem = (item) => {
		return `
			<li class="c-header-search__item">
				<a href="${item.url}">${item.title.split(" | ")[0]}</a>
			</li>`;
	};

	const renderCourseItem = (item) => {
		const title = item.title.split(" | ")[0];
		const award = item.custom_fields.award ? item.custom_fields.award + " ": "";
		return `
			<li class="c-header-search__item">
				<a href="${item.url}">${award}${title}</a>
			</li>`;
	};

	const renderSuggestItem = (suggest) => {
		return `
			<li class="c-header-search__item">
				<a href="${searchUrl}?query=${suggest}">${suggest}</a>
			</li>`;
	};

	// P A R S I N G

	function parseSuggestions(suggests) {
		suggests = suggests.suggestions.map(item => item.value);
		const max = 5;

		if (suggests.length > 0) {
			stir.addSearch.getResults({term:suggests.join(", "), collectAnalytics:false, defaultOperator:"or", fuzzy:"auto"})
				.then(response => response.json())
				.then(parseResults)
				.catch(e=>console.error(e));
				
			const suggestsUnique = suggests.filter((c, index) => suggests.indexOf(c) === index);
			const suggestsLtd = stir.filter((item, index) => index < max, suggestsUnique);

			render.call(nodes.suggestions, { heading: "Suggestions", none: "No suggestions found", icon: "uos-magnifying-glass" }, suggestsLtd.map(renderSuggestItem));
		} else {
			// no suggests so use the raw inputted query to perform the search
		stir.addSearch.getResults({term:prevQuery, collectAnalytics:false})
		.then(response => response.json())
		.then(parseResults)
		.catch(e=>console.error(e));

			render.call(nodes.suggestions, { heading: "Suggestions", none: "No suggestions found", icon: "uos-magnifying-glass" }, []);
		}

		spinner.hide();
		results.show();
	}

	function parseResults(data) {
		const max = 4;
		const obj = data.hits;

		if (data.total_hits > 0) {
			const coursesHtml = stir.compose(
				stir.map(renderCourseItem),
				stir.filter((item, index) => index < max),
				stir.filter((item) => item.url.includes(courseUrl))
			)(obj);

			const allHtml = stir.compose(
				stir.map(renderAllItem),
				stir.filter((item, index) => index < max),
				stir.filter((item) => !item.url.includes(courseUrl))
			)(obj);

			render.call(nodes.news, { heading: "All pages", none: "No results found", icon: "uos-all-tab" }, allHtml);
			render.call(nodes.courses, { heading: "Courses", none: "No courses found", icon: "uos-course-tab" }, coursesHtml);
		} else {
			render.call(nodes.news, { heading: "All pages", none: "No results found", icon: "uos-all-tab" }, []);
			render.call(nodes.courses, { heading: "Courses", none: "No courses found", icon: "uos-course-tab" }, []);
		}
	}

	// E V E N T   H A N D L E R   F U N C T I O N S

	function handleInput(event) {
		if (this.value != prevQuery) {
			results.hide();
			if (this.value.length >= minQueryLength || this.value==="*") {
				spinner.show();
				doSearches(this.value);
				prevQuery = this.value;
			} else {
				spinner.hide();
				results.hide();
				prevQuery = "";
			}
		}
	}
	/**
	 * If the search receives focus, also reopen the
	 * results-panel if there are results to display.
	 **/
	function focusing(event) {
		if (this.value !== "" && results.hidden()) {
			results.show();
			spinner.hide();
		}
		//UoS_closeAllWidgetsExcept('headerSearch');
	}
	/*
	 * Search icon in the header. Clicking it should open the big search input
	 */
	function opening(event) {
		if (search.hidden()) {
			search.show();
			nodes.input.focus();
			nodes.input.removeAttribute("tabindex");
			nodes.submit.removeAttribute("tabindex");
		}

		// we don't want both search boxes visible at the same time. So we
		// tell this box to hide the other when active, and vice versa
		UoS_closeAllWidgetsExcept("headerSearch");

		// while the search is open, listen for keystrokes and close requests:
		document.addEventListener("keyup", escaping);
		document.addEventListener("focusin", focusouting);
		document.addEventListener("widgetRequestClose", closing);

		event.stopPropagation(); // prevent triggering the closeWidget listener on body
		event.preventDefault();
	}
	/**
	 * When overlay is clicked, hide the header search panel
	 **/
	function closing(event) {
		results.hide();
		search.hide();
		nodes.input.setAttribute("tabindex", "-1");
		nodes.submit.setAttribute("tabindex", "-1");

		// when the search is closed, stop listening for keystrokes and close requests:
		document.removeEventListener("keyup", escaping);
		document.removeEventListener("focusin", focusouting);
		document.removeEventListener("widgetRequestClose", closing);
	}

	function focusouting(event) {
		if (!popup.contains || !event.target) return; // IE won't support Node.contains()
		if (!popup.contains(event.target)) closing(event);
	}

	function escaping(event) {
		if ('Escape' === event.code) closing(event);
	}
};

(function () {
	if(!window.fetch) return;
	new stir.Concierge(document.getElementById("header-search"));
})();
