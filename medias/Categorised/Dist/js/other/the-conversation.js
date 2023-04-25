function conversation(e){var t,r,a,l,n,o,i=document.querySelector(".convo");if(i)for(var s=(s=parseInt(i.getAttribute("data-max"))||1)<e.length?s:e.length,c=0;c<s;c++)t=e[c].alt||"",r=e[c].image||"",a=e[c].title||"",l=e[c].author.name||"",n=e[c].author.etc||"",o=e[c].href||"",i.insertAdjacentHTML("beforeend",'<article id="conv'+c+'" class="cell large-4 medium-6 small-12 flex-container flex-dir-column u-gap" aria-label="The Conversation: '+a+'"><img alt="'+t+'" src="'+r+'" loading="lazy" /><h3 class="header-stripped u-font-normal u-m-0"><a href="'+o+'" class="c-link ">'+a+'</a></h3><p class="text-sm">'+l+",  "+n+"</p></article>")}var stir=stir||{};!function(){const t=document.querySelector(".u-article-summaries");if(t&&stir.Date.newsDate&&stir.Array.oxfordComma){const r=e=>`
	<article id=${e.querySelector("id").textContent} class="cell small-12 medium-4 large-3 c-convo" aria-label="The Conversation: ${e.querySelector("title").textContent}">
		<h3 class="header-stripped u-font-normal u-m-0">
			<a href="${e.querySelector("link").getAttribute("href")}" target="_blank" rel="noopener" class=c-link>
			${e.querySelector("title").textContent}
			</a>
		</h3>
		<!-- <small><time datetime="${e.querySelector("published").textContent}">${stir.Date.newsDate(new Date(e.querySelector("published").textContent))}</time></small> -->
		<p class="text-sm">${e.querySelector("summary").textContent}</p>
		<div data-href="$foaf:homepage.attribute[rdf:resource]$"><small>By  ${stir.Array.oxfordComma(Array.prototype.slice.call(e.querySelectorAll("author")).map(e=>`<span>${e.querySelector("name").textContent}</span>`))}</small></div>
	</article>`;fetch('<t4 type="navigation" name="Helper: path to The Conversation feed" id="5194" />').then(e=>e.text()).then(e=>(new window.DOMParser).parseFromString(e,"text/xml")).then(e=>t.insertAdjacentHTML("beforeend",Array.prototype.slice.call(e.querySelectorAll("entry")).map(r).join("")))}}();