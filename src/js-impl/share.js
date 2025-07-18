var stir = stir || {};

stir.share = (() => {


	const template = {
		close: '<span aria-hidden=true>×</span>',
		share: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M6.859,10.172a2.059,2.059,0,1,0,0,2m0-2a2.061,2.061,0,0,1,0,2m0-2,8.754-4.863M6.859,12.173l8.754,4.863m0,0a2.06,2.06,0,1,0,2.8-.8,2.06,2.06,0,0,0-2.8.8Zm0-11.726a2.059,2.059,0,1,0,.8-2.8,2.058,2.058,0,0,0-.8,2.8Z"></path></svg>',
		copy: '<svg viewBox="0 0 50 50"><path fill="currentColor" d="M46.8,13.6H30.6V3.3c0-0.7-0.5-1.2-1.2-1.2H12c-0.3,0-0.6,0.1-0.9,0.4l-8.7,8.7C2.1,11.4,2,11.7,2,12v23.3 c0,0.7,0.5,1.2,1.2,1.2h16.2v10.3c0,0.7,0.5,1.2,1.2,1.2h26.1c0.7,0,1.2-0.5,1.2-1.2v-32C48,14.1,47.5,13.6,46.8,13.6z M10.7,6.3 v4.4H6.3L10.7,6.3z M19.7,22.7c-0.2,0.2-0.3,0.5-0.3,0.8v10.6h-15V13.2H12c0.7,0,1.2-0.5,1.2-1.2V4.5h15v9.8L19.7,22.7z M28.1,17.8 v4.4h-4.4L28.1,17.8z M45.6,45.6H21.9V24.8h7.5c0.6,0,1.1-0.4,1.2-1h0v-7.7h15V45.6z"/></svg>',
		bsky: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--></svg>',
		x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227"><path fill="currentColor" d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path></svg>',
		title: "University of Stirling",
		text: "The University of Stirling is a world-class institution with one of the best student experiences in the UK. Are you Stirling? Secure your place.",
	};

	const render = data => {
		console.info(data);
		const enc = {
			url: encodeURIComponent(data.url),
			title: encodeURIComponent(data.title)
		};
		return `
		<h3 class="header-stripped">Share a link</h3>
		<ul class="barnacles">
			<li>
				<a href="https://www.facebook.com/sharer.php?u=${enc.url}" title="Share this page on Facebook" class="fbc-has-badge fbc-UID_1">
					<span class="uos-facebook"></span>
				</a>
			</li>
			<li>
				<a href="https://www.linkedin.com/shareArticle?url=${enc.url}&amp;title=${enc.title}" title="Share this page on LinkedIn">
					<span class="uos-linkedin"></span>
				</a>
			</li>
			<li>
				<a href="https://bsky.app/intent/compose?text=${enc.title}%0A${enc.url}" title="Share this page on X">${template.bsky}</a>
			</li>
			<li>
				<a href="https://x.com/intent/tweet?url=${enc.url}&amp;text=${enc.title}&amp;via=StirUni" title="Share this page on X">${template.x}</a>
			</li>
			<li>
				<a href="http://service.weibo.com/share/share.php?url=${enc.url}&amp;title=${enc.title}" title="Share this page on Weibo">
					<span class="uos-weibo"></span>
				</a>
			</li>
		</ul>
		<div class="copy-link-box">
			<p>${data.url}</p>
			<button title="Copy this link to you clipboard" data-copy="${data.url}" class="button tiny">Copy ${template.copy}</button>
			<div class=tooltip__link-copied>Link copied to clipboard</div>
		</div>
		`;
	};

	function test() {
		document.body.innerHTML = render({url:"https://www.stir.ac.uk/", title:"University of Stirling"});
		return 'Test';
	}

	const button = document.querySelector('[data-open="shareSheet"]');

	const shareData = {
		url: button.dataset.url || document.location.href,
		text: button.dataset.text || template.text,
		title: button.dataset.title || template.title
	};

	if (navigator.share) {
		button.addEventListener("click", async () => {
			try {
				await navigator.share(shareData);
				resultPara.textContent = "MDN shared successfully";
			} catch (err) {
				resultPara.textContent = `Error: ${err}`;
			}
		});
	} else {
		console.info("No native share sheet");
		const shareSheet = document.createElement('dialog');
		shareSheet.innerHTML = render(shareData);
		const close = document.createElement("button");
		const copy = shareSheet.querySelector("button[data-copy]");
		const tooltip = shareSheet.querySelector(".tooltip__link-copied")

		{	// Implementation

			shareSheet.classList.add("sharesheet");
			button.addEventListener("click", event => shareSheet.showModal());
			button.insertAdjacentHTML("beforeend", template.share);

			document.body.append(shareSheet);

			close.innerHTML = template.close;
			close.classList.add("close-button");
			close.setAttribute("aria-label", "Close modal");
			close.addEventListener("click", event => shareSheet.close());
			shareSheet.append(close);

			copy.addEventListener("click", event => {
				if (event.target) {
					const text = event.target.hasAttribute("data-copy") ? event.target.getAttribute("data-copy") || window.location.href : window.location.href;
					console.info(text);
					copyTextToClipboard(text);
					event.target.focus();
				}
			})
		}
		function copyTextToClipboard(text) {
			if (!text) {
				return console.error("Copy error: nothing to copy.");
			}
			if (!navigator.clipboard)
				return console.error("Clipboard API not available.")

			try {
				navigator.clipboard.writeText(text)
					.then(() => {
						tooltip && fadeIn(tooltip);
						return true;
					}, err => {
						console.error('Async: Could not copy text: ', err);
						return false;
					});
			} catch (error) {
				console.error(error.message);
			}
		}

		let start;	// used for animation timing

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

	return {
		test: test
	}

})();