/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 4
 * ------------------------------------------------ */

(function () {
  const postsPerPage = 9;

  /*
   * GLOBAL CONSTANTS
   */

  const constants = {
    postsPerPage: postsPerPage,
    noOfPageLinks: 9,
    macroUK: '["United Kingdom" "Wales" "England" "Scotland" "Northern Ireland"]',
    jsonUrl: `https://www.stir.ac.uk/s/search.json?collection=student-stories&query=!padre&meta_tags=[student alum]&sort=metaimage&fmo=true&num_ranks=${postsPerPage}&`,
  };

  Object.freeze(constants);

  /*
   * DOM ELEMENTS
   */

  const nodes = {
    resultsArea: stir.node("#testimonials-search__results"),
    searchForm: stir.node("#testimonials-search__form"),
    searchLoading: stir.node(".c-search-loading-fixed"),
    inputLevel: stir.node("#testimonials-search__level"),
    inputSubject: stir.node("#testimonials-search__subject"),
    inputRegion: stir.node("#testimonials-search__nationality"),
    inputOnline: stir.node("#testimonials-search__online"),
  };

  /*
   * Guard clause
   */

  if (!nodes.resultsArea || !nodes.searchForm) return;

  /*
   *
   * CONTROLLER
   *
   */

  const main = (initData, nodes_, consts) => {
    if (initData.error) return setDOMContent(nodes_, stir.getMaintenanceMsg());
    if (!gotFBData(initData)) return setDOMContent(nodes_, renderNoResults());

    return setDOMContent(
      nodes_,
      renderResults(
        { ...initData.response.resultPacket.resultsSummary, ...consts },
        initData.response.resultPacket.results
      )
    );
  };

  /*
   *
   * RENDERERS
   *
   */

  const renderResults = (meta, results) => {
    return `
        <div class="cell">
          ${renderSummary(meta)}
        </div>
        <div class="cell">
          <div class="grid-x grid-padding-x">
            ${stir
              .map(
                (item, index) =>
                  renderCell(
                    item,
                    index,
                    calcResultsPerColumn(results.length, meta.mediaquery),
                    results.length
                  ),
                results
              )
              .join("")}
            </div>
        </div>
        <div class="cell">
          <div class="grid-x grid-padding-x" id="pagination-box">
            ${renderPagination(meta)}
          <div>
        </div>`;
  };

  /* Build the html for a cell (fake masonry) */
  const renderCell = (element, index, postsPerCol, totalResults) => {
    const newCell = (index / postsPerCol) % 1 === 0 || index === 0 ? true : false;

    return `
      ${newCell && index !== 0 ? `</div>` : ``}
      ${newCell || totalResults === 1 ? `<div class="cell small-12 medium-6 large-4 u-padding-bottom">` : ``}
      ${renderItem(element.metaData, element.title.split(" | ")[0], element.clickTrackingUrl)} `;
  };

  /* Build the html for an individual story */
  const renderItem = (item, fullname, url) => {
    const video = item.media && item.media.includes("a_vid") ? renderVideo(item, fullname) : ``;
    const image = item.image ? renderImage(item.image, fullname) : ``;

    return `
        <!-- Start testimonial result -->
        <div class="c-testimonial-result">
           <div class="c-image-block-search-result">
              ${video ? video : image}
                <div class="c-image-block-search-result__body">
                  <p class="u-font-bold c-image-block-search-result__title">${fullname}</p>
                  ${item.country || item.degreeTitle ? `<cite>` : ``}
                  ${item.country ? `<span class="info">${item.country} </span><br />` : ``}
                  ${item.degreeTitle ? `<span class="info">${item.degreeTitle}</span>` : ``}
                  ${item.country || item.degreeTitle ? `</cite>` : ``}
                  ${
                    item.snippet
                      ? `<blockquote class="c-image-block-search-result__quote">${item.snippet}</blockquote>`
                      : ``
                  }
                  <div class="c-image-block-search-result__read-more">
                      <a href="${url}" class="c-link">
                          View 
                          ${pluraliseName(fullname.trim())}
                          story</a>
                  </div>
                </div> 
            </div> 
        </div>
        <!-- End testimonial result -->`;
  };

  const renderSummary = (meta) => {
    return `<p>Showing ${meta.currStart}-${meta.currEnd} of <strong>${meta.fullyMatching} results</strong></p>`;
  };

  const renderVideo = (item, fullname) => {
    return `
        <div class="u-bg-grey">
            <div id="vimeoVideo-${item.media.split("-")[1]}" class="responsive-embed widescreen " 
                data-videoembedid=" myvid " data-vimeo-initialized="true">
                <iframe src="https://player.vimeo.com/video/${item.media.split("-")[1]}?app_id=122963" 
                    allow="autoplay; fullscreen" allowfullscreen="" title="Testimonial of 
                    ${fullname} " data-ready="true" width="426" height="240" frameborder="0">
                </iframe>
            </div>
        </div>`;
  };

  const renderImage = (image, fullname) => {
    return `<img src="https://www.stir.ac.uk${image}"  alt="${fullname}" 
              class="c-image-block-search-result__image" loading="lazy" />`;
  };

  const renderNoResults = () => {
    return `
        <div class="cell">
            <p class="text-center">We don't have any student stories that match those filters.</p> 
            <p class="text-center"><button class="resetBtn button">Start a new search</button</p>
        </div>`;
  };

  const renderPagination = (meta) => {
    if (meta.numRanks >= meta.fullyMatching) return ``;

    return StirSearchHelpers.formPaginationHTML(
      meta.fullyMatching,
      meta.numRanks,
      calcCurrentPage(meta.currStart, meta.numRanks),
      meta.noOfPageLinks
    );
  };

  /*
   *
   * HELPERS
   *
   */

  const gotFBData = (data) =>
    data.response.resultPacket !== null && data.response.resultPacket.results.length > 0;

  const calcCurrentPage = (start, total) => Math.floor(start / total + 1);

  const calcResultsPerColumn = (totalResults, mediaquery) => Math.round(totalResults / getNoCols(mediaquery));

  const pluraliseName = (name) => (name.slice(-1) === "s" ? name + "’" : name + "’s");

  /* Returns number of columns required for fake Masonry layout for a specific screen size */
  const getNoCols = (mediaquery) => {
    switch (mediaquery) {
      case "medium":
        return 2;
      case "small":
        return 1;
      case "large":
        return 3;
      default:
        return 3;
    }
  };

  const formSearchUrl = (url, facets) =>
    url + stir.map(([key, val]) => `${key}=${val}`, Object.entries(facets)).join("&");

  /*
   * Query Params helpers
   */

  const getStartRank = (page, postsPerPage) => (stir.isNumeric(page) ? (page - 1) * postsPerPage + 1 : 1);

  const getSubject = (value) => {
    if (!value || value.split(":").length < 2) return "";

    if (value.split(":")[0] === "|[subject") return value.split(":")[1];
    return "";
  };

  const getFaculty = (value) => {
    if (!value || value.split(":").length < 2) return "";

    if (value.split(":")[0] === "|[faculty") return value.split(":")[1];
    return "";
  };

  const getCountry = (country, consts) => {
    const meta_country = country ? country : "";

    if (meta_country === "United Kingdom") return consts.macroUK;
    return meta_country;
  };

  /*
   *
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   *
   */

  const setDOMContent = stir.curry((nodes_, html) => {
    nodes_.searchLoading && (nodes_.searchLoading.style.display = "none");
    nodes_.resultsArea.innerHTML = html;
    stir.scrollToElement(nodes_.searchForm, -50);

    return nodes_.resultsArea;
  });

  /*
   *
   * EVENTS: INPUTS (!!SIDE EFFECTS!!)
   *
   */

  const getFacetsFromQueryParams = (consts) => {
    return {
      meta_country: getCountry(QueryParams.get("region"), consts),
      meta_level: QueryParams.get("level") ? QueryParams.get("level") : "",
      meta_course1modes: QueryParams.get("mode") === "online" ? "online" : "",
      meta_subject: getSubject(QueryParams.get("subject")),
      meta_faculty: getFaculty(QueryParams.get("subject")),
      start_rank: getStartRank(QueryParams.get("page"), consts.postsPerPage),
    };
  };

  const fetchData = (url, nodes_, consts) => {
    stir.getJSON(url, (initialData) => {
      const constsExtended = { ...consts, mediaquery: stir.MediaQuery.current };
      main(initialData, nodes_, constsExtended);

      window.addEventListener("MediaQueryChange", (e) => {
        const constsExtended = { ...consts, mediaquery: stir.MediaQuery.current };
        main(initialData, nodes_, constsExtended);
      });
    });
  };

  const init = (nodes_, consts) => {
    nodes_.searchLoading && (nodes_.searchLoading.style.display = "flex");

    nodes_.inputRegion.value = QueryParams.get("region") ? QueryParams.get("region") : "";
    nodes_.inputLevel.value = QueryParams.get("level") ? QueryParams.get("level") : "";
    nodes_.inputSubject.value = QueryParams.get("subject") ? QueryParams.get("subject") : "!padrenullquery";
    nodes_.inputOnline.checked = QueryParams.get("mode") === "online" ? true : false;

    fetchData(formSearchUrl(consts.jsonUrl, getFacetsFromQueryParams(consts)), nodes_, consts);
  };

  /*  Live click events  */
  nodes.resultsArea.addEventListener(
    "click",
    (e) => {
      /* Reset button click */
      if (e.target.matches("button.resetBtn")) {
        stir.each((el) => QueryParams.remove(el.name), QueryParams.getAllArray());
        init(nodes, constants);
        e.preventDefault();
        return;
      }

      /* Pagination clicks */
      if (e.target.matches("#pagination-box a")) {
        QueryParams.set("page", e.target.getAttribute("data-page"));
        init(nodes, constants);
        e.preventDefault();
        return;
      }

      if (e.target.matches("#pagination-box a span")) {
        QueryParams.set("page", e.target.parentNode.getAttribute("data-page"));
        init(nodes, constants);
        e.preventDefault();
        return;
      }
    },
    false
  );

  /* Search Form submitted */
  nodes.searchForm.addEventListener(
    "submit",
    (e) => {
      QueryParams.set("page", 1);
      QueryParams.set("region", nodes.inputRegion.value);
      QueryParams.set("subject", nodes.inputSubject.value);
      QueryParams.set("level", nodes.inputLevel.value);

      nodes.inputOnline.checked ? QueryParams.set("mode", "online") : QueryParams.set("mode", "");

      init(nodes, constants);
      e.preventDefault();
      return;
    },
    false
  );

  /*
   * On Load
   */

  init(nodes, constants);
})();
