var stir = stir || {};

stir.share = (()=>{

	const button = document.querySelector('[data-open="shareSheet"]');
	if(!button) return;

	const res = {
		script: {
			dev:'/medias/Categorised/Dist/js/other/share.js',
			preview: '<t4 type="media" id="192023" formatter="path/*" />',
			prod: '<t4 type="media" id="192023" formatter="path/*" />'
		},
		styles: {
			dev:'/medias/Categorised/Dist/css/campaigns/share.css',
			preview: '<t4 type="media" id="195920" formatter="path/*" />',
			prod: '<t4 type="media" id="195920" formatter="path/*" />'
		}
	};

	function _getShareData(el) {
		return {
			title: (el&&el.hasAttribute("data-title")&&el.getAttribute("data-title"))||document.head.querySelector('[property="og:title"]')?.getAttribute('content')||document.head.querySelector("title").textContent,
			url: ((el&&el.hasAttribute("data-url")&&el.getAttribute("data-url"))||document.head.querySelector('[property="og:url"]')?.getAttribute('content')||document.location.href).replace('https://www.stir.ac.ukhttp','http'),
			description: document.head.querySelector('[property="og:description"],[name="description"]')?.getAttribute('content'),
			entity: (document.head.querySelector('[name="stir.type"]')?.getAttribute('content')||"").toLowerCase(),
			image: document.head.querySelector('[name="og:image"],[property="og:image"]')?.getAttribute('content')
		};
	}

	if (navigator.share) {
		button.addEventListener("click", async (e) => {
			try { await navigator.share(_getShareData(e.target)); }
			catch (error) { /* console.error(error.message); */ }
		});
	} else {
		res.styles[UoS_env.name] && stir.addStyle(res.styles[UoS_env.name]);
		res.script[UoS_env.name] && stir.addScript(res.script[UoS_env.name]);
	}

	return {
		getShareData: _getShareData
	}

})();