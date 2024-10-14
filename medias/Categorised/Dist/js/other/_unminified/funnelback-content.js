var stir = stir || {};
stir.funnelback =
  stir.funnelback ||
  (() => {
    const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
    const hostname = debug || UoS_env.name === "preview" ? "stage-shared-15-24-search.clients.uk.funnelback.com" : "search.stir.ac.uk";
    const url = `https://${hostname}/s/`;

    const getJsonEndpoint = () => new URL("search.json", url);
    const getScaleEndpoint = () => new URL("scale", url);
    const getHostname = () => hostname;
    return {
      getHostname: getHostname,
      getJsonEndpoint: getJsonEndpoint,
      getScaleEndpoint: getScaleEndpoint,
    };
  })();

(function () {
  const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  //const fallbackimgurl = '<t4 type="media" id="183393" formatter="image/*" cdn="true" pxl-filter-id="10" />';

  const fallbackimgurl = `<img src="/media/stirling/news/news-centre/generic/airthrey-loch-1200x630.jpg" width="1200" height="630" alt="Airthrey Loch University of Stirling" loading="lazy" />
`.trim();

  console.log(fallbackimgurl);

  const templates = {
    relatedCourses: (result) => `<li><a href="${result.liveUrl}">${result.metaData.award || ""} ${result.title}</a></li>`,
    relatedNews: (result) => `<article class="cell large-4 medium-6 small-12" aria-label="${result.title.split("|").shift().trim()}">
    ${templates.link(result.liveUrl, templates.image(templates.imageUrl(result), result.metaData.imagealt) || templates.image(fallbackimgurl, "Airthrey Loch"))}
		<time class="u-block u-my-1 u-dark-grey">${stir.Date.newsDate(new Date(result.date))}</time>
		<h3 class="header-stripped u-header--margin-stripped u-mt-1 u-font-normal u-compress-line-height"><a href="${result.liveUrl}" class="c-link u-inline">${result.title.split("|").shift().trim()}</a></h3>
		<p class="text-sm">${result.summary}</p>
		</article>`,
    image: (src, alt) => (src && alt ? `<img class="show-for-medium" src="${src}" alt="${alt}">` : ""),
    link: (url, text) => (url && text ? `<a href="${url}">${text}</a>` : ""),
    imageUrl: (result) => (result.metaData ? result.metaData.thumbnail || result.metaData.image.split("|").shift() : ""),
  };
  const max = {
    relatedCourses: 25,
    relatedNews: 3,
  };
  const parameters = {
    relatedCourses: `&sort=title&SF=[award]&num_ranks=${max["relatedCourses"] + 1}`,
    relatedNews: `&sort=date&SF=[c,d,h1,image,imagealt,tags,thumbnail]&num_ranks=${max["relatedNews"] + 1}`,
  };
  const getMetaQueryParams = (metaName, metaValue) => (metaName && metaValue ? `&meta_${metaName}_orsand=${metaValue}` : "");
  const getFacetsFromMetaTags = (name) => Array.prototype.slice.call(document.querySelectorAll(`meta[name="${name}"]`)).map((el) => el.content);
  const getFacetQueryParams = (name, values) => (name && values.length ? values.map((value) => `&${name}=${value}`).join("") : "");

  const noSelfLinks = (result) => result.liveUrl !== window.location.href;
  document.querySelectorAll("[data-funnelback-inject]").forEach((el) => {
    if (!el) return;
    var type = el.getAttribute("data-type");
    var metaName = el.getAttribute("data-meta-name");
    var metaValue = el.getAttribute("data-meta-value");
    var facetName = el.getAttribute("data-facet-name");
    var collection = el.getAttribute("data-collection");
    var metaType = el.getAttribute("data-meta-type");
    var facetValues = getFacetsFromMetaTags(el.getAttribute("data-facet-tag"));

    if ("subject" === metaName) {
      // [meta] Subjects are comma separated and need to be wrapped with quotemarks
      // so that the query language is correct. (This avoids matching on words
      // like "and" and so on that would otherwise ruin the results).
      metaValue = metaValue
        .split(", ")
        .map((value) => `"${value}"`)
        .join(" ");
    }

    const fb_meta = getMetaQueryParams(metaName, metaValue) + getFacetQueryParams(facetName, facetValues) + (metaType ? `&meta_type=${metaType}` : "");
    const url = stir.funnelback.getJsonEndpoint().toString() + `?collection=${collection}&query=!padrenullquery${fb_meta + parameters[type]}`;

    const callback = (data) => {
      if (!data || !data.response || !data.response.resultPacket || !data.response.resultPacket.results.length) return;
      el.innerHTML =
        data.response.resultPacket.results
          .filter(noSelfLinks)
          .slice(0, max[type])
          .map((result) => templates[type](result))
          .join("") || "";
    };

    debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
  });
})();
