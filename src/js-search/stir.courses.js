//var stir = stir || {};


/**
 * Course-specific search results helper
 */
stir.courses = (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

	/**
	 * C L E A R I N G
	 */
	const CLEARING = false; // set TRUE if Clearing is OPEN; otherwise FALSE
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

	const months = [, "January","February","March","April","May","June","July","August","September","October","November","December"];
	const strings = {
		'other': "Other",
		'1st-every-month': "First day of any month"
	};

	const match = new RegExp(/\d{4}-\d{2}ay\d{4}\D\d{2}/i)
	const regex = new RegExp(/\d{4}/);
	const ay = new RegExp(/ay\d{4}\D\d{2}/i);
	const delim = new RegExp(/ay/i);
	const dates = date_elements
		.filter(date => date.value.match(match))
		.map((date) => {
			return {
				data: date.value,
				date: date.value.replace(ay, ""),
				month: date.value.indexOf("-") > -1 ? months[parseInt(date.value.split("-")[1])] || "" : "",
				year: date.value.match(regex) ? date.value.match(regex).shift() : "",
				acyear: date.value.match(ay) ? date.value.match(ay).shift().replace(delim, "") : "",
				checked: date.checked
			};
		});
	const other = date_elements
		.filter(date => !date.value.match(match))
		.map(date => {
			console.info("OTHER!",date,strings[date.value]||date.value);
			return {
				label: strings[date.value]||date.value,
				value: date.value,
				checked: date.checked
			};
		});
	const years = dates.map((date) => date.acyear.replace(delim, "")).filter((value, index, self) => self.indexOf(value) === index && value);

	const root = date_elements[0].parentElement.parentElement.parentElement;

	// remove checkboxes only if the years (or "other") array is populated
	if (0===years.length+other.length) return;
	date_elements.forEach((el) => {
		el.parentElement.parentElement.remove();
	});

	const DateInput = (type, name, value, checked) => {
		const input = document.createElement("input");
		input.type = type;
		input.name = name;
		input.value = value;
		input.checked = checked
		return input;
	};

	const DateLabel = (name, value, checked) => {
		const input = DateInput("radio", "f.Start date|startval", `${value}`, checked);
		const label = document.createElement("label");
		label.appendChild(input);
		label.appendChild(document.createTextNode(name));
		return label;
		//e.g. <input type="radio" name="f.Start date|startval" value="2026-01ay2025-26">
	};

	const searchFilterSubgroup = (title,values=[]) => {
		const set = document.createElement("fieldset");
		const legend = document.createElement("legend");
		legend.classList.add("u-mb-tiny","text-xsm");
		set.appendChild(legend);
		set.classList.add("u-mb-1","c-search-filters-subgroup");
		legend.innerText = title;
		set.append(...values);
		return set;
	};

	const picker = document.createElement("li");

	// DOM: show start dates grouped into academic years
	years.forEach((acyear) => {
		const thisyear = dates.filter((date) => date.acyear === acyear);
		const values = thisyear
			.filter((date) => date.acyear === acyear)
			.map((date) => DateLabel(`${date.month} ${date.year}`, date.data, date.checked));
		picker.append( searchFilterSubgroup(`Academic year ${acyear}`,values) );
	});

	// DOM: lastly show 'other' dates
	if (other.length) picker.append(searchFilterSubgroup("Other", other.map(item => DateLabel(item.label,item.value,item.checked))));

	root.appendChild(picker);
};
