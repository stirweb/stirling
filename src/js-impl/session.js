
 stir.session = (()=>{
	 
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const session = {};
	const ccc = window.Cookies && Cookies.getJSON("CookieControl");
	const consent = ccc && ccc.optionalCookies && ccc.optionalCookies.performance === "accepted";
	
	if(!consent) {
		debug && console.info("[Session] performance cookie consent: not given");
		window.sessionStorage && sessionStorage.removeItem("session"); // remove any existing
		session.id = generateID();
		return session;
	}

	debug && console.info("[Session] performance cookie consent: given");
	
	function generateID() {
		const time = Date.now();
		const randomNumber = Math.floor(Math.random() * 1000000001);
		return time + "_" + randomNumber;
	}
	
	if (window.sessionStorage && sessionStorage.getItem("session")) {
		session.id = sessionStorage.getItem("session");
		debug && console.info("[Session] ongoing session:",session.id);
	} else {
		session.id = generateID();
		window.sessionStorage && sessionStorage.setItem("session",session.id);
		debug && console.info("[Session] new session:",session.id);
	}
	
	return session;
	 
 })();