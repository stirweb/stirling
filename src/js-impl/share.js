(()=>{

	const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M6.859,10.172a2.059,2.059,0,1,0,0,2m0-2a2.061,2.061,0,0,1,0,2m0-2,8.754-4.863M6.859,12.173l8.754,4.863m0,0a2.06,2.06,0,1,0,2.8-.8,2.06,2.06,0,0,0-2.8.8Zm0-11.726a2.059,2.059,0,1,0,.8-2.8,2.058,2.058,0,0,0-.8,2.8Z"></path></svg>';

	const button = document.querySelector('[data-open="shareSheet"]');

	if(!button) return;

	button.insertAdjacentHTML("beforeend", icon);

	if (navigator.share) {
		button.addEventListener("click", async () => {
			const shareData = {
				url: button.dataset.url || document.location.href,
				title: button.dataset.title || ''
			};
			try {
				await navigator.share(shareData);
			} catch (error) {
				console.error(error.message);
			}
		});
	} else {
		console.info('[Share] loading fallback');
		stir.addScript('/medias/Categorised/Dist/js/other/share.js');
	}


})();