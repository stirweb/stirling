/*
 * Initiate foundation
 */

// jQuery(document).ready(function ($) {
//     $(document).foundation();
// });

/*
   Environment object so we don't have to repeat switch commands with hostnames etc
 */

var UoS_env = (function () {
  var hostname = window.location.hostname;

  // env_name e.g. "dev"
  var env_name = "prod";
  var wc_path = "/media/dist/";

  switch (hostname) {
    case "localhost":
      env_name = "dev";
      wc_path = "/medias/Categorised/Dist/";
      break;

    case "stiracuk-cms01-production.terminalfour.net":
      env_name = "preview";
      wc_path = "";
      break;

    case "stiracuk-cms01-test.terminalfour.net":
      env_name = "appdev-preview";
      wc_path = "";
      break;

    case "stir.ac.uk":
      env_name = "pub";
      break;

//    case "www-stir.t4appdev.stir.ac.uk":
//      env_name = "dev-pub";
//      break;

    case "stirweb.github.io":
      env_name = "qa";
      wc_path = "/medias/Categorised/Dist/";
      break;
  }

  // webcomponents path e.g. "/webcomponents/"
  //var wc_path = "/webcomponents/";
  // switch (hostname) {
  //   case "localhost":
  //     wc_path = "/";
  //     break;
  // }

  return {
    //url: hostname,
    name: env_name,
    wc_path: wc_path,
  };
})();

/*
 * This is our location service within ServiceQ. It is global so that it can be
 * used throughout the site
 */

/* var UoS_locationService = new UoS_ServiceQ({
    request: {
        url: "https://api.ipdata.co?api-key=aaa04e0dafd37c535ca70f6e84dbe4fd98333cd2cb33701044c75279",
        dataType: "jsonp",
    },
    getCacheData: function() {
        return Cookies.getJSON('UoS_LocationService__ipdata-data');
    },
    setCacheData: function(data) {
        Cookies.set('UoS_LocationService__ipdata-data', data);
    }
}); */

// this is a map of country code/names - taken from http://country.io/names.json
/* UoS_locationService.countryNames =
{"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"};
 */
// list of other (not including uk) eu countries
/* UoS_locationService.euCountryNames = ["Austria", "Belgium", "Bulgaria", "Croatia", "Republic of Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"]; */

/*
 * This is a function to called when opening a widget, and contains handlers
 * to close other widgets. So we don't have to go through the entire site adding
 * widget close instructions everywhere, we can do it with a single call and just
 * update here
 * @param exception {string} The name here of the widget to ignore, but close others
 */

var UoS_closeAllWidgetsExcept = (function () {
  var widgetRequestClose = document.createEvent("Event");
  widgetRequestClose.initEvent("widgetRequestClose", true, true);

  var handlers = {
    breadcrumbs: function () {
      var bcItems = document.querySelectorAll(".breadcrumbs > li");
      if (bcItems)
        Array.prototype.forEach.call(bcItems, function (item) {
          item.classList.remove("is-active");
        });
    },
    courseSearchWidget: function () {
      var cs = document.getElementById("course-search-widget__wrapper");
      if (cs) {
        cs.classList.remove("stir__slidedown");
        cs.classList.add("stir__slideup");
      }
    },
    megamenu: function () {
      var hnp = document.querySelector(".c-header-nav--primary a");
      hnp && hnp.classList.remove("c-header-nav__link--is-active");
    },
    internalDropdownMenu: function () {
      var idm = document.getElementById("internal-dropdown-menu");
      idm && idm.classList.remove("is-active");
    },
    internalSignpost: function () {
      var isds = document.getElementById("internal-signpost-dropdown__submenu");
      isds && isds.classList.add("hide");
      var isdl = document.getElementById("internal-signpost-dropdown__link");
      isdl && isdl.classList.remove("is-active");
    },
  };

  return function (exception) {
    // new way: dispatch a close request to any open (listening) widgets:
    document.dispatchEvent(widgetRequestClose);

    // old way: cycle through each close handler and close any widgets
    // other than the exception. Exception will be undefined if all widgets
    // are supposed to close.
    for (var name in handlers) {
      if (handlers.hasOwnProperty(name) && name !== exception) {
        handlers[name]();
      }
    }
  };
})();
document.body.addEventListener("click", UoS_closeAllWidgetsExcept);

/*
 * Helper object to let us do adaptive page loading (e.g. megamenu, mobile menu)
 * UoS_AWD is framework agnostic, so we'll pass in values from Foundation here
 */
/* (function () {

    window.uos_awd = new UoS_AWD({

        // as defined in scss e.g. ["small", "medium", "large", "xlarge", "xxlarge"]
        breakpoints: (function(queries) {
            var breakpoints = [];
            for (var i = 0; i < queries.length; i++) {
                breakpoints.push(queries[i]["name"]);
            }
            return breakpoints;
        })(Foundation.MediaQuery.queries),

        // method to get current breakpoint
        getCurrent: function() {
            return Foundation.MediaQuery.current;
        },
    });

})(); */

/*
 * Replaces the object from Foundation.util.MediaQuery.js
 * https://get.foundation/sites/docs/media-queries.html
 * eg Foundation.MediaQuery.current & Foundation.MediaQuery.get (not in use)
 * Just migrating what we use ie stir.MediaQuery.current and the dispatch event
 */

var stir = stir || {};
stir.MediaQuery = (function () {
  var MediaQueryChangeEvent;
  var breakpoints = {
    small: 640,
    medium: 1024,
    large: 1240,
    xlarge: 1440,
    xxlarge: Infinity,
  };

  /**
   * Get the current breakpoint eg "small", "medium" ...
   **/
  function getCurrent() {
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    for (var index in breakpoints) {
      if (breakpoints.hasOwnProperty(index) && vw <= breakpoints[index]) break;
    }
    return index;
  }

  /**
   * Check viewport size and dispatch an event if it
   * has changed since last time.
   */
  function checkCurrent() {
    var size = getCurrent();
    if (size !== stir.MediaQuery.current) {
      stir.MediaQuery.current = size;
      window.dispatchEvent(MediaQueryChangeEvent);
    }
  }

  /**
   * Set up custom event "MediaQueryChange".
   */
  if (typeof Event === "function") {
    MediaQueryChangeEvent = new Event("MediaQueryChange"); // Event API version
  } else {
    MediaQueryChangeEvent = document.createEvent("Event"); // IE version
    MediaQueryChangeEvent.initEvent("MediaQueryChange", true, true);
  }

  /**
   * Listen for (debounced) resize events and re-check the
   * viewport against the named breakpoints.
   **/
  window.addEventListener("resize", stir.debounce(checkCurrent, 400));

  /**
   * On load: Configure global stir.MediaQuery.current
   **/
  return {
    current: getCurrent(),
  };
})();
