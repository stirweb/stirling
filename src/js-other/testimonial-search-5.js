/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 5
 * ------------------------------------------------ */

(function () {
  /*
      SEARCH CONFIG AND URL REFERENCES
   */

  //const server = 'stir-search.clients.uk.funnelback.com';
  const server = "search.stir.ac.uk";
  const urlBase = `https://${server}`; // ClickTracking
  const jsonBase = `${urlBase}/s/search.json?`;
  const scaleImage = stir.curry((server, image) => `https://${server}/s/scale?url=${encodeURIComponent(image)}&width=500&height=500&format=jpeg&type=crop_center`);
  const scaleImageWithFunnelback = scaleImage(server);
  const sf = "profileDegreeTitle,profileCountry,profileCourse,profileCourse1,profileCourse1Url,profileCourse1Modes,profilecourse1Delivery,profileCourse2,profileCourse2Url,profilecourse2Delivery,profileCourse2Modes,profileFaculty,profileSubject,profileYearGraduated,profileLevel,profileTags,profileSnippet,profileImage,profileMedia";
  const postsPerPage = 9;
  const collection = "stir-www";
  const sortBy = "metaprofileImage";
  const tags = "[student alum]";

  /*
      CONSTANTS
   */

  const CONSTS = {
    postsPerPage: postsPerPage,
    noOfPageLinks: 9,
    macroUK: '["United Kingdom" "Wales" "England" "Scotland" "Northern Ireland"]',
    urlBase: urlBase,
    jsonUrl: `${jsonBase}collection=${collection}&query=!padre&meta_profileTags=[${tags}]&sort=${sortBy}&fmo=true&num_ranks=${postsPerPage}&SF=[${sf}]&meta_v=/student-stories/&`,
    onlineText: "online&meta_profilecourse1Delivery_or=hybrid",
  };

  Object.freeze(CONSTS);

  const NODES = {
    resultsArea: stir.node("#testimonials-search__results"),
    searchForm: stir.node("#testimonials-search__form"),
    searchLoading: stir.node(".c-search-loading-fixed"),
    inputLevel: stir.node("#testimonials-search__level"),
    inputSubject: stir.node("#testimonials-search__subject"),
    inputRegion: stir.node("#testimonials-search__nationality"),
    inputOnline: stir.node("#testimonials-search__online"),
  };

  if (!NODES.resultsArea || !NODES.searchForm) return;

  /*
      CONTROLLER
   */

  const main = (data, nodes, consts) => {
    if (data.error) return setDOMContent(nodes, stir.getMaintenanceMsg());
    if (!gotFBData(data)) return setDOMContent(nodes, renderNoResults());

    const meta = { ...data.response.resultPacket.resultsSummary, ...consts };

    return setDOMContent(nodes, calcCurrentPage(meta.currStart, meta.numRanks), renderResults(meta, data.response.resultPacket.results));
  };

  /*
      RENDERERS
   */

  const renderResults = (meta, results) => {
    return `
          <div class="cell text-center u-pb-2">
            ${renderSummary(meta)}
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x">
              ${stir.map((item, index) => renderCell(item, index, meta, results.length), results).join("")}
              </div>
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x" id="pagination-box">
              ${renderPagination(calcCurrentPage(meta.currStart, meta.numRanks) + 1, meta.fullyMatching, meta.currEnd)}
            <div>
          </div>`;
  };

  /* 
    Form the html for the pagination  
  */
  const renderPagination = (currentPage, totalPosts, last) => {
    return last >= totalPosts
      ? ``
      : `<div class="cell text-center">
                <button class="button hollow tiny" data-page="${currentPage}">Load more results</button>
          </div>`;
  };

  /* Build the html for a cell (fake masonry) */
  const renderCell = (element, index, meta, totalResults) => {
    const newCell = isNewCell(totalResults, meta.mediaquery, index);

    return `
        ${newCell && index !== 0 ? `</div>` : ``}
        ${newCell || totalResults === 1 ? `<div class="cell small-12 medium-6 large-4 u-padding-bottom">` : ``}
        ${renderItem(element.metaData, formatName(element.title), meta.urlBase + element.clickTrackingUrl)} `;
  };

  /* Build the html for an individual story */
  const renderItem = (item, fullname, url) => {
    return `
          <!-- Start testimonial result -->
            <div class="u-mb-2 u-bg-grey ">
              ${renderVideo(item, fullname, item.profileMedia) ? renderVideo(item, fullname, item.profileMedia) : renderImage(item.profileImage, fullname)}
                <div class="u-p-2">
                  <p class="u-font-bold ">${fullname}</p>
                  ${item.profileCountry || item.profileDegreeTitle ? `<cite>` : ``}
                  ${item.profileCountry ? `<span class="info">${item.profileCountry} </span><br />` : ``}
                  ${item.profileDegreeTitle ? `<span class="info">${item.profileDegreeTitle}</span>` : ``}
                  ${item.profileCountry || item.degreeTitle ? `</cite>` : ``}
                  ${item.profileSnippet ? `<blockquote class="u-border-none u-my-2 u-black u-p-0 u-quote u-text-regular">${item.profileSnippet}</blockquote>` : ``}
                  
                  <a href="${url}" class="c-link">View ${pluraliseName(fullname.trim())} story</a>
                </div> 
            </div> 
          <!-- End testimonial result -->`;
  };

  const renderSummary = (meta) => {
    return `<p>Showing ${meta.currStart}-${meta.currEnd} of <strong>${meta.fullyMatching} results</strong></p>`;
  };

  const renderVideo = (item, fullname, media) => {
    return media && media.includes("a_vid")
      ? `
        <div class="u-bg-grey">
            <div id="vimeoVideo-${item.profileMedia.split("-")[1]}" class="responsive-embed widescreen " 
                data-videoembedid=" myvid " data-vimeo-initialized="true">
                <iframe src="https://player.vimeo.com/video/${item.profileMedia.split("-")[1]}?app_id=122963" 
                    allow="autoplay; fullscreen" allowfullscreen="" title="Testimonial of 
                    ${fullname} " data-ready="true" width="426" height="240" frameborder="0">
                </iframe>
            </div>
        </div>`
      : ``;
  };

  const renderImage = (image, fullname) => {
    if (!image) return ``;

    const url = `https://www.stir.ac.uk${image}`;
    return `<img src="${scaleImageWithFunnelback(url)}" alt="${fullname}"  loading="lazy" width=500 height=500 onerror="this.onerror='';this.src='${url}'" />`;
  };

  const renderNoResults = () => {
    return `
          <div class="cell">
              <p class="text-center">We don't have any student stories that match those filters.</p> 
              <p class="text-center"><button class="resetBtn button">Start a new search</button</p>
          </div>`;
  };

  /*
      HELPERS
   */

  const isNewCell = (total, mediaquery, index) => ((index / calcResultsPerColumn(total, mediaquery)) % 1 === 0 || index === 0 ? true : false);

  const gotFBData = (data) => data.response.resultPacket !== null && data.response.resultPacket.results.length > 0;

  const calcCurrentPage = (start, total) => Math.floor(start / total + 1);

  const calcResultsPerColumn = (totalResults, mediaquery) => Math.round(totalResults / getNoCols(mediaquery));

  const pluraliseName = (name) => (name.slice(-1) === "s" ? name + `’` : name + `’s`);

  const formatName = (name) => name.split(" | ")[0].trim();

  const formSearchUrl = (url, facets) => url + stir.map(([key, val]) => `${key}=${val}`, Object.entries(facets)).join("&");

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

  /*
     Query Params helpers
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
      EVENTS: OUTPUT RESULTS (!!SIDE EFFECTS!!)
   */

  const setDOMContent = stir.curry((nodes, page, html) => {
    if (page !== 1) return nodes.resultsArea.insertAdjacentHTML("beforeend", html);

    stir.setHTML(nodes.resultsArea, html);
    stir.scrollToElement(nodes.searchForm, -50);
    return true;
  });

  /*
      EVENTS: INPUTS (!!SIDE EFFECTS!!)
   */

  const getFacetsFromQueryParams = (consts) => {
    return {
      meta_profileCountry: getCountry(QueryParams.get("region"), consts),
      meta_profileLevel: QueryParams.get("level") ? QueryParams.get("level") : "",
      meta_profilecourse1Delivery_or: QueryParams.get("mode") === "online" ? consts.onlineText : "",
      meta_profileSubject: getSubject(QueryParams.get("subject")),
      meta_profileFaculty: getFaculty(QueryParams.get("subject")),
      start_rank: getStartRank(QueryParams.get("page"), consts.postsPerPage),
    };
  };

  /* fetchData */
  const fetchData = (url, nodes, consts) => {
    stir.getJSON(url, (initialData) => {
      main(initialData, nodes, { ...consts, mediaquery: stir.MediaQuery.current });

      window.addEventListener("MediaQueryChange", (e) => {
        main(initialData, nodes, { ...consts, mediaquery: stir.MediaQuery.current });
      });
    });
  };

  /* init */
  const init = (nodes, consts) => {
    nodes.inputRegion.value = QueryParams.get("region") ? QueryParams.get("region") : "";
    nodes.inputLevel.value = QueryParams.get("level") ? QueryParams.get("level") : "";
    nodes.inputSubject.value = QueryParams.get("subject") ? QueryParams.get("subject") : "!padrenullquery";
    nodes.inputOnline.checked = QueryParams.get("mode") === "online" ? true : false;

    fetchData(formSearchUrl(consts.jsonUrl, getFacetsFromQueryParams(consts)), nodes, consts);
  };

  /*  Live click events  */
  NODES.resultsArea.addEventListener(
    "click",
    (e) => {
      /* Reset button click */
      if (e.target.matches("button.resetBtn")) {
        stir.each((el) => QueryParams.remove(el.name), QueryParams.getAllArray());
        init(NODES, CONSTS);
        e.preventDefault();
        return;
      }

      if (e.target.matches("#pagination-box button")) {
        e.target.classList.add("hide");
        QueryParams.set("page", e.target.getAttribute("data-page"));
        init(NODES, CONSTS);
        return;
      }
    },
    false
  );

  /* Search Form submitted */
  NODES.searchForm.addEventListener(
    "submit",
    (e) => {
      QueryParams.set("page", 1);
      QueryParams.set("region", NODES.inputRegion.value);
      QueryParams.set("subject", NODES.inputSubject.value);
      QueryParams.set("level", NODES.inputLevel.value);

      NODES.inputOnline.checked ? QueryParams.set("mode", "online") : QueryParams.set("mode", "");

      init(NODES, CONSTS);
      e.preventDefault();
      return;
    },
    false
  );

  /*
     ON LOAD
   */

  init(NODES, CONSTS);
})();
