/* 
    Renderer functions
*/
const renderDivider = () => `<div class="cell"><hr /></div>`;

const renderNoItemsMessage = (msg) => `<div class="cell">${msg}</div>`;

const renderHeader = (header, intro) =>
  !header && !intro
    ? ``
    : `<div class="cell u-mt-2 u-margin-bottom">
    ${header ? `<h2>${header}</h2>` : ""}
    ${intro}
  </div>`;

const renderRadioTab = (id, text) => {
  return `<div class="u-border-width-4 u-px-1 u-white-line-top u-bg-medium-grey u-mr-tiny u-box-size-border">
              <label for="${id}" class="u-cursor-pointer u-p-1 text-sm inline-block u-w-full u-whitespace-nowrap">
              <input type="radio" id="${id}" name="view" class="hide" value="${id.replace("view", "")}" />${text}</label>
          </div>`;
};

const renderDateTime = (item) =>
  `<p class="text-sm u-m-0">
    <strong>${item.date}, ${item.time} ${!item.timeend ? `` : `to ${item.timeend}`} (${item.zone})</strong>
  </p>`;

const renderItem = (item) => {
  const statusTag = item.ondemand && !item.isupcoming ? `<span class="u-bg-heritage-berry u-white u-px-tiny u-py-xtiny text-xxsm">Watch on-demand</span>` : item.isupcoming ? `<span class="u-bg-heritage-green u-white u-px-tiny u-py-xtiny text-xxsm">Live event</span>` : ``;
  return `
    <div class="cell small-12 large-4 medium-6 u-mb-3">
      <div class="u-border-width-4 ${item.ondemand && !item.isupcoming ? "u-heritage-berry-line-left" : "u-heritage-line-left"} u-p-2 u-relative u-bg-white u-h-full">
        <div class="u-absolute u-top--16">${statusTag}</div>
        <h3 class="u-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-2">
          <a href="${item.link}" class="u-border-bottom-hover u-border-width-2">${item.title}</a>
        </h3>
        ${item.isupcoming ? renderDateTime(item) : ``}
        <div class="text-sm">${item.description}</div>
        <p class="text-sm">Audience: ${item.studylevels} students. ${item.countries}</p>
      </div>
    </div>`;
};

const renderAllItems = stir.curry((section, items) => {
  if (!items.length && !section.noItems) return ``;
  return `
    <div class="grid-x ">
      ${renderHeader(section.head, section.intro)}
      ${!items.length ? renderNoItemsMessage(section.noItems) : items.map(renderItem).join("")}
      ${section.divider && section.divider === "no" ? `` : renderDivider()}
    </div>`;
});

const renderSummary = (num) => (Number(num) === 0 ? `<p class="u-pb-2 text-sm"><strong>No webinars or information sessions found.</strong></p>` : `<p class="u-pb-2 text-sm">Results based on filters - <strong>${num} webinars</strong></p>`);

const renderPaginationSummary = (start, end, total) => `<p class="u-pb-2 text-sm text-center"><strong>Displaying ${start + 1} to ${end} of ${total} results</strong></p>`;

const renderLoadMoreButon = () => `<div class="text-center"><button class="button hollow tiny u-bg-white" data-loadmore>Load more results</button></div>`;

const renderNoData = (text) => `<p class="text-center text-sm">${text}</p>`;

/*
    Helper functions
*/

const getRegionString = (macros, tag) =>
  macros
    .filter((item) => item.tag === tag)
    .map((el) => el.data)
    .join(", ");

const matchTag = (filter, param, tag) => filter.includes(tag) || param.trim().includes(tag);

const matcher = stir.curry((consts, filter, type, webinarParam) => {
  if (filter.includes(webinarParam.trim()) || webinarParam.trim().includes(filter.trim())) return true;

  if (type === "faculties" && matchTag(filter, webinarParam, "All Faculties")) return true;

  if (type === "countries") {
    if (matchTag(filter, webinarParam, "All nationalities")) return true;

    if (filter.includes("All international")) {
      const ukRegion = getRegionString(consts.macros, "United Kingdom");
      const rukRegion = getRegionString(consts.macros, "RUK");
      return !ukRegion.includes(webinarParam.trim()) && !rukRegion.includes(webinarParam.trim()) && webinarParam.trim();
    }

    const inMacroTags = consts.macros.filter((item) => item.data.includes(filter)).map((item) => item.tag);

    if (inMacroTags.includes(webinarParam)) return true;

    const isMacro = consts.macros.filter((item) => item.tag === filter);
    if (isMacro.length && isMacro[0].data.includes(webinarParam)) return true;
  }

  return false;
});

const filterer = stir.curry((consts, filters, webinar) => {
  const keys = Object.keys(filters).filter((x) => consts.safeList.includes(x));

  return keys.every((key) => {
    if (!webinar[key]) return filters[key] === "";
    const params = webinar[key].split(", ");
    return params.some(matcher(consts, filters[key], key));
  });
});

const getISONow = () => Number(new Date().toISOString().split(".")[0].replaceAll(/[-:T]/g, ""));

const isPast = (item) => !item.isupcoming;

const isUpcoming = (item) => item.isupcoming;

const isOnDemand = (item) => item.ondemand;

const isUpcomingByDate = (compareDate) => (item) => Number(item.datetime) > compareDate;

const sortByDatetime = (a, b) => parseInt(a.datetime) - parseInt(b.datetime);

/* 
    Handle inputs and outputs
*/
const setDOMContent = stir.curry((elem, html) => {
  stir.setHTML(elem, html);
  return elem;
});

const appendDOMContent = stir.curry((elem, html) => {
  elem.insertAdjacentHTML("beforeend", html);
  return elem;
});

const cleanQueryParam = (param) => {
  if (typeof param !== "string") return "";
  return param.replace(/[^a-zA-Z0-9-_]/g, ""); // Remove any non-alphanumeric characters except hyphen and underscore
};

const SafeQueryParams = {
  get: (key) => cleanQueryParam(QueryParams.get(key)),
  set: (key, value) => QueryParams.set(key, cleanQueryParam(value)),
  remove: QueryParams.remove,
};

/* OutPut Section Content */
function outputSectionContent(filters, node, data) {
  const { upcomingData, onDemandData } = data;
  const all = [...upcomingData, ...onDemandData];

  const renderCurry = renderAllItems(filters);

  all.length > 0 ? setDOMContent(node, renderCurry(all)) : setDOMContent(node, renderSummary(0));
}

/* OutPut Form Content */
function outPutFormContent(consts, filters, node, event, data) {
  const { upcomingData, onDemandData } = data;
  const all = [...upcomingData, ...onDemandData];

  const { itemsPerPage } = consts;
  const page = filters.page;
  const start = itemsPerPage * (page - 1);
  const end = start + itemsPerPage;

  if (upcomingData.length && !stir.node("#viewlive")) {
    appendDOMContent(consts.radioTabs, renderRadioTab("viewlive", "View upcoming live"));
  } else if (filters.params.view === "live" && !stir.node("#viewlive")) {
    appendDOMContent(consts.radioTabs, renderRadioTab("viewlive", "View upcoming live"));
  }

  if (onDemandData.length && !stir.node("#viewondemand")) {
    appendDOMContent(consts.radioTabs, renderRadioTab("viewondemand", "On demand"));
  } else if (filters.params.view === "ondemand" && !stir.node("#viewondemand")) {
    appendDOMContent(consts.radioTabs, renderRadioTab("viewondemand", "On demand"));
  }

  const renderResults = (data) => {
    const summaryHtml = start === 0 ? renderSummary(data.length) : renderPaginationSummary(start, end, data.length);
    const endHtml = data.length > end ? renderLoadMoreButon() : renderNoData(``);

    const setDOMResults = event === "new" ? setDOMContent(node) : appendDOMContent(node);
    const renderCurry = renderAllItems(filters);

    return setDOMResults(summaryHtml + renderCurry(data.slice(start, end)) + endHtml);
  };

  switch (filters.params.view) {
    case "live":
      return renderResults(upcomingData);
    case "ondemand":
      return renderResults(onDemandData);
    default:
      return all.slice(start, end).length ? null : setDOMContent(node, "<p>No webinars or information sessions found</p>");
  }
}

/* 
    Process Data controller function
*/
function processData(consts, data, filters) {
  const now = getISONow();

  // Data processing pipeline
  const processWebinars = stir.compose(
    stir.filter(filterer(consts, filters.params)),
    stir.map((item) => ({ ...item, isupcoming: isUpcomingByDate(now)(item) })),
    stir.filter((item) => item.title)
  );

  const webinarsData = processWebinars(data);
  const upcomingData = stir.compose(stir.sort(sortByDatetime), stir.filter(isUpcoming))(webinarsData);

  const onDemandData = stir.compose(
    stir.sort((a, b) => -sortByDatetime(a, b)), // Reverse sort for on-demand
    stir.filter(isOnDemand),
    stir.filter(isPast)
  )(webinarsData);

  //const all = [...upcomingData, ...onDemandData];

  return { upcomingData: upcomingData, onDemandData: onDemandData };
}

/*
    Form Controller
*/
function doForm(consts, node, allData, event, form) {
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());

  Object.entries(formDataObject).forEach(([key, value]) => SafeQueryParams.set(key, value));

  const filters = {
    page: SafeQueryParams.get("page"),
    params: {
      series: "",
      countries: mapQueryParams(formDataObject.region),
      subjects: "",
      studylevels: mapQueryParams(formDataObject.studylevel),
      faculties: "",
      categories: mapQueryParams(formDataObject.category),
      view: formDataObject.view,
    },
    divider: "no",
  };

  const data = processData(consts, allData, filters);
  outPutFormContent(consts, filters, node, event, data);

  //if (node.innerHTML === "") setDOMContent(node, "<p>No webinars found</p>");
}

/* 
    Event Handlers
*/
const handleFormChange = (consts, webinarResultsArea, dataWebinars) => () => {
  SafeQueryParams.set("page", "1");
  doForm(consts, webinarResultsArea, dataWebinars, "new", stir.node("#webinarfilters"));
};

const handleRadioClick = (consts, webinarResultsArea, dataWebinars) => (e) => {
  SafeQueryParams.set("view", e.target.value);
  SafeQueryParams.set("page", "1");

  doForm(consts, webinarResultsArea, dataWebinars, "new", stir.node("#webinarfilters"));
  stir.nodes("#webinarfilters input").forEach((r) => r.closest("div").classList.remove("u-bg-grey", "u-energy-line-top"));
  e.target.closest("div").classList.add("u-bg-grey", "u-energy-line-top");
};

const handlePagination = (consts, webinarResultsArea, dataWebinars) => (e) => {
  if (e.target.nodeName === "BUTTON") {
    const page = Number(SafeQueryParams.get("page")) || 1;
    SafeQueryParams.set("page", String(page + 1));
    doForm(consts, webinarResultsArea, dataWebinars, "append", stir.node("#webinarfilters"));
    e.target.scrollIntoView({ behavior: "smooth" });
    e.target.classList.add("hide");
  }
};

/* 
    Tab scrolling function

function handleTabScroll(el, container, event) {
  const itemWidth = el.closest("div").offsetWidth;
  const containerBounds = container.parentElement.getBoundingClientRect();
  const pos = el.closest("div").getBoundingClientRect();

  if (pos.right > containerBounds.width) {
    container.scrollBy({ left: itemWidth, behavior: "smooth" });

    if (event === "onload") {
      setTimeout(() => {
        const newRight = el.closest("div").getBoundingClientRect().right;
        const maxRight = container.parentElement.getBoundingClientRect().right;
        const offsetRight = window.screen.width - maxRight;
        const diff = newRight - maxRight + offsetRight * 2;

        newRight < maxRight && container.scrollBy({ left: diff, behavior: "smooth" });
      }, 500);
    }
  }
  if (pos.left < containerBounds.left) {
    container.scrollBy({ left: -itemWidth, behavior: "smooth" });
  }
}
*/

const mapQueryParams = (val) => {
  const value = val.replaceAll("-", " ");

  if (value === "Postgraduate taught") {
    return "Postgraduate (taught)";
  }
  if (value === "Postgraduate research") {
    return "Postgraduate (research)";
  }
  return value;
};

/* 
    Initialize
*/
function initWebinarForm(consts, dataWebinars) {
  if (!consts.webinarResultsArea) return;

  const webinarResultsArea = consts.webinarResultsArea;
  if (!webinarResultsArea) return;

  SafeQueryParams.set("page", "1");

  const params = {
    category: SafeQueryParams.get("category") ? SafeQueryParams.get("category") : ``,
    studylevel: SafeQueryParams.get("studylevel") ? SafeQueryParams.get("studylevel") : ``,
    region: SafeQueryParams.get("region") ? SafeQueryParams.get("region") : ``,
    view: SafeQueryParams.get("view") ? SafeQueryParams.get("view") : `live`,
    page: 1,
  };

  const filters = {
    page: params.page,
    params: {
      series: "",
      countries: mapQueryParams(params.region),
      subjects: "",
      studylevels: mapQueryParams(params.studylevel),
      faculties: "",
      categories: mapQueryParams(params.category),
      view: params.view,
    },
    divider: "no",
  };

  const data = processData(consts, dataWebinars, filters);
  outPutFormContent(consts, filters, webinarResultsArea, "new", data);

  //if (webinarResultsArea.innerHTML === "") setDOMContent(webinarResultsArea, "<p>No webinars or information sessions found.</p>");

  // Event listeners
  stir.nodes("#webinarfilters select").forEach((select) => {
    select.value = params[select.name];
    select.addEventListener("change", handleFormChange(consts, webinarResultsArea, dataWebinars));
  });

  consts.radioTabs.addEventListener("click", (e) => {
    if (e.target.nodeName === "INPUT") {
      handleRadioClick(consts, webinarResultsArea, dataWebinars)(e);
    }
  });

  var radioTabs = stir.nodes("#webinarfilters input");
  radioTabs.forEach((radio) => {
    if (radio.value === params[radio.name]) {
      radio.checked = true;
      radio.closest("div").classList.add("u-bg-grey", "u-energy-line-top");
    }
  });

  webinarResultsArea.addEventListener("click", handlePagination(consts, webinarResultsArea, dataWebinars));
}

/* 
    Initialize webinar sections
*/
function initWebinarSections(consts, dataWebinars, dataWebinarFilters) {
  if (!consts.webinarSections.length) return;

  const webinarSections = consts.webinarSections;
  webinarSections.forEach((element) => {
    const data = processData(consts, dataWebinars, dataWebinarFilters[element.dataset.webinarsects]);
    outputSectionContent(dataWebinarFilters[element.dataset.webinarsects], element, data);
  });

  const disclaimerArea = stir.node("[data-webinardisclaimer]");
  if (disclaimerArea) {
    const contentLength = webinarSections
      .map((element) => element.innerText)
      .join("")
      .trim().length;

    if (contentLength < 1) {
      setDOMContent(disclaimerArea, stir.t4Globals.webinarsdisclaimer || "");
    }
  }
}

/* 
    On load execution
*/
(function (scope) {
  if (!scope) return;

  const CONSTS = {
    webinarResultsArea: stir.node("#webinarresults"),
    radioTabs: stir.node("#radioTabs"),
    webinarSections: stir.nodes("[data-webinarSects]"),
    itemsPerPage: 6,
    safeList: ["countries", "series", "subjects", "studylevels", "faculties", "categories"],
    macros: (stir.t4Globals.regionmacros || []).filter((item) => item.tag),
  };

  const dataWebinarFilters = stir.t4Globals.webinarSectionData || {};

  function getApiUrl(env) {
    switch (env) {
      case "dev":
        return "index.json";
      case "preview":
        return '<t4 type="navigation" id="5271" />';
      default:
        return '<t4 type="navigation" id="5271" />' + "index.json";
    }
  }

  /* Move to T4
  function removeDuplicates(arr, key) {
    return arr.reduce((unique, item) => {
      const found = unique.find((i) => i[key] === item[key]);
      if (!found) {
        return [...unique, item];
      }
      return unique;
    }, []);
  } */

  // Fetch function to get webinar data
  function fetchWebinarData(apiUrl) {
    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("There was a problem fetching the webinar data:", error);
        return []; // Return an empty array in case of error
      });
  }

  // Initialization function to use fetched data
  function initializeWebinars(dataWebinars) {
    initWebinarForm(CONSTS, dataWebinars);
    initWebinarSections(CONSTS, dataWebinars, dataWebinarFilters);
  }

  // Fetch data and initialize
  fetchWebinarData(getApiUrl(UoS_env.name)).then((dataWebinars) => {
    initializeWebinars(dataWebinars);
  });
})(stir.nodes("[data-webinar]"));
