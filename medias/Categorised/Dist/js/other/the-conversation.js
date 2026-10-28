var stir=stir||{};stir.t4Globals=stir.t4Globals||{},stir.t4Globals.conversation=stir.t4Globals.conversation||{},function(){var e=stir.t4Globals.conversation.max;const t=document.querySelector(".u-article-summaries");if(t&&stir.Date.newsDate&&stir.Array.oxfordComma){const r=stir.curry((e,t)=>t.slice(0,e||t.length))(e),l=e=>`
	<article id=${e.querySelector("id").textContent} class="cell small-12 medium-6 large-3 c-convo" aria-label="The Conversation: ${e.querySelector("title").textContent}">
		<h3 class="header-stripped u-mt-1 u-mb-0 u-font-normal u-line-height-1  u-energy-line-top">
			<a href="${e.querySelector("link").getAttribute("href")}" class="c-link-null u-inline text-sm">
			${e.querySelector("title").textContent}
			</a>
		</h3>
		<!-- <small><time datetime="${e.querySelector("published").textContent}">${stir.Date.newsDate(new Date(e.querySelector("published").textContent))}</time></small> -->
		<p class="text-sm">${e.querySelector("summary").textContent}</p>
		<div data-href="$foaf:homepage.attribute[rdf:resource]$"><small>By  ${stir.Array.oxfordComma(Array.prototype.slice.call(e.querySelectorAll("author")).map(e=>`<span>${e.querySelector("name").textContent}</span>`))}</small></div>
	</article>`;fetch('<t4 type="navigation" name="Helper: path to The Conversation feed" id="5194" />').then(e=>e.text()).then(e=>(new window.DOMParser).parseFromString(e,"text/xml")).then(e=>t.insertAdjacentHTML("beforeend",r(Array.prototype.slice.call(e.querySelectorAll("entry"))).map(l).join("")))}}();