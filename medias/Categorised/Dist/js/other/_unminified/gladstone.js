function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function () {
  var week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  var swimTimetableFormatter = function swimTimetableFormatter(data) {
    if (!data.StartDate) return '';
    var date = new Date(data.StartDate);
    return "\n\t\t\t<tr>\n\t\t\t\t<th data-day=".concat(data.Day, ">").concat(stir.Date.swimTimetable(date), "</th>\n\t\t\t\t<td><strong>Time</strong>: ").concat(data.StartTime, "\u2013").concat(data.EndTime, "</td>\n\t\t\t\t<td><strong>Activity</strong>: ").concat(data.Description ? data.Description.replace(' Pool', '') : '', "</td>\n\t\t\t\t<td><strong>No. of Lanes</strong>: ").concat(data.NoOfProducts, "</td>\n\t\t\t\t<td><strong>Depth</strong>: ").concat(data.WebComments ? data.WebComments.replace(/Depth /g, '').replace("\n", '<br>') : '', "</td>\n\t\t\t\t<!-- <td><a href=\"").concat(data.DeepLink, "\" class=\"button tiny energy-pink\">Book&nbsp;now</a></td> -->\n\t\t\t</tr>\n\t\t");
  };

  var mergeDayHeaders = function mergeDayHeaders(table) {
    for (var day in week) {
      var rows = Array.prototype.slice.call(table.querySelectorAll("th[data-day=\"".concat(week[day], "\"]")));

      if (rows.length) {
        rows[0].setAttribute('rowspan', rows.length);
        rows.shift();

        for (var i = 0; i < rows.length; i++) {
          rows[i].parentElement.removeChild(rows[i]);
        }
      }
    }

    return table;
  };

  var render = function render(text, data) {
    if ("undefined" === typeof data) return;
    if ("undefined" === typeof data.map) return;
    var table = document.createElement('table');
    table.setAttribute('class', 'c-activity-timetable alt');
    table.innerHTML = "<caption>".concat(text, "</caption>") + data.map(swimTimetableFormatter).join("\n");
    el.appendChild(mergeDayHeaders(table));
  };

  var el = document.querySelector("#gs-target");
  var spinner = new stir.Spinner(el);
  spinner.element.classList.remove('show-for-medium');
  spinner.show(); // JSONp callback function, must be global

  window.swimtt = function (data) {
    //console.info(data);
    if (!el) return;
    spinner.hide();

    if (_typeof(data.map)) {
      render('Pool timetable', data);
    }
  };

  window.recswimtt = swimtt;
  var handler = {
    load: function load(e) {
      spinner.hide(); //console.info('[Gladstone] data loaded');
    },
    error: function error(e) {
      spinner.hide();
      el.appendChild(document.createTextNode("Error: Data could not be loaded. Please try again later."));
    }
  };

  try {
    var activity = el.getAttribute('data-activity');
    var url = el.getAttribute('data-jsonp');

    if (activity) {
      if ("RECSWIM" === activity) {
        url = el.getAttribute("data-recswim");
      } //			if("LANESWIM"===activity) {
      //				url = el.getAttribute("data-laneswim");
      //			}

    }

    if (url) {
      stir.getJSONp(url, handler.load, handler.error);
    } else {
      handler.error();
    }
  } catch (e) {
    console.error(e);
    spinner.hide();
  }
})();