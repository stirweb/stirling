var stir = stir || {};

stir.share = (()=>{

	const button = document.querySelector('[data-open="shareSheet"]');
	if(!button) return;

	const scripts = {
		dev:'/medias/Categorised/Dist/js/other/share.js',
		'appdev-preview': '<t4 type="media" id="190308" formatter="path/*" />',
		preview: '<t4 type="media" id="192023" formatter="path/*" />',
		prod: '<t4 type="media" id="192023" formatter="path/*" />'
	};

	function _getShareData(el) {
		return {
			title: (el&&el.hasAttribute("data-title")&&el.getAttribute("data-title"))||document.head.querySelector('[property="og:title"]')?.getAttribute('content')||document.head.querySelector("title").textContent,
			url: (el&&el.hasAttribute("data-url")&&el.getAttribute("data-url"))||document.head.querySelector('[property="og:url"]')?.getAttribute('content')||document.location.href,
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
		stir.addScript(scripts[UoS_env.name]||'');
	}

	return {
		getShareData: _getShareData
	}

})();