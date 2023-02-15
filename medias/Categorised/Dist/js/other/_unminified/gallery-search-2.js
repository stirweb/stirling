function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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

  var funnelbackServer = "https://search.stir.ac.uk";
  var funnelbackUrl = "https://search.stir.ac.uk/s/search.json?";
  var fbConfig = {
    collection: "stir-www",
    query: "!padre",
    num_ranks: "1000",
    meta_type_and: "gallery",
    sort: "dmetad",
    SF: "[tags|custom]",
    fmo: "true"
  };
  var fbQuery = stir.map(function (item) {
    return item + "=" + encodeURIComponent(fbConfig[item]);
  }, Object.keys(fbConfig)).join("&");
  var CONSTS = {
    funnelbackServer: funnelbackServer,
    resultsArea: scope,
    searchForm: stir.node("#gallery-search__form"),
    searchInputs: stir.nodes("#gallery-search__form select"),
    postsPerPage: 12,
    noOfPageLinks: 9,
    jsonUrl: funnelbackUrl + fbQuery
  };
  Object.freeze(CONSTS);

  /*
      CONTROLLER
   */

  var main = function main(filters, consts, initData) {
    // Guards
    if (initData.error) return setDOMContent(consts.resultsArea, stir.getMaintenanceMsg());
    if (!gotData(initData)) return setDOMContent(consts.resultsArea, renderNoResults());

    // Helper Curry function
    var filterer = filterData(filters);
    var filteredData = stir.filter(filterer, initData.response.resultPacket.results);
    if (!filteredData.length) return setDOMResult(renderNoResults());
    var meta = getMetaData(consts, filters, filteredData.length);
    var setDOMResult = meta.page === "1" ? setDOMContent(consts.resultsArea) : appendDOMContent(consts.resultsArea);

    // Helper Curry functions
    var renderer = renderAll(meta);
    var pagerer = stir.filter(function (el, i) {
      return i >= meta.start && i <= meta.last;
    });
    return stir.compose(setDOMResult, renderer, pagerer)(filteredData);
  };

  /*
      STATE
   */

  /* FUNCTION: @return boolean */
  var gotData = function gotData(data) {
    return data.response.resultPacket !== null && data.response.resultPacket.results.length;
  };

  /* FUNCTION: @return JSON object of all meta data for this search for pagination etc */
  var getMetaData = function getMetaData(consts, filters, size) {
    var pageFiltered = stir.filter(function (el) {
      return el.name === "page";
    }, filters);
    var pageExtracted = pageFiltered.length ? pageFiltered[0].value : 1;
    var page = stir.isNumeric(pageExtracted) ? pageExtracted : 1;
    var start = (page - 1) * consts.postsPerPage;
    var end = page * consts.postsPerPage - 1;
    var last = end > size ? size : end;
    return _objectSpread(_objectSpread({}, {
      page: page,
      start: start,
      end: end,
      total: size,
      last: last
    }), consts);
  };

  /* FUNCTION: @return object of filtered gallery items */
  var filterData = stir.curry(function (filters, element) {
    if (!element) return false;
    var filtersCleaned = stir.filter(function (item) {
      return item.name && item.name !== "page";
    }, filters);
    var tags = {
      meta_dyear: new Date(element.date).getFullYear(),
      meta_tags: element.metaData.tags
    };
    var matches = stir.map(function (filter) {
      return String(tags[filter.name]).includes(filter.value);
    }, filtersCleaned);
    return stir.all(function (x) {
      return x;
    }, matches);
  });

  /*
      RENDERERS
   */

  /* FUNCTION: @return String of html  */
  var renderAll = stir.curry(function (meta, data) {
    var renderItemCurry = renderItem(meta);
    return "\n        ".concat(renderSummary(meta), "\n        ").concat(data.map(function (element) {
      return renderItemCurry(element);
    }).join(""), "\n        ").concat(renderPagination(meta));
  });

  /* FUNCTION: @return String of html  */
  var renderItem = stir.curry(function (meta, item) {
    return "\n        <div class=\"cell small-12 medium-6 large-4 u-mb-2\">\n          <a href=\"".concat(meta.funnelbackServer).concat(item.clickTrackingUrl, "\">\n            <div>\n              <div class=\"c-photo-gallery__thumb\">\n                <img src=\"").concat(renderThumbnail(item.metaData.custom), "\" loading=\"lazy\" alt=\"").concat(item.title.split("|")[0].trim(), "\">\n              </div>\n            </div>\n            <div class=\"cell small-12 u-bg-grey u-p-2\">\n              <p><strong>").concat(item.title.split("|")[0].trim(), "</strong></p>\n              <p class=\"text-sm u-black\">").concat(stir.Date.galleryDate(new Date(item.date)), "</p>\n            </div>\n          </a>\n        </div>");
  });

  /*  FUNCTION: @return String of html  */
  var renderThumbnail = function renderThumbnail(image) {
    if (!image) return "";
    var images = image.split("|").filter(function (element) {
      return JSON.parse(element).hasOwnProperty("farm");
    });
    if (!images.length) return "";
    var imageItem = JSON.parse(images[0]);
    return "https://farm".concat(imageItem.farm, ".staticflickr.com/").concat(imageItem.server, "/").concat(imageItem.id, "_").concat(imageItem.secret, "_z.jpg");
  };

  /*  FUNCTION: @return String of html  */
  var renderSummary = function renderSummary(meta) {
    return "\n        <div class=\"cell u-mb-1 text-center\">\n          <p>Showing ".concat(meta.start + 1, " -\n            ").concat(parseInt(meta.end) >= parseInt(meta.total) ? meta.total : meta.end + 1, " \n            of ").concat(meta.total, " results</p>\n        </div>");
  };

  /* FUNCTION: @return String of html  */
  var renderPagination = function renderPagination(_ref) {
    var last = _ref.last,
      total = _ref.total,
      page = _ref.page;
    return last >= total ? "" : "<div class=\"cell text-center\" id=\"pagination-box\">\n            <button class=\"button hollow tiny\" data-page=\"".concat(Number(page) + 1, "\">Load more results</button>\n        </div>");
  };
  var renderNoResults = function renderNoResults() {
    return "<div class=\"cell\"><p>No galleries found </p></div>";
  };

  /*
     EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  var setDOMContent = stir.curry(function (node, html) {
    stir.setHTML(node, html);
    return node;
  });
  var appendDOMContent = stir.curry(function (node, html) {
    node.insertAdjacentHTML("beforeend", html);
    return node;
  });

  /*
     EVENTS: INPUT ACTIONS (!!SIDE EFFECTS!!)
   */

  /* 
    ON LOAD: 
  */
  var params = QueryParams.getAll();
  stir.each(function (item) {
    return params[item.name] && (item.value = params[item.name]);
  }, CONSTS.searchInputs);

  // Fetch for the data
  stir.getJSON(CONSTS.jsonUrl, function (initialData) {
    main(QueryParams.getAllArray(), CONSTS, initialData);

    // Listener: Form submit
    CONSTS.searchForm && CONSTS.searchForm.addEventListener("submit", function (e) {
      QueryParams.set("page", 1);
      CONSTS.searchInputs.forEach(function (item) {
        return QueryParams.set(item.name, item.value);
      });
      main(QueryParams.getAllArray(), CONSTS, initialData);
      e.preventDefault();
      return;
    }, false);

    // Listener: Pagination clicks
    CONSTS.resultsArea.addEventListener("click", function (e) {
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