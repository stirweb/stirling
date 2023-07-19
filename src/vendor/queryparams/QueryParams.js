/**
 * useful function for getting/setting the query url params in the address bar
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 * 
 * Updated 2022-02-14
 * - Fix unnecessary History API push-states (i.e. only push when the URL actually changes).
 * - Add URI encoding (e.g. if the user-submitted content contains `&` etc).
 * 
 */
// TODO reload is false by default? check other pages not dependant on this being true
var QueryParams = (function () {
  /**
   * This can be replaced when running tests
   * @var {function}
   */
  var _pushStateHandler = function (url) {
    history.pushState(null, null, url);
  };

  var _replaceStateHandler = function (url, state) {
    history.replaceState(state, "", url);
  };

  /**
   * To swap _pushStateHandler when running tests
   * @var {function} handler Handler for mocking(?) push state
   */
  var _setPushStateHandler = function (handler) {
    _pushStateHandler = handler;
  };

  /**
   * Get single query param from url
   * @param {string} name
   * @param {string} defaultValue
   * @param {string} url (optional)
   */
  function _get(name, defaultValue, url) {
    if (typeof url === "undefined") url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return defaultValue;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * Get single query param from url
   * @param {string} url (optional)
   * @returns {object}
   */
  function _getAll(queryString) {
    if (typeof queryString === "undefined") queryString = window.location.search;

    var obj = {};
    queryString.substring(1).replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return obj;
  }

  /**
   * Same as _getAll but returns an array of objects rather than pure object
   * @param {string} url (optional)
   * @returns {object}
   */
  function _getAllArray(queryString) {
    if (typeof queryString === "undefined") queryString = window.location.search;

    var arr = [];
    queryString.substring(1).replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
      var obj = { name: decodeURIComponent(key), value: decodeURIComponent(value) };
      arr.push(obj);
    });

    return arr;
  }

  /**
   * Will update a param match from a given url
   * @param {string} url Url query string e,g, "path/to/res?name=value"
   * @param {string|object} name Name of param to update, or name/value pairs object for multiples
   * @param {string} value New value
   * @returns {string}
   */
  function _updateQueryStringParameter(url, name, value) {
    // we'll assume a name/value object for the rest of this script
    var values = {};
    if (typeof name === "string") {
      values[name] = value;
    } else {
      values = name;
    }

    for (var name in values) {
      if (values.hasOwnProperty(name)) {
        value = values[name];

        var re = new RegExp("([?&])" + name + "=.*?(&|#|$)(.*)", "gi"), hash;

        if (re.test(url)) {
          if (typeof value !== "undefined" && value !== null)
            url = url.replace(re, "$1" + name + "=" + encodeURIComponent(value) + "$2$3");
          else {
            hash = url.split("#");
            url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
          }
        } else {
          if (typeof value !== "undefined" && value !== null) {
            var separator = url.indexOf("?") !== -1 ? "&" : "?";
            hash = url.split("#");
            url = hash[0] + separator + name + "=" + encodeURIComponent(value);
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
          }
        }
      }
    }

	return url;

  }

  /**
   * Set value in query string
   * @param {string} name Name of param to update
   * @param {string} value New value
   * @param {boolean} reload
   */
  function _set(name, value, reload, queryString) {
    if (typeof queryString === "undefined") queryString = document.location.search;

    var newQueryString = _updateQueryStringParameter(queryString, name, value);
	if(newQueryString!==queryString) _pushStateHandler(newQueryString);

    if (reload) {
      window.location.href = document.location.href;
    }
  }

  /**
   * Will remove a param match from a given url
   * @param {string} url Url query string e,g, "path/to/res?name=value"
   * @param {string} name Name of param to remove eg. name
   * @returns {string}
   */
  function _removeURLParameter(url, name) {
    // if (!url) url = window.location.href;

    //prefer to use l.search if you have a location/link object
    var urlparts = url.split("?");
    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(name) + "=";
      var pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url = urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
      return url;
    } else {
      return url;
    }
  }

  /**
   * Remove param by name
   * @param {string} name Name of param to update
   * @param {boolean} reload [Optional] Automatically reload the window after changing the URL
   * @param {string} url [Optional] The URL to be acted upon
   * @param {boolean} replace [Optional] Use replaceState instead of pushState
   */
  // TODO use document..search? instead of href
  function _remove(name, reload, url, replace) {
    if (!url) url = window.location.href;

	var newUrl = _removeURLParameter(url, name);
    if(newUrl!==url) replace ? _replaceStateHandler(newUrl): _pushStateHandler(newUrl);

    if (reload) {
      window.location.href = document.location.href;
    }
  }

  return {
    get: _get,
    getAll: _getAll,
    getAllArray: _getAllArray,
    set: _set,
    remove: _remove,
    setPushStateHandler: _setPushStateHandler,
  };
})();
