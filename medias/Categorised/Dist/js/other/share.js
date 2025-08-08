var stir=stir||{};stir.share=stir.share||{},stir.share.fallback=(()=>{const t="prod"!==UoS_env.name,o={close:"<span aria-hidden=true>×</span>",copy:'<svg viewBox="0 0 50 50"><path fill="currentColor" d="M46.8,13.6H30.6V3.3c0-0.7-0.5-1.2-1.2-1.2H12c-0.3,0-0.6,0.1-0.9,0.4l-8.7,8.7C2.1,11.4,2,11.7,2,12v23.3 c0,0.7,0.5,1.2,1.2,1.2h16.2v10.3c0,0.7,0.5,1.2,1.2,1.2h26.1c0.7,0,1.2-0.5,1.2-1.2v-32C48,14.1,47.5,13.6,46.8,13.6z M10.7,6.3 v4.4H6.3L10.7,6.3z M19.7,22.7c-0.2,0.2-0.3,0.5-0.3,0.8v10.6h-15V13.2H12c0.7,0,1.2-0.5,1.2-1.2V4.5h15v9.8L19.7,22.7z M28.1,17.8 v4.4h-4.4L28.1,17.8z M45.6,45.6H21.9V24.8h7.5c0.6,0,1.1-0.4,1.2-1h0v-7.7h15V45.6z"/></svg>',bs:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/>\x3c!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--\x3e</svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227"><path fill="currentColor" d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path></svg>',li:'<span class="uos-linkedin"></span>',fb:'<span class="uos-facebook"></span>',wb:'<span class="uos-weibo"></span>'};var e=document.querySelector('[data-open="shareSheet"]');const i=document.createElement("dialog");var a=document.createElement("button"),r=stir.share.getShareData(e);a.innerHTML=o.close,a.classList.add("close-button"),a.setAttribute("aria-label","Close modal"),a.addEventListener("click",e=>i.close()),i.classList.add("sharesheet"),i.innerHTML=(e=>{const t=encodeURIComponent(e.url),i=encodeURIComponent(e.title);return`
		<p class=u-font-bold>Share this ${e.entity||"page"}</p>
		<div class="copy-link-box">
			<div>
				<p>${e.title}</p>
				<p>${e.url}</p>
			</div>
			<div class=tooltip__link-copied>Link copied to clipboard</div>
		</div>
		<ul class="barnacles">
			<li title="Copy this link to your clipboard">
				<a href="#copy" data-copy="${e.url}">${o.copy}</a>
			</li>
			<li title="Share with Facebook">
				<a href="https://www.facebook.com/sharer.php?u=${t}" title="Share this page on Facebook">${o.fb}</a>
			</li>
			<li title="Share with LinkedIn">
				<a href="https://www.linkedin.com/shareArticle?url=${t}&amp;title=${i}" title="Share this page on LinkedIn">${o.li}</a>
			</li>
			<li title="Share with Bluesky">
				<a href="https://bsky.app/intent/compose?text=${i}%0A${t}" title="Share this page on Bluesky">${o.bs}</a>
			</li>
			<li title="Share with X the everything app™">
				<a href="https://x.com/intent/tweet?url=${t}&amp;text=${i}&amp;via=StirUni" title="Share this page on X">${o.x}</a>
			</li>
			<li title="Share with Weibo">
				<a href="http://service.weibo.com/share/share.php?url=${t}&amp;title=${i}" title="Share this page on Weibo">${o.wb}</a>
			</li>
		</ul>
		`})(r),i.append(a);const n=i.querySelector("[data-copy]");var s,a=i.querySelector(".copy-link-box");const l=i.querySelector(".tooltip__link-copied");r.image&&((s=document.createElement("img")).src=r.image,s.alt=r.description,s.onerror=function(e){t&&console.info("[Image] loading error - element removed",this),this.src&&this.parentElement.removeChild(this)},a.prepend(s)),document.body.append(i),e.addEventListener("click",e=>{i.showModal()}),n.addEventListener("click",e=>{!function(e){if(!e)return console.error("Copy error: nothing to copy.");if(!navigator.clipboard)return console.error("Copy error: Clipboard API not available.");try{navigator.clipboard.writeText(e).then(()=>(l&&c(l),!0),e=>(console.error("Copy error: ",e.message),!1))}catch(e){console.error("Copy error: ",e.message)}}(n.getAttribute("data-copy")||window.location.href),n.focus(),e.preventDefault()});{let t;function c(e){window.requestAnimationFrame&&(t=void 0,e.style.display="flex",requestAnimationFrame(h.bind(e)))}function p(e){t=t||e;e=Math.max(1-.005*(e-t),0);0<e?(this.style.opacity=e,requestAnimationFrame(p.bind(this))):(this.style.display="none",this.style.opacity=0)}function h(e){var e=.01*(e-(t=t||e));e<10?(this.style.opacity=Math.min(e,1),requestAnimationFrame(h.bind(this))):(this.style.opacity=1,e=this,window.requestAnimationFrame&&(t=void 0,requestAnimationFrame(p.bind(e))))}}return{}})();