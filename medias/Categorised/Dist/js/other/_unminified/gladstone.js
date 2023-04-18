(function () {

	const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	const swimTimetableFormatter = data => {
		if(!data.StartDate) return'';
		const date = new Date(data.StartDate);
		return `
			<tr>
				<th data-day=${data.Day}>${stir.Date.swimTimetable(date)}</th>
				<td><strong>Time</strong>: ${data.StartTime}–${data.EndTime}</td>
				<td><strong>Activity</strong>: ${data.Description?data.Description.replace(' Pool', ''):''}</td>
				<td><strong>No. of Lanes</strong>: ${data.NoOfProducts}</td>
				<td><strong>Depth</strong>: ${data.WebComments?data.WebComments.replace(/Depth /g, '').replace("\n", '<br>'):''}</td>
				<!-- <td><a href="${data.DeepLink}" class="button tiny energy-pink">Book&nbsp;now</a></td> -->
			</tr>
		`
	};

	const mergeDayHeaders = table => {
		for (let day in week) {
			let rows = Array.prototype.slice.call(table.querySelectorAll(`th[data-day="${week[day]}"]`));
			if(rows.length) {
				rows[0].setAttribute('rowspan', rows.length);
				rows.shift();
				for (let i = 0; i < rows.length; i++) {
					rows[i].parentElement.removeChild(rows[i]);
				}
			}
		}
		return table;
	};

	const render = (text, data) => {
		if ("undefined" === typeof data) return;
		if ("undefined" === typeof data.map) return;

		const table = document.createElement('table');
		table.setAttribute('class', 'c-activity-timetable alt')
		table.innerHTML = `<caption>${text}</caption>` + data.map(swimTimetableFormatter).join("\n");

		el.appendChild( mergeDayHeaders(table) );
	};

	const el = document.querySelector("#gs-target");

	const spinner = new stir.Spinner(el)
    spinner.element.classList.remove('show-for-medium');
	spinner.show();

	// JSONp callback function, must be global
	window.swimtt = function (data) {

		//console.info(data);
		
		if (!el) return;
		spinner.hide();

		if(typeof data.map) {
			render('Pool timetable', data);
		}

	};

	window.recswimtt = swimtt;

	const handler = {
		load: e=>{
			spinner.hide();
			//console.info('[Gladstone] data loaded');
		},
		error: e=>{
			spinner.hide();
			el.appendChild(document.createTextNode("Error: Data could not be loaded. Please try again later."));
		}
	};
 	
	try {
		const activity = el.getAttribute('data-activity');
		let url = el.getAttribute('data-jsonp');
		if(activity) {
			if("RECSWIM"===activity) {
				url = el.getAttribute("data-recswim");
			}
//			if("LANESWIM"===activity) {
//				url = el.getAttribute("data-laneswim");
//			}
		} 
		if(url){
			stir.getJSONp(url, handler.load, handler.error);
		} else {
			handler.error();
		}
	} catch (e) {
		console.error(e);
		spinner.hide();
	}

})();