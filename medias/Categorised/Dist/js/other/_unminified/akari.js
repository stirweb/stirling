function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var stir = stir || {};
stir.akari = function () {
  var params = new URLSearchParams(document.location.search);
  var url = 'https://www.stir.ac.uk/data/courses/akari/module/index.php?module=';
  var browser = document.getElementById('moduleBrowser');
  var debug = function debug(data) {
    return console.info(data);
  };
  console.info(params);
  var get = {
    module: function module(identifier) {
      return stir.load(url + identifier, parse);
    }
  };
  var expose = function expose(html) {
    return html.toString().replaceAll('<', '&lt;').replaceAll('http://', '<span class=warn>http</span>://');
  };
  var innerTabulate = function innerTabulate(element) {
    var output = [];
    if (_typeof(element) === "object") {
      if (element === null) {
        output.push('<span class=placeholder>no data</span>');
      } else {
        output.push(tabulate(element));
      }
    } else {
      output.push(expose(element) || '<span class=placeholder>no data</span>');
    }
    return output.join('');
  };
  var tabulate = function tabulate(iterable) {
    var output = [];
    //console.info(typeof iterable, iterable)
    output.push("<table>");
    for (var element in iterable) {
      output.push("<tr>");
      output.push("<th>".concat(element).concat(Array.isArray(iterable[element]) ? '<br>[' + iterable[element].length + ' item(s)]' : '', "</th>"));
      //			if (Array.isArray(iterable[element])) {
      //				output.push(`<td>`);
      //				output.push(iterable[element].map(innerTabulate).join(''));
      //				output.push(`</td>`);
      //			} else {
      output.push("<td>".concat(innerTabulate(iterable[element]), "</td>"));
      //			}
      output.push("</tr>");
    }
    output.push("</table>");
    return output.join('');
  };
  var parse = function parse(text) {
    try {
      return render(JSON.parse(text));
    } catch (error) {
      //return {error: error};
      return render('<p>Data for this module code is not found in Akari</p>');
    }
  };
  var render = function render(data) {
    console.info('render', data);
    browser.innerHTML = (data.moduletitle ? "<h2 class=header-stripped>".concat(data.moduletitle, "</h2>") : '') + (data.modulecode ? "<p>".concat(data.modulecode, "</p>") : '') + ("object" === _typeof(data) ? tabulate(data) : '') + ("string" === typeof data ? data : ''); //+ //'<p>Data for this module code is not found in Akari</p>'
    //`<textarea>${parse(data)}</textarea>`;
  };

  if (params) {
    var code = params.get('code');
    var session = params.get('session');
    var semester = params.get('semester');
    if (code && session && semester) {
      browser.textContent = 'Now loading…';
      return get.module([code, session, semester].join('/'));
    }
    browser.innerHTML = '<p class=error><strong>Error</strong>. Please check <kbd>code</kbd>, <kbd>session</kbd> and <kbd>semester</kbd> parameters, then try again.';
  }
  return {
    get: get
  };
}();