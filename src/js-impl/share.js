var stir = stir || {};

stir.share = (()=>{

	const button = document.querySelector('[data-open="shareSheet"]');
	if(!button) return;

	function _getShareData(el) {
		return {
			title: document.head.querySelector('[property="og:title"]')?.getAttribute('content')||document.head.title,
			url: document.head.querySelector('[property="og:url"]')?.getAttribute('content')||document.location.href,
			description: document.head.querySelector('[property="og:description"],[name="description"]')?.getAttribute('content'),
			type: (document.head.querySelector('[name="stir.type"]')?.getAttribute('content')||"").toLowerCase(),
			image: document.head.querySelector('[name="og:image"],[property="og:image"]')?.getAttribute('content')
		};
	}

	if (navigator.share) {
		button.addEventListener("click", async (e) => {
			try {
				await navigator.share(_getShareData(e.target));
			} catch (error) {
				//console.error(error.message);
			}
		});
	} else {
		stir.addScript("dev"!==UoS_env.name?'<t4 type="media" id="192023" formatter="path/*" />':'/medias/Categorised/Dist/js/other/share.js');
	}

	return {
		getShareData: _getShareData
	}

})();