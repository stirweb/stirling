var stir = stir||{};

stir.akari = (() => {

    const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	const domain = 'www.stir.ac.uk';
	const path = '/data/pd-akari-qa/?module=';
	const url = `https://${domain}${path}`;

    const get = {
		rel: id => path + id,
		module: (id, callback) => stir.getJSON(url + id, callback)
	};


    return {
		get: get    // stir.akari.get.module(id,callback)
	};

})();