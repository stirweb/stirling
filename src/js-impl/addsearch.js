stir.addSearch = (() => {
	// e.g. https://api.addsearch.com/v1/search/cfa10522e4ae6987c390ab72e9393908?term=rest+api

	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const REPORTING = debug ? false : true; //click tracking etc.
	const KEY = "dbe6bc5995c4296d93d74b99ab0ad7de"; //public site key
	const _server = "api.addsearch.com";
	const _url = `https://${_server}`;

	const getJsonEndpoint = () => new URL(`/v1/search/${KEY}`, _url);
	const getSuggestionsEndpoint = () => new URL(`/v1/suggest/${KEY}`, _url);
	const getAutocompleteEndpoint = () => new URL(`/v1/autocomplete/document-field/${KEY}`, _url);
	const getReportingEndpoint = () => new URL(`/v1/stats/${KEY}`,_url);
	//const getRecommendationsEndpoint = (block) => new URL(`/v1/recommendations/index/${KEY}/block/${block}`, _url);
	
	const getCompletions = (data,callback) => {
		if("function" !== typeof callback) return;
		const url = getAutocompleteEndpoint();
		const params = new URLSearchParams(data);
		url.search = params;
		stir.getJSON(url,data=>console.info("getCompletions",data));
	};
	
	const getSuggestions = (term,callback) => {
		if("function" !== typeof callback) return;
		const url = getSuggestionsEndpoint();
		url.search = `term=${term}`;
		stir.getJSON(url,callback);
	};
	
	/* Recommendations - AddSearch extra */
	// const getRecommendations = (block,callback) => {
	// 	if("function" !== typeof callback) return;
	// 	stir.getJSON(getRecommendationsEndpoint(block),callback);
	// };
	
	const getResults = parameters => {
		const url = getJsonEndpoint();
		url.search = new URLSearchParams(parameters);
		return fetch( new Request(url) )
	};
	
	// Used to report Click and Search user actions back to AddSearch analytics
	// (Returns a PROMISE object that may be async'd or chained)
	const putReport = (data) => {
		
		if(!REPORTING) {
			// debug && console.info("[AddSearch] reporting is disabled",data);
			return new Promise((resolve,reject)=>{resolve(data)});
		}
		const input   = getReportingEndpoint();
		const options = {method:"POST", body:JSON.stringify(data)};
		
		return fetch( new Request(input, options) );

	};

	return {
		getJsonEndpoint: getJsonEndpoint,
		getCompletions: getCompletions,
		getSuggestions: getSuggestions,
		putReport: putReport,
		getResults: getResults
		// getRecommendations: getRecommendations,
	};
})();