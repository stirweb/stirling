stir.didYouMean = (() => {

	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const _server = "www.stir.ac.uk";
	const _url = `https://${_server}`;

	const getEndpoint = () => new URL(`/webteam/did-you-mean/`, _url);
	
	const check = phrase => {
		debug && console.info('[Did you mean] phrase',phrase);
		const input   = getEndpoint();
		const body = new FormData();
		body.append('phrase',phrase);
		const options = {method:"POST", body: body};
		return fetch( new Request(input, options) );
	};

	return {
		check: check
	};
})();

// e.g. stir.didYouMean.check('fintecj').then(result => console.info(result))
