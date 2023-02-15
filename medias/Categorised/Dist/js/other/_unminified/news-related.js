(function () {
  var feedNoOfItems = 3;
  var element = document.getElementById("news-related-list");
  if (!window.relatedArticles || !element) return;
  var metaID = document.head.querySelector('meta[name="stir.news.article.id"]');
  var articleID = metaID && metaID.getAttribute("content") ? metaID.getAttribute("content") : 0;
  var renderItem = function renderItem(item) {
    return "<article class=\"cell large-4 medium-6 small-12\" aria-label=\"".concat(item.title, "\">\n                <a href=\"").concat(item.url, "\" ><img class=\"show-for-medium\" src=\"").concat(item.image, "\" alt=\"").concat(item.title, "\"></a>\n                <time class=\"u-block u-my-1 u-grey--dark\">").concat(stir.formatStirDate(new Date(item.date_published)), "</time>\n                <h3 class=\"header-stripped u-header--margin-stripped u-mt-1 u-font-normal u-compress-line-height\"><a href=\"").concat(item.url, "\" class=\"c-link u-inline\" >").concat(item.title, "</a></h3>\n                <p class=\"text-sm\">").concat(item.summary, "</p>\n            </article>");
  };
  if (element) {
    var articles = relatedArticles.filter(function (item) {
      if (item.id && item.id !== articleID) return item;
    }).filter(function (item, index) {
      if (index < feedNoOfItems) return item;
    });
    element.insertAdjacentHTML("beforeend", articles.map(renderItem).join(""));
  }
})();