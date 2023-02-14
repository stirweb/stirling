function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* ------------------------------------------------
 * @author Ryan Kaye
 * @version: 2
 * NO LONGER IN USE - ALL DONE IN T4 NOW
 * ------------------------------------------------ */
(function (resultsArea) {
  if (!resultsArea || !resultsArea.dataset.subject) return;
  /*
   * GLOBAL CONSTANTS
   */

  var jsonUrl = "https://www.stir.ac.uk/s/search.json?collection=stir-courses&sort=title&query=!padrenullquery&start_rank=1&num_ranks=300&";
  /*
   * CONTROLLER
   */

  /* ------------------------------------------------
   * Controls data flow and outputs content to page
   * ------------------------------------------------ */

  var main = function main(initialData) {
    /* Helper function - is there data? */
    var gotFBData = function gotFBData(_d) {
      return _d.response.resultPacket !== null && _d.response.resultPacket.results.length > 0;
    };

    if (initialData.error) {
      return setDOMContent(resultsArea, stir.getMaintenanceMsg());
    }

    if (!gotFBData(initialData)) {
      return setDOMContent(resultsArea, renderNoResults());
    }

    if (gotFBData(initialData)) {
      return setDOMContent(resultsArea, setState(initialData));
    }
  };
  /*
   * STATE
   */

  /* ------------------------------------------------
   * Ready the data in an immutable stylee
   * ------------------------------------------------ */


  var setState = function setState(initialData) {
    var resultsData = stir.clone(initialData.response.resultPacket.results);
    var ugData = stir.filter(function (element) {
      return element.metaData.L.includes("Undergraduate");
    }, resultsData);
    var pgData = stir.filter(function (element) {
      return element.metaData.L.includes("Postgraduate");
    }, resultsData);
    return renderResults("Undergraduate", ugData).concat(renderResults("Postgraduate", pgData));
  };
  /*
   * HELPERS
   */

  /* ------------------------------------------------
   * Form the FunnelBack search url based on params
   * ------------------------------------------------ */


  var getSearchUrl = function getSearchUrl(_jsonUrl, _facets) {
    return _jsonUrl + stir.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];

      return "".concat(key, "=").concat(val);
    }, Object.entries(_facets)).join("&");
  };
  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Form the html for results
   * ------------------------------------------------ */


  var renderResults = function renderResults(_level, _data) {
    if (!_data.length) return "";
    return "\n        <table>\n            <caption>".concat(_level, " courses</caption>\n            <thead>\n                <tr>\n                    <th>Course</th>\n                    <th style=\"width: 30%\">Start date</th>\n                </tr>\n            </thead>\n            <tbody>\n                ").concat(stir.map(renderItem, _data).join(""), "\n            </tbody>\n        </table>");
  };
  /* ------------------------------------------------
   * Form the html for individual items
   * ------------------------------------------------ */


  var renderItem = function renderItem(_item) {
    return "\n        <tr>\n            <td>\n                <a href=\"".concat(_item.displayUrl, "\" data-mode=\"").concat(_item.metaData.M, "\">\n                  ").concat(_item.metaData.B ? _item.metaData.B : "", " ").concat(_item.metaData.t, "\n                </a>\n            </td>\n            <td> \n                ").concat(_item.metaData.sdt, " \n            </td>\n        </tr>");
  };
  /* ------------------------------------------------
   * Form the html for user feedback messages
   * ------------------------------------------------ */


  var renderLoading = function renderLoading() {
    return "<p>Loading courses...</p>";
  };

  var renderNoResults = function renderNoResults() {
    return "<p>No courses found</p>";
  };
  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output html content to the page
   * ------------------------------------------------ */


  var setDOMContent = stir.curry(function (_node, html) {
    _node.innerHTML = html;
    return _node;
  });
  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  setDOMContent(resultsArea, renderLoading());
  var searchUrl = getSearchUrl(jsonUrl, {
    meta_S_and: resultsArea.dataset.subject
  });
  stir.getJSON(searchUrl, main);
})(stir.node("#course-subject-listing"));