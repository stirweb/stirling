	
(function () {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const fallbackimgurl = '<t4 type="media" id="183393" formatter="path/*" cdn="true" pxl-filter-id="10" />';
	const unpackData = data => {
		if("undefined"===typeof data)	return {};
		if(String===data.constructor)	return JSON.parse(decodeURIComponent(data));
		if(Array===data.constructor)	return Object.assign({},...data.map(datum=>JSON.parse(decodeURIComponent(datum))));
		if(Object===data.constructor)	return data;
		return	{};
	};
	const templates = {
		course: (result) => {
			return `<li><a href="${result.url}">${result.title.split("|").shift().trim()}</a></li>`
		},
		news: (result,index) => {
			const data = unpackData(result.custom_fields.data);
			const id = result.custom_fields.sid || index;
			const title = result.title.split("|").shift().trim();
			const date = result.custom_fields.d ? result.custom_fields.d.split("|")[0] : result.ts;
			const image = templates.image(data.thumbnail, data.thumb_alt || title); 
			const altimg = templates.image(fallbackimgurl, "Airthrey Loch");
			return `
				<article class="cell large-4 medium-6 small-12" aria-labelledby=news${id}>
					${templates.link(result.url,image||altimg)}
					<time class="u-block u-my-1 u-dark-grey">${stir.Date.newsDate(new Date(date))}</time>
					<h3 class="header-stripped u-header--margin-stripped u-mt-1 u-font-normal u-compress-line-height">
						<a href="${result.url}" class="c-link u-inline" id=news${id}>${title}</a>
					</h3>
					<p class="text-sm">${result.meta_description||''}</p>
				</article>`;
		},
		image: (src, alt) => (src && alt ? `<img class=show-for-medium src="${src}" alt="${alt}" loading=lazy>` : undefined),
		link: (url, text) => (url && text ? `<a href="${url}">${text}</a>` : ""),
		imageUrl: (result) => (result.metaData ? result.metaData.thumbnail || result.metaData.image.split("|").shift() : ""),
	};
	const levels = {
		UG: "undergraduate",
		PG: "postgraduate (taught)" // PGR not used, PGT only
	};
	const max = {
		course: 25,
		news: 3,
	};
	const parameters = {
		course: {
			term: "*",
			customField: "type=course",
			collectAnalytics: false,
			resultType: "organic",
			limit: max.course
		},
		news: {
			term: "*",
			customField: "type=news",
			sort: "custom_fields.d",
			collectAnalytics: false,
			resultType: "organic",
			limit: max.news
		}
	};

	const getFacetsFromMetaTags = name => Array.prototype.slice.call(document.querySelectorAll(`meta[name="stir.${name}"]`)).map((el) => el.content);
	const noSelfLinks = result => result.url !== window.location.href;
	
	document.querySelectorAll("[data-funnelback-inject],[data-search-inject]").forEach((el) => {
		const type = el.getAttribute("data-type");
		const level = el.getAttribute("data-level");
		const facet = el.getAttribute("data-facet");
		const values = facet && getFacetsFromMetaTags(facet);
		const url = stir.addSearch.getJsonEndpoint();
		const params = new URLSearchParams(parameters[type]);
		
		// process values into search parameters
		values && values.forEach(value => {
			params.append('customField',`${facet}=${value}`);
		});
		level && levels[level] && params.append('customField',`level=${levels[level]}`);
		url.search = params;
		
		const callback = (data) => {
			if (!data) return;
			el.innerHTML =
				data.hits
					.filter(noSelfLinks)
					.slice(0, max[type])
					.map((result,i) => templates[type](result))
					.join("") || "";
		};
		
		stir.getJSON(url, callback);
	});
})();
