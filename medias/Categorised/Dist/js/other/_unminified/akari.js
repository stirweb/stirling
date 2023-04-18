var stir = stir || {};

stir.akari = (function () {

	let params = new URLSearchParams(document.location.search);
	const url = 'https://www.stir.ac.uk/data/courses/akari/module/index.php?module=';
	const browser = document.getElementById('moduleBrowser');
	const debug = data => console.info(data);

	console.info(params)

	const get = {
		module: identifier => stir.load(url + identifier, parse)
	};

	const expose = html => html.toString().replaceAll('<','&lt;').replaceAll('http://','<span class=warn>http</span>://');

	const innerTabulate = element => {
		var output = [];
		if (typeof element === "object") {
			if(element===null){
				output.push('<span class=placeholder>no data</span>');
			} else {
				output.push(tabulate(element));
			}
		} else {
			output.push(expose(element)||'<span class=placeholder>no data</span>');
		}
		return output.join('');
	};

	const tabulate = iterable => {
		let output = [];
		//console.info(typeof iterable, iterable)
		output.push(`<table>`);
		for (const element in iterable) {
			output.push(`<tr>`);
			output.push(`<th>${element}${Array.isArray(iterable[element])?'<br>['+iterable[element].length+' item(s)]':''}</th>`);
//			if (Array.isArray(iterable[element])) {
//				output.push(`<td>`);
//				output.push(iterable[element].map(innerTabulate).join(''));
//				output.push(`</td>`);
//			} else {
				output.push(`<td>${innerTabulate(iterable[element])}</td>`);
//			}
			output.push(`</tr>`);
		}
		output.push(`</table>`);
		return output.join('');
	};

	const parse = text => {
		try {
			return render(JSON.parse(text));
		} catch (error) {
			//return {error: error};
			return render('<p>Data for this module code is not found in Akari</p>');
		}
	};

	const render = data => {
		console.info('render', data)
		browser.innerHTML = (data.moduletitle?`<h2 class=header-stripped>${data.moduletitle}</h2>`:'') +
							(data.modulecode?`<p>${data.modulecode}</p>`:'') + 
							("object"===typeof data ? tabulate(data) : '') + 
							("string"===typeof data ? data:'')//+ //'<p>Data for this module code is not found in Akari</p>'
							//`<textarea>${parse(data)}</textarea>`;
	};
	if (params) {
		const code = params.get('code');
		const session = params.get('session');
		const semester = params.get('semester');
		if (code && session && semester) {
			browser.textContent = 'Now loading…';
			return get.module([code, session, semester].join('/'));
		}
		browser.innerHTML = '<p class=error><strong>Error</strong>. Please check <kbd>code</kbd>, <kbd>session</kbd> and <kbd>semester</kbd> parameters, then try again.';
	}

	return {
		get: get
	};

})();