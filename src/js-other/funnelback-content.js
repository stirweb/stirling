var stir=stir||{};
stir.funnelback = stir.funnelback || (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const hostname = debug || UoS_env.name === "preview" ? "stage-shared-15-24-search.clients.uk.funnelback.com" : "search.stir.ac.uk";
	const url = `https://${hostname}/s/`;
  
	const getJsonEndpoint = () => new URL("search.json", url);
	const getScaleEndpoint = () => new URL("scale", url);
	const getHostname = () => hostname;
	return {
	  getHostname: getHostname,
	  getJsonEndpoint: getJsonEndpoint,
	  getScaleEndpoint: getScaleEndpoint,
	};
  })();

  (function() {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	var el = document.querySelector('[data-funnelback-inject]');
	if(!el)return;
	var subject = el.getAttribute('data-subject');
	if(!subject)return;

	const url = stir.funnelback.getJsonEndpoint().toString() + `?collection=stir-courses&query=!padre&SF=[award]&meta_subject_orsand=%22${subject}%22&sort=title`;

	const callback = data => {
		if(!data)return;
		el.innerHTML = data?.response?.resultPacket?.results?.map(result => `<li><a href="${result.liveUrl}">${result.metaData.award} ${result.title}</a></li>`).join('')||'';
	};

	debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);

  })();