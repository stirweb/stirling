(function () {
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

    //const cookieType = "webinar";
    //const cookie = stir.favourites && stir.favourites.getFav(cf.sid, cookieType);
    //const favId = cf.sid;

    return `
            <div class="cell small-12 large-4 medium-6 u-mb-3">
                <div class="u-border-width-4 u-heritage-${tagColour}-line-left u-p-2 u-relative u-bg-grey u-h-full">
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
                </div>
            </div>
          `;
  };

  /*
   * Main Controller
   * Fetch and display webinars
   * @param {string} baseUrl - The base URL for the API
   * @param {HTMLElement} node - The DOM node to display results
   */
  function doListing(baseUrl, node, obj, order) {
    const limit = 3;
    const filterString = `&filter=${encodeURIComponent(JSON.stringify(obj))}&sort=custom_fields.e&order=${order}&limit=${limit}&`;

    fetch(baseUrl + filterString + `page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data.total_hits > 0) {
          const html = data.hits.map(renderItem).join("");
          node.innerHTML = `
                <div class="grid-x">
                    ${html || ``}
                </div>
            `;
        } else {
          node.innerHTML = `<div class="cell">No results found.</div>`;
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  /*
   * Get region filter conditions
   * @param {string} region - The selected region
   * @returns {Array} - Array of filter conditions
   */
  const getRegions = (region, countries) => {
    const countriesArray = countries ? countries.split(", ").map((country) => country.trim()) : [];
    const countryConditions = countriesArray.map((country) => ({ "custom_fields.country": country }));

    const europe = [{ "custom_fields.country": "All EU" }];
    const international = [{ "custom_fields.country": "All international" }, { "custom_fields.country": "All nationalities" }];

    switch (region) {
      case "All Europe":
        return [...countryConditions, ...europe, ...international];
      default:
        return [...countryConditions, ...international];
    }
  };

  /*
   * On Loading
   * Initialize and fetch webinars
   */
  // "countries": "Austria, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Georgia, Germany, Greece, Hungary, Iceland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Russia, Serbia, Slovakia, Slovenia, Spain, Sweden, Switzerland, Turkey, Ukraine, All Europe",
  const region = stir.t4Globals.regions;
  const countries = stir.t4Globals.countries;

  const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
  const searchUrl = `${searchAPI}?term=*&customField=type%3Dwebinar&`;

  const webinarsArea = document.querySelector("[data-webinar]");
  webinarsArea.innerHTML = "loading webinars...";

  const onDemandorUpcomingObj = {
    and: [
      {
        or: [
          {
            and: [
              { "custom_fields.tag": "OnDemand" },
              {
                range: { "custom_fields.e": { gt: "2019-12-31", lt: getNow() } },
              },
            ],
          },
          {
            range: { "custom_fields.e": { gt: getNow(), lt: "2099-12-31" } },
          },
        ],
      },
    ],
  };

  // Build updated filter objects
  const filterObj = { ...onDemandorUpcomingObj };
  const regionFilters = getRegions(region, countries);

  if (regionFilters.length > 0) {
    filterObj.and.push({ or: regionFilters });
  }
  console.log(filterObj);
  doListing(searchUrl, webinarsArea, filterObj, "desc");
})();
