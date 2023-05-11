/**
 * This is the old version, currently (2023-04-25) in use on the News landing
 * page as well as the main Research page.
 */
function conversation(data) {
	var convoMax,
		convoEl = document.querySelector(".convo");
	var html, alt, image, title, name, etc, url;
	if (!convoEl) return;
	convoMax = parseInt(convoEl.getAttribute("data-max")) || 1;
	convoMax = convoMax < data.length ? convoMax : data.length;
	for (var i = 0; i < convoMax; i++) {
		alt = data[i].alt || "";
		image = data[i].image || "";
		title = data[i].title || "";
		name = data[i].author.name || "";
		etc = data[i].author.etc || "";
		url = data[i].href || "";
		html = '<article id="conv' + i + '" class="cell large-4 medium-6 small-12 flex-container flex-dir-column u-gap" aria-label="The Conversation: ' + title + '"><img alt="' + alt + '" src="' + image + '" loading="lazy" /><h3 class="header-stripped u-font-normal u-m-0"><a href="' + url + '" class="c-link ">' + title + '</a></h3><p class="text-sm">' + name + ",  " + etc + "</p></article>";
		convoEl.insertAdjacentHTML("beforeend", html);
	}
}

/**
 * The Conversation Article Feed
 * Revised 2023-04-25
 * Takes the public Atom XML feed published by The Conversation
 * "Cached" as a Web Object by t4 to get around CORS problems
 * (We can't just use a t4 RSS/Data Object because it can't reach all the necessary nodes in the XML tree)
 * 
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 */

var stir=stir||{};
stir.t4Globals=stir.t4Globals||{};
stir.t4Globals.conversation=stir.t4Globals.conversation||{};
(function () {
	const RSS_URL = `<t4 type="navigation" name="Helper: path to The Conversation feed" id="5194" />`;
	const MAX = stir.t4Globals.conversation.max;
	const el = document.querySelector('.u-article-summaries');
	if (!el || !stir.Date.newsDate || !stir.Array.oxfordComma) return;

	const limit = stir.curry((max,array) => array.slice(0,max||array.length))(MAX);

	// Template for output
	const article = article => `
	<article id=${article.querySelector("id").textContent} class="cell small-12 medium-4 large-3 c-convo" aria-label="The Conversation: ${article.querySelector("title").textContent}">
		<h3 class="header-stripped u-font-normal u-m-0">
			<a href="${article.querySelector("link").getAttribute("href")}" target="_blank" rel="noopener" class=c-link>
			${article.querySelector("title").textContent}
			</a>
		</h3>
		<!-- <small><time datetime="${article.querySelector("published").textContent}">${stir.Date.newsDate(new Date(article.querySelector("published").textContent))}</time></small> -->
		<p class="text-sm">${article.querySelector("summary").textContent}</p>
		<div data-href="$foaf:homepage.attribute[rdf:resource]$"><small>By  ${stir.Array.oxfordComma(Array.prototype.slice.call(article.querySelectorAll("author")).map(author => `<span>${author.querySelector("name").textContent}</span>`))}</small></div>
	</article>`;

	// Fetch and parse XML
	fetch(RSS_URL)
		.then(response => response.text())
		.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
		.then(data => el.insertAdjacentHTML("beforeend", limit(Array.prototype.slice.call(data.querySelectorAll("entry"))).map(article).join('')));
})();