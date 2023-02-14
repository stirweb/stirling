var stir = stir || {};

stir.dpt = function () {
  var labels = {
    ug: "undergraduate",
    pg: "postgraduate"
  };
  var stdout = document.getElementById("console");
  var routeBrowser = document.getElementById('routeBrowser');
  var optionBrowser = document.getElementById('optionBrowser');
  var moduleBrowser = document.getElementById('moduleBrowser');
  var user = {};
  var modulesEndpointParams = {
    UG: "opt=runcode&ct=UG",
    PG: "opt=runpgcode&ct=PG"
  };
  var urls = {
    viewer: 'module-viewer.html',
    calendar: "https://portal.stir.ac.uk/servlet/CalendarServlet",
    route: {
      UG: "?opt=menu&callback=stir.dpt.show.routes",
      //+ (ver?ver:'')
      PG: "?opt=pgmenu&ct=PG&callback=stir.dpt.show.routes" //+ (ver?ver:'')

    },
    option: function option(type, roucode) {
      return "?opt=".concat(type, "-opts&rouCode=").concat(roucode, "&ct=").concat(type.toUpperCase(), "&callback=stir.dpt.show.options");
    },
    modules: function modules(type, roucode, moa, occ) {
      return "?".concat(modulesEndpointParams[type.toUpperCase()], "&moa=").concat(moa, "&occ=").concat(occ, "&rouCode=").concat(roucode, "&callback=stir.dpt.show.modules");
    },
    module: function module(mod, year, sem) {
      return stir.akari.get.module([mod, year, sem].join('/'));
    }
  };

  var getRoutes = function getRoutes(type) {
    stir.getJSONp("".concat(urls.calendar).concat(urls.route[type.toUpperCase()]));
    user.type = type;
  };

  var getOptions = function getOptions(type, roucode) {
    return stir.getJSONp("".concat(urls.calendar).concat(urls.option(type.toLowerCase(), roucode)));
  };

  var getModules = function getModules(type, roucode, moa, occ) {
    return stir.getJSONp("".concat(urls.calendar).concat(urls.modules(type.toLowerCase(), roucode, moa, occ)));
  }; //	const debug = data => {
  //		console.info('[DPT] debug', data);
  //		stdout.textContent = JSON.stringify(data,null,'\t');
  //	};


  var makeSelector = function makeSelector(data, name) {
    var label = document.createElement('label');
    label.appendChild(document.createTextNode('Select a course'));
    label.setAttribute('for', name);
    var select = document.createElement('select');
    select.name = name;
    select.id = name;
    select.innerHTML = "<option value selected disabled> ~ ".concat(labels[user.type], " courses ~ </option>") + data.sort(routeSort).map(makeOption).join('');
    label.appendChild(select);
    routeBrowser.appendChild(label);
    select.addEventListener('change', function (event) {
      if (event.target.name === 'rouCode') {
        routeBrowser.innerHTML = '';
        optionBrowser.innerHTML = '';
        moduleBrowser.innerHTML = '';
        routeBrowser.appendChild(label); //stdout.textContent = select[select.selectedIndex].outerHTML;

        user.rouCode = select[select.selectedIndex].value;
        user.rouName = select[select.selectedIndex].textContent;
        optionBrowser.insertAdjacentHTML("afterbegin", "<p>\u21B3 <strong>".concat(user.rouCode, "</strong> selected</p>"));
        getOptions(user.type, user.rouCode);
      }

      if (event.target.name === 'option') {
        //stdout.textContent = event.target[event.target.selectedIndex].outerHTML;
        moduleBrowser.innerHTML = '';
        var opt = event.target[event.target.selectedIndex].value.split('|');
        getModules(user.type, user.rouCode, opt[0], opt[2]);
      }
    });
  };

  var moduleView = function moduleView(data) {
    return !data.modName ? "<p>------- no data</p>" : "<p>".concat(data.modCode, " <a href=\"").concat(urls.viewer, "?code=").concat(data.modCode, "&semester=").concat(data.mavSemCode, "&session=").concat(data.mavSemSession, "\" target=\"_blank\">").concat(data.modName, "</a> <small>").concat(data.mavSemSession, "/").concat(data.mavSemCode, "</small></p>");
  };

  var optionView = function optionView(data) {
    var a = document.createElement('button');
    a.classList.add('button');
    a.classList.add('hollow');
    a.classList.add('tiny');
    a.setAttribute('data-options', data.join('|'));
    a.textContent = [data[1], data[3]].join(', ') + " (".concat(data[4], ")");
    a.addEventListener("click", function (event) {
      var opt = event.target.getAttribute('data-options').split('|');
      var callout = document.createElement('div');
      callout.classList.add('callout');
      callout.classList.add('u-bg-grey');
      callout.classList.add('u-mb-3');
      moduleBrowser.innerHTML = '';
      callout.appendChild(renderp("All modules associated with <strong>".concat(user.rouName, "</strong> ").concat(user.rouCode, " (").concat(opt[1], ", ").concat(opt[3], ", ").concat(opt[4], ") are listed below. This list is generated from data in the current Degree Programme Tables.")));
      callout.appendChild(renderp("<strong>\u2139\uFE0F Select a module below to view the available Akari API data, or choose a different course from the selector above</strong>."));
      callout.appendChild(renderp("Now loading module list for ".concat(user.rouCode), 'u-loading'));
      moduleBrowser.appendChild(callout);
      moduleBrowser.insertAdjacentHTML("beforeend", "<h2 class=\"header-stripped u-m-0\">".concat(user.rouCode, "\u2014").concat(user.rouName, "</h2>"));
      moduleBrowser.insertAdjacentHTML("beforeend", "<h3 class=header-stripped>".concat(opt[1], ", ").concat(opt[3], ", ").concat(opt[4], "</h3>"));
      getModules(user.type, user.rouCode, opt[0], opt[2]);
      event.preventDefault();
    });
    return a;
  };

  var renderp = function renderp(html, css) {
    var p = document.createElement('p');
    p.innerHTML = html;
    css && p.classList.add(css);
    return p;
  };

  var renderOptions = function renderOptions(data) {
    data.map(optionView).forEach(function (element) {
      return optionBrowser.appendChild(element);
    });
  };

  var renderModules = function renderModules(data) {
    moduleBrowser.querySelector('.u-loading').remove();
    var div = document.createElement('div');
    div.innerHTML = data.map(moduleView).join("\n");
    moduleBrowser.appendChild(div);
  };

  var compare = function compare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0; // a must be equal to b
  };

  var routeSort = function routeSort(a, b) {
    return compare(a.rouName, b.rouName);
  };

  var makeOption = function makeOption(data) {
    var option = document.createElement('option');

    if (data.rouName && data.rouCode) {
      option.textContent = "".concat(data.rouName);
      option.value = data.rouCode;
      return option.outerHTML;
    }

    if (data[0] && data[2]) {
      option.textContent = data.join('|');
      option.value = data.join('|');
    }

    option.textContent = JSON.stringify(data, null, "\t");
    return option.outerHTML;
  };

  var extractModules = function extractModules(data) {
    var output = [];

    for (var g = 0; g < data.semesterGroupBeans.length; g++) {
      // groups loop
      for (var o = 0; o < data.semesterGroupBeans[g].groupOptions.length; o++) {
        // options in group
        for (var s = 0; s < data.semesterGroupBeans[g].groupOptions[o].semestersInOption.length; s++) {
          var semester = data.semesterGroupBeans[g].groupOptions[o].semestersInOption[s];
          var collections = semester.collections;

          for (var c = 0; c < collections.length; c++) {
            var collection = collections[c];

            for (var m = 0; m < collection.mods.length; m++) {
              var module = collection.mods[m];
              output.push({
                modName: module.modName,
                modCode: module.modCode,
                mavSemCode: module.mavSemCode,
                mavOccurrence: module.mavOccurrence,
                mavSemSession: module.mavSemSession
              });
            }
          }
        }
      }
    }

    return output;
  };

  return {
    show: {
      routes: function routes(data) {
        return makeSelector(data, 'rouCode');
      },
      options: function options(data) {
        return renderOptions(data);
      },
      modules: function modules(data) {
        return renderModules(extractModules(data));
      },
      lookup: function lookup(data) {
        var frag = document.createElement('div');
        var el = document.querySelector("#course-modules-container");
        frag.innerHTML = data;
        el && el.appendChild(frag);
      }
    },
    get: {
      routes: getRoutes,
      viewer: function viewer() {
        return urls.viewer;
      }
    },
    set: {
      viewer: function viewer(path) {
        return urls.viewer = path;
      }
    }
  };
}();