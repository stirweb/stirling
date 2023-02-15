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
 * @version: 4
 * ------------------------------------------------ */

(function () {
  var postsPerPage = 9;

  /*
   * GLOBAL CONSTANTS
   */

  var constants = {
    postsPerPage: postsPerPage,
    noOfPageLinks: 9,
    macroUK: '["United Kingdom" "Wales" "England" "Scotland" "Northern Ireland"]',
    jsonUrl: "https://www.stir.ac.uk/s/search.json?collection=student-stories&query=!padre&meta_tags=[student alum]&sort=metaimage&fmo=true&num_ranks=".concat(postsPerPage, "&")
  };
  Object.freeze(constants);

  /*
   * DOM ELEMENTS
   */

  var nodes = {
    resultsArea: stir.node("#testimonials-search__results"),
    searchForm: stir.node("#testimonials-search__form"),
    searchLoading: stir.node(".c-search-loading-fixed"),
    inputLevel: stir.node("#testimonials-search__level"),
    inputSubject: stir.node("#testimonials-search__subject"),
    inputRegion: stir.node("#testimonials-search__nationality"),
    inputOnline: stir.node("#testimonials-search__online")
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

  var main = function main(initData, nodes_, consts) {
    if (initData.error) return setDOMContent(nodes_, stir.getMaintenanceMsg());
    if (!gotFBData(initData)) return setDOMContent(nodes_, renderNoResults());
    return setDOMContent(nodes_, renderResults(_objectSpread(_objectSpread({}, initData.response.resultPacket.resultsSummary), consts), initData.response.resultPacket.results));
  };

  /*
   *
   * RENDERERS
   *
   */

  var renderResults = function renderResults(meta, results) {
    return "\n        <div class=\"cell\">\n          ".concat(renderSummary(meta), "\n        </div>\n        <div class=\"cell\">\n          <div class=\"grid-x grid-padding-x\">\n            ").concat(stir.map(function (item, index) {
      return renderCell(item, index, calcResultsPerColumn(results.length, meta.mediaquery), results.length);
    }, results).join(""), "\n            </div>\n        </div>\n        <div class=\"cell\">\n          <div class=\"grid-x grid-padding-x\" id=\"pagination-box\">\n            ").concat(renderPagination(meta), "\n          <div>\n        </div>");
  };

  /* Build the html for a cell (fake masonry) */
  var renderCell = function renderCell(element, index, postsPerCol, totalResults) {
    var newCell = index / postsPerCol % 1 === 0 || index === 0 ? true : false;
    return "\n      ".concat(newCell && index !== 0 ? "</div>" : "", "\n      ").concat(newCell || totalResults === 1 ? "<div class=\"cell small-12 medium-6 large-4 u-padding-bottom\">" : "", "\n      ").concat(renderItem(element.metaData, element.title.split(" | ")[0], element.clickTrackingUrl), " ");
  };

  /* Build the html for an individual story */
  var renderItem = function renderItem(item, fullname, url) {
    var video = item.media && item.media.includes("a_vid") ? renderVideo(item, fullname) : "";
    var image = item.image ? renderImage(item.image, fullname) : "";
    return "\n        <!-- Start testimonial result -->\n        <div class=\"c-testimonial-result\">\n           <div class=\"c-image-block-search-result\">\n              ".concat(video ? video : image, "\n                <div class=\"c-image-block-search-result__body\">\n                  <p class=\"u-font-bold c-image-block-search-result__title\">").concat(fullname, "</p>\n                  ").concat(item.country || item.degreeTitle ? "<cite>" : "", "\n                  ").concat(item.country ? "<span class=\"info\">".concat(item.country, " </span><br />") : "", "\n                  ").concat(item.degreeTitle ? "<span class=\"info\">".concat(item.degreeTitle, "</span>") : "", "\n                  ").concat(item.country || item.degreeTitle ? "</cite>" : "", "\n                  ").concat(item.snippet ? "<blockquote class=\"c-image-block-search-result__quote\">".concat(item.snippet, "</blockquote>") : "", "\n                  <div class=\"c-image-block-search-result__read-more\">\n                      <a href=\"").concat(url, "\" class=\"c-link\">\n                          View \n                          ").concat(pluraliseName(fullname.trim()), "\n                          story</a>\n                  </div>\n                </div> \n            </div> \n        </div>\n        <!-- End testimonial result -->");
  };
  var renderSummary = function renderSummary(meta) {
    return "<p>Showing ".concat(meta.currStart, "-").concat(meta.currEnd, " of <strong>").concat(meta.fullyMatching, " results</strong></p>");
  };
  var renderVideo = function renderVideo(item, fullname) {
    return "\n        <div class=\"u-bg-grey\">\n            <div id=\"vimeoVideo-".concat(item.media.split("-")[1], "\" class=\"responsive-embed widescreen \" \n                data-videoembedid=\" myvid \" data-vimeo-initialized=\"true\">\n                <iframe src=\"https://player.vimeo.com/video/").concat(item.media.split("-")[1], "?app_id=122963\" \n                    allow=\"autoplay; fullscreen\" allowfullscreen=\"\" title=\"Testimonial of \n                    ").concat(fullname, " \" data-ready=\"true\" width=\"426\" height=\"240\" frameborder=\"0\">\n                </iframe>\n            </div>\n        </div>");
  };
  var renderImage = function renderImage(image, fullname) {
    return "<img src=\"https://www.stir.ac.uk".concat(image, "\"  alt=\"").concat(fullname, "\" \n              class=\"c-image-block-search-result__image\" loading=\"lazy\" />");
  };
  var renderNoResults = function renderNoResults() {
    return "\n        <div class=\"cell\">\n            <p class=\"text-center\">We don't have any student stories that match those filters.</p> \n            <p class=\"text-center\"><button class=\"resetBtn button\">Start a new search</button</p>\n        </div>";
  };
  var renderPagination = function renderPagination(meta) {
    if (meta.numRanks >= meta.fullyMatching) return "";
    return StirSearchHelpers.formPaginationHTML(meta.fullyMatching, meta.numRanks, calcCurrentPage(meta.currStart, meta.numRanks), meta.noOfPageLinks);
  };

  /*
   *
   * HELPERS
   *
   */

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
    return name.slice(-1) === "s" ? name + "’" : name + "’s";
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
  var formSearchUrl = function formSearchUrl(url, facets) {
    return url + stir.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];
      return "".concat(key, "=").concat(val);
    }, Object.entries(facets)).join("&");
  };

  /*
   * Query Params helpers
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
   *
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   *
   */

  var setDOMContent = stir.curry(function (nodes_, html) {
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

  var getFacetsFromQueryParams = function getFacetsFromQueryParams(consts) {
    return {
      meta_country: getCountry(QueryParams.get("region"), consts),
      meta_level: QueryParams.get("level") ? QueryParams.get("level") : "",
      meta_course1modes: QueryParams.get("mode") === "online" ? "online" : "",
      meta_subject: getSubject(QueryParams.get("subject")),
      meta_faculty: getFaculty(QueryParams.get("subject")),
      start_rank: getStartRank(QueryParams.get("page"), consts.postsPerPage)
    };
  };
  var fetchData = function fetchData(url, nodes_, consts) {
    stir.getJSON(url, function (initialData) {
      var constsExtended = _objectSpread(_objectSpread({}, consts), {}, {
        mediaquery: stir.MediaQuery.current
      });
      main(initialData, nodes_, constsExtended);
      window.addEventListener("MediaQueryChange", function (e) {
        var constsExtended = _objectSpread(_objectSpread({}, consts), {}, {
          mediaquery: stir.MediaQuery.current
        });
        main(initialData, nodes_, constsExtended);
      });
    });
  };
  var init = function init(nodes_, consts) {
    nodes_.searchLoading && (nodes_.searchLoading.style.display = "flex");
    nodes_.inputRegion.value = QueryParams.get("region") ? QueryParams.get("region") : "";
    nodes_.inputLevel.value = QueryParams.get("level") ? QueryParams.get("level") : "";
    nodes_.inputSubject.value = QueryParams.get("subject") ? QueryParams.get("subject") : "!padrenullquery";
    nodes_.inputOnline.checked = QueryParams.get("mode") === "online" ? true : false;
    fetchData(formSearchUrl(consts.jsonUrl, getFacetsFromQueryParams(consts)), nodes_, consts);
  };

  /*  Live click events  */
  nodes.resultsArea.addEventListener("click", function (e) {
    /* Reset button click */
    if (e.target.matches("button.resetBtn")) {
      stir.each(function (el) {
        return QueryParams.remove(el.name);
      }, QueryParams.getAllArray());
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
  }, false);

  /* Search Form submitted */
  nodes.searchForm.addEventListener("submit", function (e) {
    QueryParams.set("page", 1);
    QueryParams.set("region", nodes.inputRegion.value);
    QueryParams.set("subject", nodes.inputSubject.value);
    QueryParams.set("level", nodes.inputLevel.value);
    nodes.inputOnline.checked ? QueryParams.set("mode", "online") : QueryParams.set("mode", "");
    init(nodes, constants);
    e.preventDefault();
    return;
  }, false);

  /*
   * On Load
   */

  init(nodes, constants);
})();