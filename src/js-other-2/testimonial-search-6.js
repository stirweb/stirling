/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 6.0
 * @date: 2025-10-17
 * @description: Testimonial Search JS using AddSearch API
 * ------------------------------------------------ */

(function () {
  /**
   * RENDERERS
   */

  /**
   * Get the appropriate image from an array of images or a single image string
   * If there's no images, return an empty string
   * If there's one image, return that image
   * If there's multiple images, return the last image (which should be the largest)
   * @param {Array<string> || string} images - array of image URLs
   * @returns {string} - the selected image URL or an empty string
   */
  const getImage = (images) => {
    if (!images.length) return ``;

    if (Array.isArray(images)) {
      if (images.length === 1) return images[0];
      return images[images.length - 1];
    }

    return images;
  };

  /**
   * Form the html for an individual student
   * @param {object} item - the student item
   * @param {string} fullname - the full name of the student
   * @param {string} url - the URL to the student's story
   * @returns {string} - the HTML string for the student item
   */
  const renderItem = (item, fullname, url) => {
    const cf = item.custom_fields;
    const image = cf.image ? getImage(cf.image) : ``;
    const data = cf.data ? JSON.parse(decodeURIComponent(cf.data)) : {};

    return `
          <!-- Start testimonial result -->
            <div class="u-mb-2 u-bg-grey ">
              ${renderVideo(fullname, image) ? renderVideo(fullname, image) : renderImage(image, fullname)}
                <div class="u-p-2">
                  <p class="u-font-bold ">${fullname}</p>
                  ${cf.country || data.degree ? `<cite>` : ``}
                  ${cf.country ? `<span class="info">${cf.country} </span><br />` : ``}
                  ${data.degree ? `<span class="info">${data.degree}</span>` : ``}
                  ${cf.country || data.degree ? `</cite>` : ``}
                  ${cf.snippet ? `<blockquote class="u-border-none u-my-2 u-black u-p-0 u-quote u-text-regular">${cf.snippet}</blockquote>` : ``}
                  <a href="${item.url}" class="c-link">View ${pluraliseName(fullname.trim())} story</a>
                </div> 
            </div> 
          <!-- End testimonial result -->`;
  };

  /**
   * Form the html for a cell (fake masonry)
   * @param {object} element - the student item
   * @param {number} index - the index of the item in the results array
   * @param {object} meta - the metadata for the search
   * @param {number} totalResults - the total number of results
   */
  const renderCell = (element, index, meta, totalResults) => {
    const newCell = isNewCell(totalResults, meta.mediaquery, index);

    return `
        ${newCell && index !== 0 ? `</div>` : ``}
        ${newCell || totalResults === 1 ? `<div class="cell small-12 medium-6 large-4 u-padding-bottom">` : ``}
        ${renderItem(element, formatName(element.title), meta.urlBase + element.clickTrackingUrl)} `;
  };

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
              ${renderPagination(meta.page + 1, meta.total, meta.currEnd)}
            <div>
          </div>`;
  };

  const renderPagination = (nextPage, totalPosts, currEnd) => {
    return currEnd >= totalPosts
      ? ``
      : `<div class="cell text-center">
                <button class="button hollow tiny" data-page="${nextPage}">Load more results</button>
          </div>`;
  };

  const renderSummary = (meta) => {
    const end = meta.currEnd > meta.total ? meta.total : meta.currEnd;
    return `<p>Showing ${meta.currStart}-${end} of <strong>${meta.total} results</strong></p>`;
  };

  const renderVideo = (fullname, media) => {
    return media && media.includes("a_vid")
      ? `
        <div class="u-bg-grey">
            <div id="vimeoVideo-${media.split("-")[1]}" class="responsive-embed widescreen " 
                data-videoembedid=" myvid " data-vimeo-initialized="true">
                <iframe src="https://player.vimeo.com/video/${media.split("-")[1]}?app_id=122963" 
                    allow="autoplay; fullscreen" allowfullscreen="" title="Testimonial of 
                    ${fullname} " data-ready="true" width="426" height="240" frameborder="0">
                </iframe>
            </div>
        </div>`
      : ``;
  };

  const renderImage = (image, fullname) => {
    if (!image) return ``;
    return `<img src="https://www.stir.ac.uk${image}" alt="${fullname}" class="u-object-cover u-aspect-ratio-1-1" loading="lazy" width=500 height=500  />`;
  };

  const renderNoResults = () => {
    return `
          <div class="cell">
              <p class="text-center">We don't have any student stories that match those filters.</p> 
              <p class="text-center"><button class="resetBtn button">Start a new search</button</p>
          </div>`;
  };

  /*
   * HELPERS
   */

  /**
   * Helper to build custom field query strings for the search API (AddSearch)
   * @param {string} name - The name of the custom field
   * @param {Array<string>} values - The values to filter by
   * @returns {string} - The constructed query string
   */
  const buildCustomFields = (name, values) => {
    return values.map((value) => `customField=${name}%3D${value}`).join("&");
  };

  const isNewCell = (total, mediaquery, index) => {
    return (index / calcResultsPerColumn(total, mediaquery)) % 1 === 0 || index === 0 ? true : false;
  };

  const gotSearchData = (data) => {
    return data.total_hits > 0;
  };

  const calcResultsPerColumn = (totalResults, mediaquery) => {
    return Math.round(totalResults / getNoCols(mediaquery));
  };

  const pluraliseName = (name) => {
    return name.slice(-1) === "s" ? name + `’` : name + `’s`;
  };

  const formatName = (name) => {
    return name.split(" | ")[0].trim();
  };

  /**
   * Forms the search URL with the given parameters
   * @param {String} url
   * @param {object} facets
   * @param {number} page
   * @returns {string} - the formed URL
   */
  const formSearchUrl = (url, facets, page) => {
    const filters = Object.entries(facets)
      .map(([key, val]) => buildCustomFields(key, val.split("|")).replace(/&$/, ""))
      .join("&");

    return url + `&page=${page}&${filters}`;
  };

  /**
   * Returns the number of columns required for fake Masonry layout for a specific screen size
   * @param {string} mediaquery - the current media query (small, medium, large)
   * @returns {number} - the number of columns
   */
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
   * Query Params helpers
   */

  const parseSubjectQuery = (queryValue, type) => {
    if (!queryValue) return "";
    const value = queryValue.replaceAll("|[", "").replaceAll("]", "");
    if (!value.includes(":")) return "";

    const [key, val] = value.split(":");
    return key === type ? val : "";
  };

  const getSubject = (queryValue) => {
    return parseSubjectQuery(queryValue, "subject");
  };

  const getFaculty = (queryValue) => {
    const faculty = parseSubjectQuery(queryValue, "faculty");
    if (!faculty) return "";

    if (faculty === "Business") return "Stirling Business School";
    return `Faculty of ${faculty}`;
  };

  const getCountry = (country, consts) => {
    const meta_country = country ? country : "";
    if (meta_country === "United Kingdom") return consts.macroUK;
    return meta_country;
  };

  /**
   * Sets the inner HTML of the results area
   * If page is 1, it replaces the content, otherwise it appends to it
   * @param {object} nodes - the DOM nodes to update
   * @param {number} page - the current page number
   * @param {string} html - the HTML string to set
   * @returns {boolean} - true if content was set, false otherwise
   */
  const setDOMContent = stir.curry((nodes, page, html) => {
    if (page !== 1) return nodes.resultsArea.insertAdjacentHTML("beforeend", html);

    stir.setHTML(nodes.resultsArea, html);
    stir.scrollToElement(nodes.searchForm, -50);
    return true;
  });

  /**
   * Forms the facets object from the query parameters
   * @param {object} consts - constants used in the search
   * @returns {object<Strings>} facets - the facets object
   */
  const getFacetsFromQueryParams = (consts) => {
    return {
      country: getCountry(QueryParams.get("region"), consts),
      level: QueryParams.get("level") ? QueryParams.get("level") : "",
      delivery: QueryParams.get("mode") === "online" ? "online" : "",
      subject: getSubject(QueryParams.get("subject")),
      faculty: getFaculty(QueryParams.get("subject")),
    };
  };

  /**
   * Returns pagination values
   * @param {*} startPage
   * @param {*} postsPerPage
   * @returns {object} - the start and end values for the current page
   */
  const getPaginationValues = (startPage, postsPerPage) => {
    if (isNaN(startPage) || isNaN(postsPerPage)) return { start: 1, end: 9 };

    const start = Number(startPage) === 1 ? 1 : (Number(startPage) - 1) * Number(postsPerPage) + 1;
    const end = start + Number(postsPerPage) - 1;
    return { start, end };
  };

  /**
   * Process Data
   * Controller Function
   * @param {object} data - the data returned from the API
   * @param {object} nodes - the DOM nodes to update
   * @param {object} consts - constants used in the search
   * @returns {void}
   */
  const processData = (data, nodes, consts) => {
    if (data.error) return setDOMContent(nodes, 1, stir.getprocessDatatenanceMsg());

    if (!gotSearchData(data)) return setDOMContent(nodes, 1, renderNoResults());

    const { start, end } = getPaginationValues(data.page, consts.postsPerPage);
    const metaTemp = { page: data.page, currStart: start, currEnd: end, total: data.total_hits };
    const meta = { ...metaTemp, ...consts };

    return setDOMContent(nodes, data.page, renderResults(meta, data.hits));
  };

  /**
   * Fetch Data
   * Uses stir.getJSON which is a wrapper round fetch - see stir.js for more details
   * Fetches data from the API and updates the DOM with the results
   * @param {string} url - the URL to fetch data from
   * @param {object} nodes - the DOM nodes to update
   * @param {object} consts - constants used in the search
   * @returns {void}
   */
  const fetchData = (url, nodes, consts) => {
    stir.getJSON(url, (initialData) => {
      processData(initialData, nodes, { ...consts, mediaquery: stir.MediaQuery.current });

      window.addEventListener("MediaQueryChange", (e) => {
        processData(initialData, nodes, { ...consts, mediaquery: stir.MediaQuery.current });
      });
    });
  };

  /**
   * Initializes the search form with values from the query parameters
   * @param {object} nodes - the DOM nodes to update
   * @param {object} consts - constants used in the search
   * @returns {void}
   */
  const init = (nodes, consts) => {
    nodes.inputRegion.value = QueryParams.get("region") ? QueryParams.get("region") : "";
    nodes.inputLevel.value = QueryParams.get("level") ? QueryParams.get("level") : "";
    nodes.inputSubject.value = QueryParams.get("subject") ? QueryParams.get("subject") : "!padrenullquery";
    nodes.inputOnline.checked = QueryParams.get("mode") === "online" ? true : false;

    const page = QueryParams.get("page") ? Number(QueryParams.get("page")) : 1;
    fetchData(formSearchUrl(consts.searchUrl, getFacetsFromQueryParams(consts), page), nodes, consts);
  };

  /**
   * On Load
   * If there's no results area or search form, exit
   * Otherwise, initialize the search
   * @returns {void}
   */

  /**
   * Constants
   */

  const postsPerPage = 9;
  const tags = ["alum", "student"];
  const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";

  const CONSTS = {
    postsPerPage: postsPerPage,
    macroUK: "United Kingdom|Wales|England|Scotland|Northern Ireland",
    urlBase: "https://www.stir.ac.uk/",
    searchUrl: `${searchAPI}?term=*&resultType=organic&limit=9&customField=type%3Dstudentstory&sort=custom_fields.sort&${buildCustomFields(
      "tag",
      tags
    )}&categories=1xstudent-stories&`,
    onlineText: "",
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

  init(NODES, CONSTS);

  /**
   * Live click events
   * Restarts the search when a button is clicked
   * @param {object} e - the event object
   * @returns {void}
   */
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

  /**
   * Search Form submitted
   * When a new search is submitted, resets the page to 1 and updates the query parameters
   * @param {object} e - the event object
   * @returns {void}
   */
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
})();
