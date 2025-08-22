//var stir = stir || {};


/**
 * Course-specific search results helper
 */
stir.courses = (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

	/**
	 * C L E A R I N G
	 */
	const CLEARING = true; // set TRUE if Clearing is OPEN; otherwise FALSE
	/*
	 **/

	return {
		clearing: CLEARING,
		getCombos: () => {
			if (stir.courses.combos) return;

			const urls = {
				dev: "combo.json",
				qa: "combo.json",
				preview: stir?.t4Globals?.search?.combos || "",
				prod: "https://www.stir.ac.uk/media/stirling/feeds/combo.json",
			};

			debug && console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${urls[UoS_env.name]})`);
			return stir.getJSON(urls[UoS_env.name], (data) => (stir.courses.combos = data && !data.error ? data.slice(0, -1) : []));
		},
		showCombosFor: (url) => {
			if (!url || !stir.courses.combos) return [];

			let pathname = isNaN(url) && new URL(url).pathname;
			let combos = [];

			for (var i = 0; i < stir.courses.combos.length; i++) {
				for (var j = 0; j < stir.courses.combos[i].courses.length; j++) {
					if ((pathname && pathname === stir.courses.combos[i].courses[j].url) || stir.courses.combos[i].courses[j].url.split("/").slice(-1) == url) {
						let combo = stir.clone(stir.courses.combos[i]);
						combo.courses.splice(j, 1); // remove matching entry
						combo.courses = combo.courses.filter((item) => item.text); // filter out empties
						combos.push(combo);
						break;
					}
				}
			}

			return combos;
		},
		favsUrl: (function () {
			switch (UoS_env.name) {
				case "dev": //local
					return "/pages/search/course-favs/index.html";
				case "qa": //repo
					return "/stirling/pages/search/course-favs/";
				default: //cms
					return '<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />';
			}
		})(),
	};
})();


stir.courses.startdates = function () {

	const date_elements = Array.prototype.slice.call(document.querySelectorAll('[name="f.Start date|startval"]'));
	if (!date_elements || 0 === date_elements.length) return;

	const months = [,"January", , , , , , , ,"September", , ,];
	//	const months = [, "January","February","March","April","May","June","July","August","September","October","November","December"];


	const regex = new RegExp(/\d\d\d\d/);
	const ay = new RegExp(/AY\d\d\d\d\D\d\d/i);
	const delim = new RegExp(/ay/i);
	const dates = date_elements.map((date) => {
		return {
			data: date.value,
			date: date.value.replace(ay, ""),
			month: date.value.indexOf("-") > -1 ? months[parseInt(date.value.split("-")[1])] || "" : "",
			year: date.value.match(regex) ? date.value.match(regex).shift() : "",
			acyear: date.value.match(ay) ? date.value.match(ay).shift().replace(delim, "") : "",
		};
	});
	const years = dates.map((date) => date.acyear.replace(delim, "")).filter((value, index, self) => self.indexOf(value) === index && value);

	console.info("Dates", dates)
	console.info("Years", years)

	const root = date_elements[0].parentElement.parentElement.parentElement;

	// remove checkboxes only if the years array is populated
	if (!years.length) return;
	date_elements.forEach((el) => {
		el.parentElement.parentElement.remove();
	});

	const DateInput = (type, name, value) => {
		const input = document.createElement("input");
		input.type = type;
		input.name = name;
		input.value = value;
		return input;
	};

	const DateLabel = (name, value) => {
		//<input type="radio" name="f.Start date|startval" value="2026-01ay2025-26">
		const input = DateInput("radio", "f.Start date|startval", `${value}`);
		const label = document.createElement("label");
		label.appendChild(input);
		label.appendChild(document.createTextNode(name));
		return label;
	};

	const picker = document.createElement("li");

	years.forEach((acyear) => {
		// Array: get all dates relevant to this academic year
		const thisyear = dates.filter((date) => date.acyear === acyear);

		// String: create a meta-search parameter of 'other' dates (i.e. neither Sept nor Jan)
		const other = thisyear
			.filter((date) => date.date.indexOf("-01") === -1 && date.date.indexOf("-09") === -1)
			.map((date) => date.data)
			.join(" ");

		// DOM: show heading
		const set = document.createElement("fieldset");
		const legend = document.createElement("legend");
		legend.classList.add("u-my-1", "text-xsm");

		set.appendChild(legend);
		set.setAttribute("class", "c-search-filters-subgroup");
		legend.innerText = `Academic year ${acyear}`;
		picker.appendChild(set);

		// DOM: show conventional start dates (Sept, Jan)
		thisyear
			.filter((date) => date.acyear === acyear) //&& (date.date.indexOf("-01") > -1 || date.date.indexOf("-09") > -1)
			.map((date) => {
				console.info(date);
				set.appendChild(DateLabel(`${date.month} ${date.year}`, date.data));
			});

		// DOM: lastly show 'other' dates
		//if (other.length) set.appendChild(DateLabel(`Other ${acyear}`, `${other}`));
	});

	root.appendChild(picker);
};
