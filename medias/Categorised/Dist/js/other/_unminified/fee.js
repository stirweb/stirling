/**
 * Get fee data from SITS
 * 
 * Note: this is part of the Akari API, but it's not really anything to do with Akari.
 * For the avoidance of confusion and further protracted conversations, we'll refer to
 * this data as "coming from SITS".
 * 
 */

var stir = stir || {};

stir.akari = stir.akari || {};

stir.akari.fee = (()=>{

	//const url = 'https://pd-api.stir.ac.uk/akari-stirling/api/fee/get/';
	//const url = 'https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/33569';
	const url = 'https://www.stir.ac.uk/data/pd-api/';

	const status = {
		H: "Home",
		R: "rUK",
		O: 'Overseas'
	};

	const _tabulate = data => {
		if(!data || !data.feeData || data.feeData.length===0) {
			return console.error('No fee data!');
		}
		const table = document.createElement('table');
		table.innerHTML = '<thead><tr><th>Academic year</th><th>Status</th><th>Attendance</th><th>Amount</th></tr></thead><tbody>' + data.feeData.map(feeMap).join('') + '</tbody>';
		return table;
	};

	const feeMap = fee => {
		return `<tr><td>${fee.academicYear}</td><td>${status[fee.feeStatus]||'unknown'}</td><td>${fee.modeOfAttendance}</td><td>${fee.amount}</td></tr>`
	};

	return {
		get: (rou,callback) => {
			if (typeof callback != "function") callback = new Function;
			stir.getJSON(`${url}?fee=${rou}`,callback);
		},
		show: data => console.info('show',data),
		tabulate: _tabulate
	};

})();