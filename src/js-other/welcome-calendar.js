(function (scope) {
  if (!scope) return;

  const filtersArea = stir.node("#welcomeeventfilters");

  /*
    | 
    |  RENDERERS
    |
    */

  const renderEvent = (item) => {
    console.log(item);
    return `<div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
				<div class="cell u-p-2 small-12  ">
					
					<p class="u-text-regular u-mb-2">
					<strong>${item.title}</strong>
					</p>
					<div class="flex-container flex-dir-column u-gap-8 u-mb-1">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span><time>${item.stirStart}</time></span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span><time>${item.startTime}</time> – <time>${item.endTime}</time></span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-location"></span>
							<span>${item.location}</span>
						</div>
						
					<!-- div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-discounts"></span><a href="${item.link}">Booking required</a></ -->
					</div>
					<p class="text-sm">${item.description}</p>
					<p class="u-m-0 text-sm">Theme: ${item.theme} <br />Attendance: ${item.attendance}</p>
				</div>
			</div>`;
  };

  const renderDateFilter = (item) => {
    return `<option value="${item.startInt}">${item.stirStart}</option>`;
  };

  const renderThemeFilter = (item) => {
    return `<option value="${item.theme}">${item.theme}</option>`;
  };

  const renderSelectFilter = (html, title) => {
    return `<select id="${title.toLowerCase().replaceAll(" ", "-")}"><option value="">${title}</option>${html}</select>`;
  };

  const renderNoEvents = () => {
    return `<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
				<div class="cell u-p-2 small-12  ">
					<p>No events have been found for the criteria selected</p>
				</div>
			</div>`;
  };

  /*
    | 
    |  HELPERS
    |
    */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const setDOMEvents = setDOMContent(scope);

  const setDOMDateFilter = setDOMContent(filtersArea);

  const joiner = stir.join("");

  const sortByStartDate = (a, b) => a.startInt - b.startInt;

  //const sortByStartDateDesc = (a, b) => b.startInt - a.startInt;

  const mapDates = (item) => {
    return { startInt: item.startInt, stirStart: item.stirStart };
  };

  const mapTheme = (item) => {
    return { theme: item.theme };
  };

  const filterThemeEmpties = (item) => item.theme;

  const removeDuplicateObjectFromArray = stir.curry((key, array) => {
    let check = {};
    let res = [];
    for (let i = 0; i < array.length; i++) {
      if (!check[array[i][key]]) {
        check[array[i][key]] = true;
        res.push(array[i]);
      }
    }
    return res;
  });

  const filterByDate = stir.curry((date, item) => {
    if (!date) return true;
    return item.startInt === Number(date);
  });

  const filterByTheme = stir.curry((theme, item) => {
    if (!theme) return true;
    return item.theme === theme;
  });

  /*
    | 
    |  ON LOAD
    |
    */

  /* 
  	Welcome Events 
   */
  const initData = stir.feeds.events.filter((item) => item.id);

  console.log(initData);

  /* 
  	Filters 
  */
  const removeDateDups = removeDuplicateObjectFromArray("startInt");
  const datesHtml = stir.compose(joiner, stir.map(renderDateFilter), removeDateDups, stir.map(mapDates), stir.sort(sortByStartDate))(initData);

  const removeFilterDups = removeDuplicateObjectFromArray("theme");
  const themesHtml = stir.compose(joiner, stir.map(renderThemeFilter), removeFilterDups, stir.filter(filterThemeEmpties), stir.map(mapTheme))(initData);

  setDOMDateFilter(renderSelectFilter(datesHtml, "Filter by date") + renderSelectFilter(themesHtml, "Filter by theme"));

  /* 
  	CONTROLLER 
  */
  const doEventsFilter = (date, theme, data) => {
    const filterByDateCurry = filterByDate(date);
    const filterByThemeCurry = filterByTheme(theme);

    const html = stir.compose(joiner, stir.map(renderEvent), stir.filter(filterByThemeCurry), stir.filter(filterByDateCurry), stir.sort(sortByStartDate))(data);

    html.length ? setDOMEvents(html) : setDOMEvents(renderNoEvents());
  };

  doEventsFilter("", "", initData);

  /* 
  	EVENT LISTENER 
  */
  filtersArea.addEventListener("click", (event) => {
    if (event.target.nodeName === "OPTION") {
      const dateFilter = stir.node("#filter-by-date");
      const themeFilter = stir.node("#filter-by-theme");

      doEventsFilter(dateFilter.options[dateFilter.selectedIndex].value, themeFilter.options[themeFilter.selectedIndex].value, initData);
    }
  });
})(stir.node("#welcomeevents"));

/*








(function () {

	var calendar = document.querySelector('.c-welcome-calendar');
	if (!calendar) return;
  
	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];


	var startDate = calendar.getAttribute('data-start') ? new Date(calendar.getAttribute('data-start')):null;
	var endDate = calendar.getAttribute('data-end') ? new Date(calendar.getAttribute('data-end')):null;

	var groups = ['first', 'second', 'third', 'fourth'];
	var audience = calendar.getAttribute('data-audience');

	var eventElements = Array.prototype.slice.call(calendar.querySelectorAll('.h-event'));
	var timeElements  = Array.prototype.slice.call(calendar.querySelectorAll('time'));

	var dateSelectElement = document.createElement("select");
	var groupSelectElement = document.createElement("select");
	
	var dates  = [];

	var today = new Date(Date.now());		// get a reference to "now"
	today.setHours(0);						// and set the clock back to 
	today.setMinutes(0);					// midnight so we can catch
	today.setSeconds(0);					// all events running today
	today.setMilliseconds(0);				// (or thereafter).

	const early = event => (startDate ? (new Date(event.getAttribute('data-date')))>startDate : true);
	const late  = event => (endDate ? (new Date(event.getAttribute('data-date')))<endDate : true);
	const expired = event => new Date(event.getAttribute('data-date')) >= today;

	const datesort = (a, b) => {
		if (a.getAttribute('data-date') < b.getAttribute('data-date')) return -1;
		if (a.getAttribute('data-date') > b.getAttribute('data-date')) return 1;
		return 0; // a must be equal to b
	};

	const addback = event => {
		dates.push(event.getAttribute('data-date'));
		calendar.appendChild(event)
	}

	// remove all h-events from the DOM:
	eventElements.forEach(event => event.remove());

	// filter, sort and then add them back:
	eventElements.sort(datesort).filter(early).filter(late).filter(expired).forEach(addback);
	
	// dates for the <select> should be unique
	dates = dates.filter(onlyUnique);
	
	// clean up some formatting:
	timeElements.forEach(element => element.innerText = element.innerText.replace(':00', ''));
	

	if(dates.length>1) {
		var option = document.createElement('option');
		option.value = '';
		option.innerText = 'All dates';
		dateSelectElement.id = 'dateSelectElement';
		dateSelectElement.appendChild(option);
		for(var i=0;i<dates.length;i++) {
			var option = document.createElement('option');
			var date = new Date(dates[i]);
			option.value = dates[i]
			option.innerText = `${("0"+date.getUTCDate()).slice(-2)} ${months[date.getUTCMonth()]} ${date.getFullYear()}`;
			dateSelectElement.appendChild(option);
		}
		calendar.insertAdjacentElement("beforebegin", dateSelectElement);
		dateSelectElement.insertAdjacentHTML("beforebegin", '<label for="dateSelectElement">Filter events by date:</label>');
		dateSelectElement.addEventListener("change", overallEventHandler);
	}

	if(audience!="pg" && groups.length>1) {
		var option = document.createElement('option');
		option.value = '';
		option.innerText = 'All year groups';
		groupSelectElement.id = 'groupSelectElement';
		groupSelectElement.appendChild(option);
		for(var i=0;i<4;i++) {
			var option = document.createElement('option');
			option.innerText = groups[i] + " year";
			option.value = (i+1);
			groupSelectElement.appendChild(option);
		}
		calendar.insertAdjacentElement("beforebegin", groupSelectElement);
		groupSelectElement.insertAdjacentHTML("beforebegin", '<label for="groupSelectElement">Filter events by year group:</label>');
		groupSelectElement.addEventListener("change", overallEventHandler);
	}

	if(groups.length>1 || dates.length>1) {
		var button = document.createElement('button');
		button.type = 'reset'
		button.setAttribute('class','button');
		button.textContent = 'Reset (show all events)';

		calendar.insertAdjacentElement("afterend", button);

		button.addEventListener("click", function() {
			showAll();
			dateSelectElement.selectedIndex = groupSelectElement.selectedIndex = 0;
			stir.scrollToElement(dateSelectElement, 32);
		});
	}
	
	if(audience=="pg") {
		Array.prototype.forEach.call(calendar.querySelectorAll('.p-yeargroup'), function(element) {
			element.parentNode.removeChild(element);
		});
	}


	function overallEventHandler() {
		showAll();
		hideDeselectedElements(getDateSelector() + getGroupSelector());
	}

	function showAll() {
		eventElements.forEach(function(element) {
			element.classList && element.classList.remove('ejecta');
		});
	}

	function hideDeselectedElements(selector) {
		var elements = selector ? Array.prototype.slice.call(calendar.querySelectorAll(`.h-event:not(${selector})`)) : [];
		elements.forEach(function(element) {
			element.classList && element.classList.add('ejecta');
		});
	}

	function getDateSelector() {
		var date = dateSelectElement.options[dateSelectElement.selectedIndex];
		return date && date.value ? `[data-date="${date.value}"]` : '';
	}

	function getGroupSelector() {
		var group = groupSelectElement.options[groupSelectElement.selectedIndex];
		return group && group.value ? `[data-group*="${group.value}"]` : '';
	}

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

})();

*/
