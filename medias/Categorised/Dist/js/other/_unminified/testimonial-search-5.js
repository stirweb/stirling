function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 5
 * ------------------------------------------------ */

(function () {
  /*
      SEARCH CONFIG AND URL REFERENCES
   */

  //const server = 'stir-search.clients.uk.funnelback.com';
  var server = "search.stir.ac.uk";
  var urlBase = "https://".concat(server); // ClickTracking
  var jsonBase = "".concat(urlBase, "/s/search.json?");
  var scaleImage = stir.curry(function (server, image) {
    return "https://".concat(server, "/s/scale?url=").concat(encodeURIComponent(image), "&width=500&height=500&format=jpeg&type=crop_center");
  });
  var scaleImageWithFunnelback = scaleImage(server);
  var sf = "profileDegreeTitle,profileCountry,profileCourse,profileCourse1,profileCourse1Url,profileCourse1Modes,profilecourse1Delivery,profileCourse2,profileCourse2Url,profilecourse2Delivery,profileCourse2Modes,profileFaculty,profileSubject,profileYearGraduated,profileLevel,profileTags,profileSnippet,profileImage,profileMedia";
  var postsPerPage = 9;
  var collection = "stir-www";
  var sortBy = "metaprofileImage";
  var tags = "[student alum]";

  /*
      CONSTANTS
   */

  var CONSTS = {
    postsPerPage: postsPerPage,
    noOfPageLinks: 9,
    macroUK: '["United Kingdom" "Wales" "England" "Scotland" "Northern Ireland"]',
    urlBase: urlBase,
    jsonUrl: "".concat(jsonBase, "collection=").concat(collection, "&query=!padre&meta_profileTags=[").concat(tags, "]&sort=").concat(sortBy, "&fmo=true&num_ranks=").concat(postsPerPage, "&SF=[").concat(sf, "]&meta_v=/student-stories/&"),
    onlineText: "online&meta_profilecourse1Delivery_or=hybrid"
  };
  Object.freeze(CONSTS);
  var NODES = {
    resultsArea: stir.node("#testimonials-search__results"),
    searchForm: stir.node("#testimonials-search__form"),
    searchLoading: stir.node(".c-search-loading-fixed"),
    inputLevel: stir.node("#testimonials-search__level"),
    inputSubject: stir.node("#testimonials-search__subject"),
    inputRegion: stir.node("#testimonials-search__nationality"),
    inputOnline: stir.node("#testimonials-search__online")
  };
  if (!NODES.resultsArea || !NODES.searchForm) return;

  /*
      CONTROLLER
   */

  var main = function main(data, nodes, consts) {
    if (data.error) return setDOMContent(nodes, 1, stir.getMaintenanceMsg());
    if (!gotFBData(data)) return setDOMContent(nodes, 1, renderNoResults());
    var meta = _objectSpread(_objectSpread({}, data.response.resultPacket.resultsSummary), consts);
    return setDOMContent(nodes, calcCurrentPage(meta.currStart, meta.numRanks), renderResults(meta, data.response.resultPacket.results));
  };

  /*
      RENDERERS
   */

  var renderResults = function renderResults(meta, results) {
    return "\n          <div class=\"cell text-center u-pb-2\">\n            ".concat(renderSummary(meta), "\n          </div>\n          <div class=\"cell\">\n            <div class=\"grid-x grid-padding-x\">\n              ").concat(stir.map(function (item, index) {
      return renderCell(item, index, meta, results.length);
    }, results).join(""), "\n              </div>\n          </div>\n          <div class=\"cell\">\n            <div class=\"grid-x grid-padding-x\" id=\"pagination-box\">\n              ").concat(renderPagination(calcCurrentPage(meta.currStart, meta.numRanks) + 1, meta.fullyMatching, meta.currEnd), "\n            <div>\n          </div>");
  };

  /* 
    Form the html for the pagination  
  */
  var renderPagination = function renderPagination(currentPage, totalPosts, last) {
    return last >= totalPosts ? "" : "<div class=\"cell text-center\">\n                <button class=\"button hollow tiny\" data-page=\"".concat(currentPage, "\">Load more results</button>\n          </div>");
  };

  /* Build the html for a cell (fake masonry) */
  var renderCell = function renderCell(element, index, meta, totalResults) {
    var newCell = isNewCell(totalResults, meta.mediaquery, index);
    return "\n        ".concat(newCell && index !== 0 ? "</div>" : "", "\n        ").concat(newCell || totalResults === 1 ? "<div class=\"cell small-12 medium-6 large-4 u-padding-bottom\">" : "", "\n        ").concat(renderItem(element.metaData, formatName(element.title), meta.urlBase + element.clickTrackingUrl), " ");
  };

  /* Build the html for an individual story */
  var renderItem = function renderItem(item, fullname, url) {
    return "\n          <!-- Start testimonial result -->\n            <div class=\"u-mb-2 u-bg-grey \">\n              ".concat(renderVideo(item, fullname, item.profileMedia) ? renderVideo(item, fullname, item.profileMedia) : renderImage(item.profileImage, fullname), "\n                <div class=\"u-p-2\">\n                  <p class=\"u-font-bold \">").concat(fullname, "</p>\n                  ").concat(item.profileCountry || item.profileDegreeTitle ? "<cite>" : "", "\n                  ").concat(item.profileCountry ? "<span class=\"info\">".concat(item.profileCountry, " </span><br />") : "", "\n                  ").concat(item.profileDegreeTitle ? "<span class=\"info\">".concat(item.profileDegreeTitle, "</span>") : "", "\n                  ").concat(item.profileCountry || item.degreeTitle ? "</cite>" : "", "\n                  ").concat(item.profileSnippet ? "<blockquote class=\"u-border-none u-my-2 u-black u-p-0 u-quote u-text-regular\">".concat(item.profileSnippet, "</blockquote>") : "", "\n                  \n                  <a href=\"").concat(url, "\" class=\"c-link\">View ").concat(pluraliseName(fullname.trim()), " story</a>\n                </div> \n            </div> \n          <!-- End testimonial result -->");
  };
  var renderSummary = function renderSummary(meta) {
    return "<p>Showing ".concat(meta.currStart, "-").concat(meta.currEnd, " of <strong>").concat(meta.fullyMatching, " results</strong></p>");
  };
  var renderVideo = function renderVideo(item, fullname, media) {
    return media && media.includes("a_vid") ? "\n        <div class=\"u-bg-grey\">\n            <div id=\"vimeoVideo-".concat(item.profileMedia.split("-")[1], "\" class=\"responsive-embed widescreen \" \n                data-videoembedid=\" myvid \" data-vimeo-initialized=\"true\">\n                <iframe src=\"https://player.vimeo.com/video/").concat(item.profileMedia.split("-")[1], "?app_id=122963\" \n                    allow=\"autoplay; fullscreen\" allowfullscreen=\"\" title=\"Testimonial of \n                    ").concat(fullname, " \" data-ready=\"true\" width=\"426\" height=\"240\" frameborder=\"0\">\n                </iframe>\n            </div>\n        </div>") : "";
  };
  var renderImage = function renderImage(image, fullname) {
    if (!image) return "";
    var url = "https://www.stir.ac.uk".concat(image);
    return "<img src=\"".concat(scaleImageWithFunnelback(url), "\" alt=\"").concat(fullname, "\"  loading=\"lazy\" width=500 height=500 onerror=\"this.onerror='';this.src='").concat(url, "'\" />");
  };
  var renderNoResults = function renderNoResults() {
    return "\n          <div class=\"cell\">\n              <p class=\"text-center\">We don't have any student stories that match those filters.</p> \n              <p class=\"text-center\"><button class=\"resetBtn button\">Start a new search</button</p>\n          </div>";
  };

  /*
      HELPERS
   */

  var isNewCell = function isNewCell(total, mediaquery, index) {
    return index / calcResultsPerColumn(total, mediaquery) % 1 === 0 || index === 0 ? true : false;
  };
  var gotFBData = function gotFBData(data) {
    return data.response.resultPacket !== null && data.response.resultPacket.results.length > 0;
  };
  var calcCurrentPage = function calcCurrentPage(start, total) {
    return Math.floor(start / total + 1);
  };
  var calcResultsPerColumn = function calcResultsPerColumn(totalResults, mediaquery) {
    return Math.round(totalResults / getNoCols(mediaquery));
  };
  var pluraliseName = function pluraliseName(name) {
    return name.slice(-1) === "s" ? name + "\u2019" : name + "\u2019s";
  };
  var formatName = function formatName(name) {
    return name.split(" | ")[0].trim();
  };
  var formSearchUrl = function formSearchUrl(url, facets) {
    return url + stir.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];
      return "".concat(key, "=").concat(val);
    }, Object.entries(facets)).join("&");
  };

  /* Returns number of columns required for fake Masonry layout for a specific screen size */
  var getNoCols = function getNoCols(mediaquery) {
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

  var getStartRank = function getStartRank(page, postsPerPage) {
    return stir.isNumeric(page) ? (page - 1) * postsPerPage + 1 : 1;
  };
  var getSubject = function getSubject(value) {
    if (!value || value.split(":").length < 2) return "";
    if (value.split(":")[0] === "|[subject") return value.split(":")[1];
    return "";
  };
  var getFaculty = function getFaculty(value) {
    if (!value || value.split(":").length < 2) return "";
    if (value.split(":")[0] === "|[faculty") return value.split(":")[1];
    return "";
  };
  var getCountry = function getCountry(country, consts) {
    var meta_country = country ? country : "";
    if (meta_country === "United Kingdom") return consts.macroUK;
    return meta_country;
  };

  /*
      EVENTS: OUTPUT RESULTS (!!SIDE EFFECTS!!)
   */

  var setDOMContent = stir.curry(function (nodes, page, html) {
    if (page !== 1) return nodes.resultsArea.insertAdjacentHTML("beforeend", html);
    stir.setHTML(nodes.resultsArea, html);
    stir.scrollToElement(nodes.searchForm, -50);
    return true;
  });

  /*
      EVENTS: INPUTS (!!SIDE EFFECTS!!)
   */

  var getFacetsFromQueryParams = function getFacetsFromQueryParams(consts) {
    return {
      meta_profileCountry: getCountry(QueryParams.get("region"), consts),
      meta_profileLevel: QueryParams.get("level") ? QueryParams.get("level") : "",
      meta_profilecourse1Delivery_or: QueryParams.get("mode") === "online" ? consts.onlineText : "",
      meta_profileSubject: getSubject(QueryParams.get("subject")),
      meta_profileFaculty: getFaculty(QueryParams.get("subject")),
      start_rank: getStartRank(QueryParams.get("page"), consts.postsPerPage)
    };
  };

  /* fetchData */
  var fetchData = function fetchData(url, nodes, consts) {
    stir.getJSON(url, function (initialData) {
      main(initialData, nodes, _objectSpread(_objectSpread({}, consts), {}, {
        mediaquery: stir.MediaQuery.current
      }));
      window.addEventListener("MediaQueryChange", function (e) {
        main(initialData, nodes, _objectSpread(_objectSpread({}, consts), {}, {
          mediaquery: stir.MediaQuery.current
        }));
      });
    });
  };

  /* init */
  var init = function init(nodes, consts) {
    nodes.inputRegion.value = QueryParams.get("region") ? QueryParams.get("region") : "";
    nodes.inputLevel.value = QueryParams.get("level") ? QueryParams.get("level") : "";
    nodes.inputSubject.value = QueryParams.get("subject") ? QueryParams.get("subject") : "!padrenullquery";
    nodes.inputOnline.checked = QueryParams.get("mode") === "online" ? true : false;
    fetchData(formSearchUrl(consts.jsonUrl, getFacetsFromQueryParams(consts)), nodes, consts);
  };

  /*  Live click events  */
  NODES.resultsArea.addEventListener("click", function (e) {
    /* Reset button click */
    if (e.target.matches("button.resetBtn")) {
      stir.each(function (el) {
        return QueryParams.remove(el.name);
      }, QueryParams.getAllArray());
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
  }, false);

  /* Search Form submitted */
  NODES.searchForm.addEventListener("submit", function (e) {
    QueryParams.set("page", 1);
    QueryParams.set("region", NODES.inputRegion.value);
    QueryParams.set("subject", NODES.inputSubject.value);
    QueryParams.set("level", NODES.inputLevel.value);
    NODES.inputOnline.checked ? QueryParams.set("mode", "online") : QueryParams.set("mode", "");
    init(NODES, CONSTS);
    e.preventDefault();
    return;
  }, false);

  /*
     ON LOAD
   */

  init(NODES, CONSTS);
})();