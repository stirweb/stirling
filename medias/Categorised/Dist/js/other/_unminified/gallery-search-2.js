/*
 * @author: Ryan Kaye / Robert Morrison
 * @version: 2
 * @notes: non jQuery / non Martyn SearchBox version
 */

(function (scope) {
  if (!scope) return;

  /*
     GLOBAL CONSTS / DOM elements
  */

  const funnelbackServer = "https://search.stir.ac.uk";
  const funnelbackUrl = "https://search.stir.ac.uk/s/search.json?";

  const fbConfig = {
    collection: "stir-www",
    query: "!padre",
    num_ranks: "1000",
    meta_type_and: "gallery",
    sort: "dmetad",
    SF: "[tags|custom]",
    fmo: "true",
  };

  const fbQuery = stir.map((item) => item + "=" + encodeURIComponent(fbConfig[item]), Object.keys(fbConfig)).join("&");

  const CONSTS = {
    funnelbackServer: funnelbackServer,
    resultsArea: scope,
    searchForm: stir.node("#gallery-search__form"),
    searchInputs: stir.nodes("#gallery-search__form select"),
    postsPerPage: 12,
    noOfPageLinks: 9,
    jsonUrl: funnelbackUrl + fbQuery,
  };

  Object.freeze(CONSTS);

  /*

     CONTROLLER

  */

  const main = (filters, consts, initData) => {
    // Guards
    if (initData.error) return setDOMContent(consts.resultsArea, stir.getMaintenanceMsg());
    if (!gotData(initData)) return setDOMContent(consts.resultsArea, renderNoResults());

    // Helper Curry function
    const filterer = filterData(filters);
    const filteredData = stir.filter(filterer, initData.response.resultPacket.results);

    if (!filteredData.length) return setDOMResult(renderNoResults());

    const meta = getMetaData(consts, filters, filteredData.length);
    const setDOMResult = meta.page === "1" ? setDOMContent(consts.resultsArea) : appendDOMContent(consts.resultsArea);

    // Helper Curry functions
    const renderer = renderAll(meta);
    const pagerer = stir.filter((el, i) => i >= meta.start && i <= meta.last);

    return stir.compose(setDOMResult, renderer, pagerer)(filteredData);
  };

  /*

     STATE

  */

  /* FUNCTION: @return boolean */
  const gotData = (data) => {
    return data.response.resultPacket !== null && data.response.resultPacket.results.length;
  };

  /* FUNCTION: @return JSON object of all meta data for this search for pagination etc */
  const getMetaData = (consts, filters, size) => {
    const pageFiltered = stir.filter((el) => el.name === "page", filters);
    const pageExtracted = pageFiltered.length ? pageFiltered[0].value : 1;
    const page = stir.isNumeric(pageExtracted) ? pageExtracted : 1;

    const start = (page - 1) * consts.postsPerPage;
    const end = page * consts.postsPerPage - 1;
    const last = end > size ? size : end;

    return {
      ...{
        page: page,
        start: start,
        end: end,
        total: size,
        last: last,
      },
      ...consts,
    };
  };

  /* FUNCTION: @return object of filtered gallery items */
  const filterData = stir.curry((filters, element) => {
    if (!element) return false;

    const filtersCleaned = stir.filter((item) => item.name && item.name !== "page", filters);

    const tags = {
      meta_dyear: new Date(element.date).getFullYear(),
      meta_tags: element.metaData.tags,
    };

    const matches = stir.map((filter) => String(tags[filter.name]).includes(filter.value), filtersCleaned);
    return stir.all((x) => x, matches);
  });

  /*

     RENDERERS

  */

  /* FUNCTION: @return String of html  */
  const renderAll = stir.curry((meta, data) => {
    const renderItemCurry = renderItem(meta);

    return `
        ${renderSummary(meta)}
        ${data.map((element) => renderItemCurry(element)).join("")}
        ${renderPagination(meta)}`;
  });

  /* FUNCTION: @return String of html  */
  const renderItem = stir.curry((meta, item) => {
    return `
        <div class="cell small-12 medium-6 large-4 u-mb-2">
          <a href="${meta.funnelbackServer}${item.clickTrackingUrl}">
            <div>
              <div class="c-photo-gallery__thumb">
                <img src="${renderThumbnail(item.metaData.custom)}" loading="lazy" alt="${item.title.split("|")[0].trim()}">
              </div>
            </div>
            <div class="cell small-12 u-bg-grey u-p-2">
              <p><strong>${item.title.split("|")[0].trim()}</strong></p>
              <p class="text-sm u-black">${stir.Date.galleryDate(new Date(item.date))}</p>
            </div>
          </a>
        </div>`;
  });

  /*  FUNCTION: @return String of html  */
  const renderThumbnail = (image) => {
    if (!image) return "";

    const images = image.split("|").filter((element) => JSON.parse(element).hasOwnProperty("farm"));
    if (!images.length) return "";

    const imageItem = JSON.parse(images[0]);
    return `https://farm${imageItem.farm}.staticflickr.com/${imageItem.server}/${imageItem.id}_${imageItem.secret}_z.jpg`;
  };

  /*  FUNCTION: @return String of html  */
  const renderSummary = (meta) => {
    return `
        <div class="cell u-mb-1 text-center">
          <p>Showing ${meta.start + 1} -
            ${parseInt(meta.end) >= parseInt(meta.total) ? meta.total : meta.end + 1} 
            of ${meta.total} results</p>
        </div>`;
  };

  /* FUNCTION: @return String of html  */
  const renderPagination = ({ last, total, page }) => {
    return last >= total
      ? ``
      : `<div class="cell text-center" id="pagination-box">
            <button class="button hollow tiny" data-page="${Number(page) + 1}">Load more results</button>
        </div>`;
  };

  const renderNoResults = () => `<div class="cell"><p>No galleries found </p></div>`;

  /*

    EVENTS: OUTPUT (!!SIDE EFFECTS!!)

  */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return node;
  });

  const appendDOMContent = stir.curry((node, html) => {
    node.insertAdjacentHTML("beforeend", html);
    return node;
  });

  /*

    EVENTS: INPUT ACTIONS (!!SIDE EFFECTS!!)

  */

  /* 
    ON LOAD: 
  */
  const params = QueryParams.getAll();
  stir.each((item) => params[item.name] && (item.value = params[item.name]), CONSTS.searchInputs);

  // Fetch for the data
  stir.getJSON(CONSTS.jsonUrl, (initialData) => {
    main(QueryParams.getAllArray(), CONSTS, initialData);

    // Listener: Form submit
    CONSTS.searchForm &&
      CONSTS.searchForm.addEventListener(
        "submit",
        (e) => {
          QueryParams.set("page", 1);
          CONSTS.searchInputs.forEach((item) => QueryParams.set(item.name, item.value));
          main(QueryParams.getAllArray(), CONSTS, initialData);
          e.preventDefault();
          return;
        },
        false
      );

    // Listener: Pagination clicks
    CONSTS.resultsArea.addEventListener("click", (e) => {
      if (e.target.matches("#pagination-box button")) {
        e.target.classList.add("hide");
        QueryParams.set("page", e.target.getAttribute("data-page"));

        main(QueryParams.getAllArray(), CONSTS, initialData);
        return;
      }
    });
  });

  /*

    FIN

  */
})(stir.node("#gallery-search__results"));
