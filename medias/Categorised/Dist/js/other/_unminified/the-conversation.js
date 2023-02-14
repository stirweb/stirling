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