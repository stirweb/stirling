(function () {
  const feedNoOfItems = 3;
  const element = document.getElementById("news-related-list");

  if (!window.relatedArticles || !element) return;

  const metaID = document.head.querySelector('meta[name="stir.news.article.id"]');
  const articleID = metaID && metaID.getAttribute("content") ? metaID.getAttribute("content") : 0;

  const renderItem = (item) => {
    return `<article class="cell large-4 medium-6 small-12" aria-label="${item.title}">
                <a href="${item.url}" ><img class="show-for-medium" src="${item.image}" alt="${item.title}"></a>
                <time class="u-block u-my-1 u-grey--dark">${stir.formatStirDate(new Date(item.date_published))}</time>
                <h3 class="header-stripped u-header--margin-stripped u-mt-1 u-font-normal u-compress-line-height"><a href="${item.url}" class="c-link u-inline" >${item.title}</a></h3>
                <p class="text-sm">${item.summary}</p>
            </article>`;
  };

  if (element) {
    const articles = relatedArticles
      .filter((item) => {
        if (item.id && item.id !== articleID) return item;
      })
      .filter((item, index) => {
        if (index < feedNoOfItems) return item;
      });

    element.insertAdjacentHTML("beforeend", articles.map(renderItem).join(""));
  }
})();
