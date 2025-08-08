var stir = stir || {};

stir.share = stir.share || {};

stir.share.fallback = (() => {

	const debug = UoS_env.name !== "prod";

	const icons = {
		close: '<span aria-hidden=true>×</span>',
		copy: '<svg viewBox="0 0 50 50"><path fill="currentColor" d="M46.8,13.6H30.6V3.3c0-0.7-0.5-1.2-1.2-1.2H12c-0.3,0-0.6,0.1-0.9,0.4l-8.7,8.7C2.1,11.4,2,11.7,2,12v23.3 c0,0.7,0.5,1.2,1.2,1.2h16.2v10.3c0,0.7,0.5,1.2,1.2,1.2h26.1c0.7,0,1.2-0.5,1.2-1.2v-32C48,14.1,47.5,13.6,46.8,13.6z M10.7,6.3 v4.4H6.3L10.7,6.3z M19.7,22.7c-0.2,0.2-0.3,0.5-0.3,0.8v10.6h-15V13.2H12c0.7,0,1.2-0.5,1.2-1.2V4.5h15v9.8L19.7,22.7z M28.1,17.8 v4.4h-4.4L28.1,17.8z M45.6,45.6H21.9V24.8h7.5c0.6,0,1.1-0.4,1.2-1h0v-7.7h15V45.6z"/></svg>',
		bs: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--></svg>',
		x:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227"><path fill="currentColor" d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path></svg>',
		li: '<span class="uos-linkedin"></span>',
		fb: '<span class="uos-facebook"></span>',
		wb: '<span class="uos-weibo"></span>'
	};

	const template = data => {
		const enc = {
			url: encodeURIComponent(data.url),
			title: encodeURIComponent(data.title)
		};
		return `
		<p class=u-font-bold>Share this ${data.entity||'page'}</p>
		<div class="copy-link-box">
			<div>
				<p>${data.title}</p>
				<p>${data.url}</p>
			</div>
			<div class=tooltip__link-copied>Link copied to clipboard</div>
		</div>
		<ul class="barnacles">
			<li title="Copy this link to your clipboard">
				<a href="#copy" data-copy="${data.url}">${icons.copy}</a>
			</li>
			<li title="Share with Facebook">
				<a href="https://www.facebook.com/sharer.php?u=${enc.url}" title="Share this page on Facebook">${icons.fb}</a>
			</li>
			<li title="Share with LinkedIn">
				<a href="https://www.linkedin.com/shareArticle?url=${enc.url}&amp;title=${enc.title}" title="Share this page on LinkedIn">${icons.li}</a>
			</li>
			<li title="Share with Bluesky">
				<a href="https://bsky.app/intent/compose?text=${enc.title}%0A${enc.url}" title="Share this page on Bluesky">${icons.bs}</a>
			</li>
			<li title="Share with X the everything app™">
				<a href="https://x.com/intent/tweet?url=${enc.url}&amp;text=${enc.title}&amp;via=StirUni" title="Share this page on X">${icons.x}</a>
			</li>
			<li title="Share with Weibo">
				<a href="http://service.weibo.com/share/share.php?url=${enc.url}&amp;title=${enc.title}" title="Share this page on Weibo">${icons.wb}</a>
			</li>
		</ul>
		`;
	};

	const button = document.querySelector('[data-open="shareSheet"]');
	const shareSheet = document.createElement('dialog');
	const close = document.createElement("button");
	const shareData = stir.share.getShareData(button);
	
	close.innerHTML = icons.close;
	close.classList.add("close-button");
	close.setAttribute("aria-label", "Close modal");
	close.addEventListener("click", event => shareSheet.close());
	shareSheet.append(close);
	shareSheet.classList.add("sharesheet");
	console.info("shareData",shareData)
	shareSheet.innerHTML = template(shareData);
	const copy = shareSheet.querySelector("[data-copy]");
	const copylinkbox = shareSheet.querySelector(".copy-link-box");
	const tooltip = shareSheet.querySelector(".tooltip__link-copied");

	if(shareData.image) {
		const thumb = document.createElement('img');
		thumb.src = shareData.image;
		thumb.alt = shareData.description;
		thumb.onerror = imageError;
		copylinkbox.prepend(thumb);
	}

	document.body.append(shareSheet);

	button.addEventListener("click", event => {
		shareSheet.showModal()
	});

	copy.addEventListener("click", event => {
		copyTextToClipboard(copy.getAttribute("data-copy") || window.location.href);
		copy.focus();
		event.preventDefault();
	})

	function imageError(event) {
		debug && console.info("[Image] loading error - element removed", this);
		this.src && this.parentElement.removeChild(this);
	}

	function copyTextToClipboard(text) {
		if (!text) return console.error("Copy error: nothing to copy.");
		if (!navigator.clipboard) return console.error("Copy error: Clipboard API not available.")

		try {
			navigator.clipboard.writeText(text)
				.then(() => {
					tooltip && fadeIn(tooltip);
					return true;
				}, error => {
					console.error('Copy error: ', error.message);
					return false;
				});
		} catch (error) {
			console.error('Copy error: ', error.message);
		}
	}

	{	// A N I M A T I O N 
		
		let start;	// timing counter
		
		function fadeOut(el) {
			if (!window.requestAnimationFrame) return;
			start = undefined;
			requestAnimationFrame(stepOut.bind(el));
		}
		
		function fadeIn(el) {
			if (!window.requestAnimationFrame) return;
			start = undefined;
			el.style.display = "flex";
			requestAnimationFrame(stepIn.bind(el));
		}
		
		function stepOut(timestamp) {
			start = start || timestamp;
			const opacity = Math.max(1 - 0.005 * (timestamp - start), 0);
			
			if (opacity > 0) {
				this.style.opacity = opacity;
				requestAnimationFrame(stepOut.bind(this));
			} else {
				this.style.display = "none";
				this.style.opacity = 0;
			}
		}
		
		function stepIn(timestamp) {
			start = start || timestamp;
			const opacity = (0.01 * (timestamp - start));
			if (opacity < 10) {
				this.style.opacity = Math.min(opacity, 1);
				requestAnimationFrame(stepIn.bind(this));
			} else {
				this.style.opacity = 1;
				fadeOut(this);
			}
		}
		
	}

	return {}

})();