(function () {
  /*
    HELPERS
    */

  /*
   * Get filter regions
   * @param {string} region - Selected region
   * @returns {Array} - Array of filter objects for the region
   */
  const getRegions = (region) => {
    const scotland = [{ "custom_fields.country": "Scotland" }, { "custom_fields.country": "United Kingdom" }, { "custom_fields.country": "All nationalities" }];
    const ruk = [{ "custom_fields.country": "RUK" }, { "custom_fields.country": "United Kingdom" }, { "custom_fields.country": "All nationalities" }];
    const international = [
      { "custom_fields.country": "All Europe" },
      { "custom_fields.country": "All EU" },
      { "custom_fields.country": "All international" },
      { "custom_fields.country": "All nationalities" },
    ];

    switch (region) {
      case "Scotland":
        return scotland;
      case "RUK":
        return ruk;
      case "All international":
        return international;
      default:
        return [];
    }
  };

  /*
   * Build filter object from form data
   * @param {FormData} formData - Form data from the filters
   * @returns {Object} - Filter object for API query
   */
  const buildFilterObject = (formData) => {
    const studylevel = formData.get("studylevel");
    const region = formData.get("region");
    const category = formData.get("category");
    const filterObj = { and: [] };

    if (studylevel) {
      filterObj.and.push({ "custom_fields.level": studylevel });
    }
    if (region) {
      filterObj.and.push({ or: getRegions(region) });
    }
    if (category) {
      filterObj.and.push({ "custom_fields.tag": category });
    }
    return filterObj;
  };

  /*
   * Get current date in YYYY-MM-DD format
   * @returns {string} - Current date
   */
  const getNow = () => {
    return new Date().toISOString();
  };

  /*
    RENDERERS
    */

  /*
   * Parse data field into an object
   * @param {string|Array} data - Data field from custom fields
   * @returns {Object} - Parsed data object
   */
  const getDataObject = (data) => {
    if (typeof data === "string") {
      return JSON.parse(decodeURIComponent(data));
    }
    return "object" === typeof data ? Object.assign({}, ...data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
  };

  /*
   * Render favourite buttons
   * @param {string} showUrlToFavs - URL to favourites page
   * @param {Array} cookie - Favourite cookie data
   * @param {string} id - Item ID
   * @returns {string} - HTML string for favourite buttons
   */
  const renderFavBtns = (showUrlToFavs, cookie, id) => {
    return cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs);
  };

  /*
   * Render a webinar item
   * @param {Object} item - Webinar item data
   * @returns {string} - HTML string for the webinar item
   */
  const renderItem = (item) => {
    const cf = item.custom_fields;
    const data = getDataObject(cf.data);
    const upcoming = new Date(cf.e) > new Date();
    const type = upcoming ? "Live event" : "Watch on-demand";
    const tagColour = type === "Watch on-demand" ? "berry" : "green";
    const level = Array.isArray(cf.level) ? cf.level : [cf.level]; // ensure level is an array before accessing

    const cookieType = "webinar";
    const cookie = stir.favourites && stir.favourites.getFav(cf.sid, cookieType);
    const favId = cf.sid;

    return `
            <div class="cell small-12 large-4 medium-6 u-mb-3">
                <div class="u-border-width-4 u-heritage-${tagColour}-line-left u-p-2 u-relative u-bg-white u-h-full">
                    <div class="u-absolute u-top--16"><span class="u-bg-heritage-${tagColour} u-white u-px-tiny u-py-xtiny text-xxsm">${type}</span></div>
                    <h3 class="u-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-2">
                    <a href="${data.register}" class="u-border-bottom-hover u-border-width-2">${item.custom_fields.h1_custom}</a>
                    </h3>
                    <p class="text-sm">
                        <strong>${new Date(item.custom_fields.d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, 
                            ${new Date(item.custom_fields.d).toLocaleTimeString("en-GB", { hour: "numeric", minute: "numeric", hour12: false })} to 
                            ${new Date(item.custom_fields.e).toLocaleTimeString("en-GB", { hour: "numeric", minute: "numeric", hour12: false, timeZoneName: "short" })}
                        </strong>
                    </p>
                    <p class="text-sm">${item.custom_fields.snippet}</p>
                    <p class="text-sm"><b>Audience:</b> <br/>${level.join("<br/>")}<br/>
                     ${cf.country || ``}</p>
                   
                     <div id="favbtns${favId}">${cookie && renderFavBtns(false, cookie, favId)}</div>
                </div>
            </div>
          `;
  };

  const renderMoreButton = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    if (page < totalPages) {
      return `<div class="text-center cell"><button class="button tiny" data-loadmore="${page + 1}">Load more results</button></div>`;
    }
    return "";
  };

  /*
   * Handle Favourite Button clicks
   */
  const updateFavouriteBtn = (id) => {
    const cookie = stir.favourites.getFav(id, "webinar");
    const favNodes = document.querySelectorAll(`[id*="favbtns${id}"]`);

    favNodes.forEach((favnode) => {
      const btnHtml = renderFavBtns(false, cookie, id);
      favnode.innerHTML = btnHtml;
    });
  };

  const handleFavouriteBtnClick = (event) => {
    const cookieType = "webinar";
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "addtofavs") {
      const id = target.dataset.id.split("|")[0];
      stir.favourites.addToFavs(id, cookieType);
      updateFavouriteBtn(id);
    }

    if (target.dataset.action === "removefav") {
      const id = target.dataset.id.split("|")[0];
      stir.favourites.removeFromFavs(id);
      updateFavouriteBtn(id);
    }
  };

  const handleMoreBtnClick = (node, obj, order) => (event) => {
    const limit = 12;
    if (event.target.tagName === "BUTTON" && event.target.hasAttribute("data-loadmore")) {
      const nextPage = event.target.getAttribute("data-loadmore");
      const formData = new FormData(filtersNode);
      const filterObj = buildFilterObject(formData);
      const currentObj = { ...obj };
      currentObj.and = [...obj.and, ...filterObj.and];
      const filterString = `&filter=${encodeURIComponent(JSON.stringify(currentObj))}&sort=custom_fields.e&order=${order}&limit=${limit}&`;
      const baseUrl = `${searchAPI}?term=*&customField=type%3Dwebinar&`;

      fetch(baseUrl + filterString + `page=${nextPage}`)
        .then((response) => response.json())
        .then((data) => {
          const list = node.querySelector(".grid-x");
          const html = data.hits.map(renderItem).join("");
          event.target.parentNode.remove(); // Remove the old button

          const moreButton = renderMoreButton(data.total_hits, Number(nextPage), limit);
          list.insertAdjacentHTML("beforeend", html + moreButton);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  /*
   * Main Controller
   * Fetch and display webinars
   * @param {string} baseUrl - The base URL for the API
   * @param {HTMLElement} node - The DOM node to display results
   */
  function doListing(baseUrl, node, obj, order) {
    const limit = 12;
    const filterString = `&filter=${encodeURIComponent(JSON.stringify(obj))}&sort=custom_fields.e&order=${order}&limit=${limit}&`;

    fetch(baseUrl + filterString + `page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data.total_hits > 0) {
          const html = data.hits.map(renderItem).join("");
          node.innerHTML = `
            <div class="grid-x">
                <div class="cell u-mb-3">Results based on filters - ${data.total_hits} webinars</div>
                ${html || ``}
                ${renderMoreButton(data.total_hits, data.page, limit)}
            </div>
            `;
        } else {
          node.innerHTML = `<div class="cell">No results found.</div>`;
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  /*
   * Setup event listeners for Load More and Favourite buttons
   * @param {HTMLElement} node - The DOM node containing the listings
   * @param {Object} obj - The filter object for the listings
   * @param {string} order - The order of the listings (asc/desc)
   * @return {void}
   */
  function setupEventListeners(node, obj, order) {
    node.addEventListener("click", function (event) {
      handleMoreBtnClick(node, obj, order)(event);
      handleFavouriteBtnClick(event);
    });
  }

  /*
   * Initialize variables
   */
  const filtersNode = document.getElementById("webinarfilters");
  const upcomingNode = document.getElementById("webinarsUpcoming");
  const onDemandNode = document.getElementById("webinarsOnDemand");

  const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
  const searchUrl = `${searchAPI}?term=*&customField=type%3Dwebinar&`;

  // onload reset the form
  filtersNode.reset();

  const upcomingObj = {
    and: [
      {
        range: { "custom_fields.e": { gt: getNow(), lt: "2099-12-31" } },
      },
    ],
  };

  const onDemandObj = {
    and: [
      { "custom_fields.tag": "OnDemand" },
      {
        range: { "custom_fields.e": { gt: "2019-12-31", lt: getNow() } },
      },
    ],
  };

  /*
   * Initialize on load
   */
  (() => {
    doListing(searchUrl, upcomingNode, upcomingObj, "asc");
    doListing(searchUrl, onDemandNode, onDemandObj, "desc");

    setupEventListeners(upcomingNode, upcomingObj, "asc");
    setupEventListeners(onDemandNode, onDemandObj, "desc");

    filtersNode.addEventListener("change", (event) => {
      event.preventDefault();

      // Get form values
      const formData = new FormData(filtersNode);

      // Build updated filter objects
      const updatedUpcomingObj = { ...upcomingObj };
      updatedUpcomingObj.and = [...upcomingObj.and, ...buildFilterObject(formData).and];

      const updatedOnDemandObj = { ...onDemandObj };
      updatedOnDemandObj.and = [...onDemandObj.and, ...buildFilterObject(formData).and];

      // Fetch and display updated listings
      doListing(searchUrl, upcomingNode, updatedUpcomingObj, "asc");
      doListing(searchUrl, onDemandNode, updatedOnDemandObj, "desc");
    });
  })();
})();
