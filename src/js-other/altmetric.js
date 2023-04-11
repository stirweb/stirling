var stir = stir || {}

stir.altmetric = {
	url: (function() {
		if(UoS_env.name==="dev") return 'altmetric.json';
		return '<t4 type="media" id="166310" formatter="path/*" />';
	})(),
	max: 5,
	donut: doi=>'<div class=altmetric-embed data-badge-type=donut data-badge-popover=left data-doi="'+doi+'" data-hide-no-mentions=true></div>',
	handle: stir.curry((title,handle,index) => `<a href="http://hdl.handle.net/${handle}">${index===0?title:handle}</a>`),
	handles: (title,handles) => handles.map(stir.altmetric.handle(title)).shift(),
	row: (element,index) => `<tr><td>${(index+1)}</td><td>${stir.altmetric.handles(element.attributes['title'],element.attributes.identifiers['handles'])}</td><td class=donut>${element.attributes.identifiers['dois'].map(stir.altmetric.donut).join('')}</td></tr>`,
	tbody: json => json.slice(0,stir.altmetric.max).map(stir.altmetric.row).join(''),
	table: json => `<table><caption>University of Stirling research papers ranked by Altmetric</caption><thead><tr><th scope=col>Position</th><th scope=col>Research paper</th><th class=donut scope=col>Altmetric score</th></thead></tr><tbody>${stir.altmetric.tbody(json)}</tbody></table>`,
	callback: function(json) {
		if(!json) return;
		var container = document.getElementById('top10');
		if(!container) {
			return console.warn('[Altmetric] DOM container not found');
		}
		container.innerHTML = stir.altmetric.table(json);
		const altscpt = document.createElement('script');
		altscpt.src = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js';
		document.body.appendChild(altscpt);
	}
};

/* Get the feed */
(function() {
	stir.getJSON(stir.altmetric.url, stir.altmetric.callback);
})();