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