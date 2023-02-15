function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*
   @author: Ryan Kaye
   @version: 1
   @description: Outputs all courses that match the tags provided
 */

(function (scope) {
  if (!scope) return;
  var resultAreas = scope;
  var debug = window.location.hostname == "localhost" || window.location.hostname == "mediadev.stir.ac.uk" ? true : false;

  /*
   @getDomFilters: Maps and filters (empty vals) all data-** attributes on the node. Returns an array of objects
  */
  var getDomFilters = function getDomFilters(domData) {
    return stir.map(function (el) {
      return {
        name: el[0],
        value: el[1].trim()
      };
    }, domData);
  };

  /* 
   @main: Controller
  */
  var main = function main(node_, initialData_) {
    var filtersNode = node_.querySelector(".filtersbox");
    var resultNode = node_.querySelector(".resultbox");
    setDOMContent(filtersNode, renderEmptyFilter());
    var filterSelect = filtersNode.querySelector("select");
    filterSelect && filterSelect.addEventListener("change", function (event) {
      event.preventDefault();
      var val = event.target.options[event.target.selectedIndex].value;
      return processData(node_, resultNode, filterSelect, initialData_, val);
    });
    return processData(node_, resultNode, filterSelect, initialData_, "");
  };

  /*
    @processData: Control data flow
  */
  var processData = function processData(node_, resultNode, filterSelect, initialData_, subjectFilterValue) {
    // Filters
    var filtersAttributes = Object.entries(resultNode.dataset);
    var filtersSubject = [{
      name: "subject",
      value: subjectFilterValue
    }];
    var filtersAll1 = getDomFilters(filtersAttributes);
    var filtersAll = stir.filter(function (el) {
      return el.value !== "";
    }, filtersAll1); // remove empties
    var filtersAllSubject1 = [].concat(_toConsumableArray(filtersAll), filtersSubject);
    var filtersAllSubject = stir.filter(function (el) {
      return el.value !== "";
    }, filtersAllSubject1); // remove empties

    // Course data
    var filteredData1 = stir.filter(function (el) {
      return el.title;
    }, initialData_); // remove empties
    var filteredData = stir.filter(filterData(filtersAll), filteredData1);
    var filteredDataSubject = stir.filter(filterData(filtersAllSubject), filteredData);

    // Subject select list
    var subjectFilters1 = filteredData.map(function (el) {
      return el.subject;
    }).join(", ").split(", ");
    var subjectFilters = stir.removeDuplicates(subjectFilters1).sort();
    setDOMContent(filterSelect, renderFilterOptions(subjectFilters, subjectFilterValue));

    // How the data should be displayed
    var view = node_.dataset["render"] ? node_.dataset["render"] : "";

    // Curry helper functions
    var sortDataCurry = stir.sort(function (a, b) {
      return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
    });
    var renderData = render(view);
    var setDOMResults = setDOMContent(resultNode);

    // Pass the raw data through the curry functions till it reaches the page
    stir.compose(setDOMResults, renderData, sortDataCurry)(filteredDataSubject);
  };

  /*
    @filterData: Filter an item (_element) based on params (_filters) supplied
   Returns an Array of JSON Objects
  */
  var filterData = stir.curry(function (_filters, _element) {
    var isTrue = function isTrue(x) {
      return x;
    };

    // Helper function: check to see if there is a match for each facet
    // Map true or false for each split up (,) facet item - [use indexOf() for compat with IE]
    var matchMapper = function matchMapper(f) {
      var tempMatches = stir.map(function (el) {
        return f.value.indexOf(el.trim()) !== -1;
      }, _element[f.name].split(","));
      return stir.any(isTrue, tempMatches);
    };
    return stir.all(isTrue, stir.map(matchMapper, _filters));
  });

  /*
    @render: Returns a String (HTML)
  */
  var render = stir.curry(function (view, items) {
    if (view === "compact") return stir.map(renderItemsCompact, items).join("");
    return stir.map(renderItems, items).join("");
  });

  /*
   @renderFilterOptions: Returns a String (HTML)
  */
  var renderFilterOptions = function renderFilterOptions(filters, selected) {
    return "<option value=\"\">Filter by subject...</option>\n\t\t\t".concat(filters.map(function (item) {
      return "<option value=\"".concat(item, "\" ").concat(item === selected ? "selected" : "", ">").concat(item, "</option>");
    }).join(""));
  };

  /*
    @renderEmptyFilter: Returns a String (HTML)
  */
  var renderEmptyFilter = function renderEmptyFilter() {
    return "\n          <label class=\"show-for-sr\" for=\"subjectsfilter\">Filter by subject</label>\n          <select id=\"subjectsfilter\">\n\t\t\t        <option value=\"\">Filter by subject...</option>\n\t\t\t      </select>";
  };

  /*
    @renderItemsCompact: Returns a String (HTML)
  */
  var renderItemsCompact = function renderItemsCompact(item) {
    return "\n\t\t\t<div class=\"cell small-12 medium-4 u-pt-2\">\n\t\t\t  <div class=\"u-green-line-top\">\n\t\t\t\t  <h3 class=\"header-stripped u-my-1 \"><a href=\"".concat(item.url, "\" class=\"c-link\">").concat(item.prefix, " ").concat(item.title, "</a></h3>\n\t\t\t\t  <p class=\"u-my-1 text-sm\"><strong>Start dates: </strong><br />").concat(item.starts, "</p>\n\t\t\t\t  <p class=\"text-sm\"><strong>Duration: </strong><br />").concat(item.duration, ", ").concat(item.mode, "</p> \n\t\t\t  </div>\n\t\t\t</div>");
  };

  /*
    @renderItems: Returns a String (HTML)
  */
  var renderItems = function renderItems(item) {
    return "\n\t\t\t<div class=\"cell small-12 medium-4  u-pt-2\">\n        <div class=\"u-green-line-top\">\n          <h3 class=\"header-stripped u-my-1\"><a href=\"".concat(item.url, "\" class=\"c-link\" >").concat(item.prefix, " ").concat(item.title, "</a></h3>\n          <p class=\"text-sm\"><strong>").concat(item.starts, " </strong></p>\n          <p class=\"text-sm\">").concat(item.description, "</p>\n        </div>\n\t\t\t</div>");
  };

  /*
   @setDOMContent: Output the html content to the page (SIDE EFFECT)
  */
  var setDOMContent = stir.curry(function (elem, html) {
    stir.setHTML(elem, html);
    return true;
  });

  /*
   On load
  */

  var initialData = stir.courses || [];
  if (!initialData.length) return;
  resultAreas.forEach(function (element) {
    return main(element, initialData);
  });

  /*
   End
  */
})(stir.nodes(".courselisting"));