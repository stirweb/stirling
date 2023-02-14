/**
 * Just a temp file to add new (or update) functionality of Stir.js etc.
 */

/**
 * JSON handling
 */
//var stir = stir||{};
var stir = stir || {};
stir.templates = stir.templates || {};
stir.const = stir.const || {};

stir.templates.search = function () {
  /**
   * Some private memebers to help with data processing.
   * They can also be referred to locally, instead of
   * invoking the absolute object stir.templates.blah.blah.blah
   * */
  var debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

  var FB_BASE = function FB_BASE() {
    return "https://" + stir.funnelback.getHostname();
  };

  var notice = function notice(text) {
    return "<p class=\"u-heritage-berry u-border-solid u-p-1\"><span class=\"uos-lightbulb\"></span> ".concat(text, "</p>");
  };

  var summary = function summary(text) {
    return "<p class=c-search-result__summary>".concat(text, "</p>");
  }; // STAFF / STUDENT status checking


  var groups = {
    staff: "University of Stirling staff",
    students: "current students and staff"
  };
  var entitlements = {
    staff: ["staff", "students"],
    student: ["students"]
  };
  var afce4eafce490574e288574b384ecd87 = window[["s", "e", "i", "k", "o", "o", "C"].reverse().join("")]; // Just a bit of mild fun to stop anyone text-searching for "Cookies"!

  var isUser = afce4eafce490574e288574b384ecd87.get("psessv0") ? true : false; // Cookie could be spoofed, but we'll trust it. The Portal will enforce authenticattion anyway.

  var userType = isUser ? afce4eafce490574e288574b384ecd87.get("psessv0").split("|")[0] : "EXTERNAL";

  var userAuth = function userAuth(group) {
    var _entitlements$userTyp;

    return ((_entitlements$userTyp = entitlements[userType.toLowerCase()]) === null || _entitlements$userTyp === void 0 ? void 0 : _entitlements$userTyp.indexOf(group.toLowerCase())) > -1;
  };

  var authClass = function authClass(group) {
    return userAuth(group) ? " c-internal-search-result" : " c-internal-locked-search-result";
  };

  var authMessage = function authMessage(group) {
    return notice("This page is only available to ".concat(groups[group], ". You will be asked to log in before you can view it, but once you are logged in results will be shown automatically."));
  };

  var internalSummary = function internalSummary(text, group) {
    return userAuth(group) ? summary(text) : authMessage(group);
  }; // Special handling for documents (PDF, DOC; as opposed to native web results)


  var isDocUrl = function isDocUrl(url) {
    var docUrlSlashDotSplit = url.toUpperCase().split("/").slice(-1).toString().split(".");
    return docUrlSlashDotSplit.length > 1 && docUrlSlashDotSplit[1].match(/PDF|DOCX?/); // Other types can be added to this list if necessary
  };

  var makeBreadcrumbs = function makeBreadcrumbs(trail, liveUrl, fileSize) {
    if (trail && trail.length > 0) {
      return stir.templates.search.breadcrumb(stir.templates.search.trailstring(trail));
    }

    if (isDocUrl(liveUrl)) return "Document: ".concat(isDocUrl(liveUrl), " <small>").concat(stir.Math.fileSize(fileSize || 0, 0), "</small>");
    return "";
  };

  var checkSpelling = function checkSpelling(suggestion) {
    return suggestion ? "<p>Did you mean <a href=\"#\" data-suggest>".concat(suggestion.text.split(" ")[0], "</a>?</p>") : "";
  };
  /**
   * 
   * @param {String} name 
   * @param {String} value 
   * @returns Element
   * 
   * For a given name and value, return the first matching HTML <input> or <option> element.
   */


  var metaParamElement = function metaParamElement(name, value) {
    return document.querySelector("input[name=\"".concat(name, "\"][value=\"").concat(value, "\"],select[name=\"").concat(name, "\"] option[value=\"").concat(value, "\"]"));
  }; //	const metaParamToken = (name, values) => {
  //		if (name === "meta_type") return; // ignore `type`
  //		if (name === "meta_faculty") return; // ignore `faculty`
  //		if (values.charAt(0) == "-") return; // ignore negative parameters
  //		if (values.charAt(1) == ">") return; // ignore date-range parameters
  //		if (values.indexOf(" ") >= 1) {
  //			const tokenArr = values.split(" ");
  //			const el = metaParamElement(name, tokenArr[1]);
  //			if (el) {
  //				return tag(el.parentElement.innerText, tokenArr[0], tokenArr[1]);
  //			}
  //		}
  //		return;
  //	};

  /**
   * 
   * @param {Object} tokens 
   * @returns String (HTML)
   * 
   * Create clickable text elements (i.e. "tokens") that represent the active search filters, to give the user the
   * option to dismiss each filter quickly (and a visual reminder of which filters are active).
   * 
   * Becuase the search result data only contains the raw names/values of the filters, we need to derive the correct
   * text labels from the form inputs on the page. We also need to unbundle checkbox (multi-select) filters and deal
   * with any other unusual filters (such as Faculty and course Start Date).
   * 
   */


  var metaParamTokens = function metaParamTokens(tokens) {
    var metas = Object.keys(tokens).filter(function (key) {
      return key.indexOf('meta_') === 0 && tokens[key][0];
    });
    return metas.map(function (key) {
      // does the name and value match a DOM element?
      var el = metaParamElement(key, tokens[key]);
      if (el) return tag(el.innerText || el.parentElement.innerText, key, tokens[key]); // if not, we might have a multi-select filter (e.g. checkbox)

      var tokenex = new RegExp(/\[([^\[^\]]+)\]/); // regex for Funnelback dysjunction operator e.g. [apples oranges]

      var values = tokens[key].toString().replace(tokenex, "$1").split(/\s/); // values are space-separated

      return values.map(function (value) {
        var el = metaParamElement(key, value); // The innerText of the <input> element‘s <label> has the text we need

        if (el) {
          return tag(el.parentElement.innerText, key, value);
        } // We will just default to empty string if there is no matching element.


        return '';
      }).join(" ");
    }).join(" ");
  };

  var tag = function tag(_tag, name, value) {
    return "<span class=c-tag data-name=\"".concat(name, "\" data-value=\"").concat(value, "\">\u2716\uFE0F ").concat(_tag, "</span>");
  };

  var courseLabel = function courseLabel(input) {
    switch (input) {
      case "module":
        return "CPD and short courses";

      case "Postgraduate (taught)":
        return "Postgraduate";

      default:
        return input;
    }
  };

  var image = function image(_image, alt, width, height) {
    if (!_image) return "";
    var url = _image.indexOf("|") > -1 ? _image.split("|")[1] || _image.split("|")[0] : _image;
    return "<div class=c-search-result__image>\n\t\t".concat(stir.funnelback.getCroppedImageElement({
      url: url.trim(),
      alt: alt || "",
      width: width || 550,
      height: height || 550
    }), "\n\t\t</div>");
  };

  var flickrUrl = function flickrUrl(flickr) {
    return flickr.id ? "https://farm".concat(flickr.farm, ".staticflickr.com/").concat(flickr.server, "/").concat(flickr.id, "_").concat(flickr.secret, "_c.jpg") : "";
  };

  var datespan = function datespan(start, end) {
    if (!start) return '<abbr title="To be confirmed">TBC</abbr>';
    var s = new Date(start);
    var startdate = stir.Date.newsDate(s);
    var dts = stir.Date.timeElementDatetime(s);
    if (!end) return "<time datetime=\"".concat(dts, "\">").concat(startdate, "</time>");
    var e = end && new Date(end);
    var enddate = e && stir.Date.newsDate(e);
    var dte = e && stir.Date.timeElementDatetime(e);
    if (startdate == enddate) return "<time datetime=\"".concat(dts, "\">").concat(startdate, "</time>"); // TODO: do we need to collapse short ranges e.g. "1–8 August 1986"?

    return "<time datetime=\"".concat(dts, "\">").concat(startdate, "</time>\u2013<time datetime=\"").concat(dte, "\">").concat(enddate, "</time>");
  };

  var timespan = function timespan(start, end) {
    return (start ? "<time>".concat(stir.Date.time24(new Date(start)), "</time>") : "") + (end ? "\u2013<time>".concat(stir.Date.time24(new Date(end)), "</time>") : "");
  };

  var anchor = function anchor(crumb) {
    return "<a href=\"".concat(crumb.href, "\">").concat(crumb.text, "</a>");
  };

  var t4preview = function t4preview(sid) {
    return sid ? "/terminalfour/preview/1/en/".concat(sid) : "#";
  };

  var clearingTest = function clearingTest(item) {
    return stir.courses && stir.courses.clearing && Object.values && item.clearing && Object.values(item.clearing).join().indexOf("Yes") >= 0;
  };
  /**
   * PUBLIC members that can be called externally.
   * Principally for `stir.search` but could be reused elsewhere.
   * I've used the `stir.templates.search` namespace so we can have
   * other types of templates in future, potentially.
   */


  return {
    tag: tag,
    stag: function stag(tag) {
      return tag ? "<span class=\"c-search-tag\">".concat(tag, "</span>") : "";
    },
    tagGroup: function tagGroup(_tagGroup) {
      var gData = _tagGroup.split("=");

      var list = gData[1] && gData[1].replace(/,([^\s])/gi, "__SPLIT__$&").split("__SPLIT__,");
      return list ? list.map(stir.templates.search.stag).join("") : "";
    },
    breadcrumb: function breadcrumb(crumbs) {
      return "<p class=\"u-m-0\">".concat(crumbs, "</p>");
    },
    trailstring: function trailstring(trail) {
      return trail.length ? trail.map(anchor).join(" > ") : "";
    },
    summary: function summary(data) {
      var _data$response$result = data.response.resultPacket.resultsSummary,
          currEnd = _data$response$result.currEnd,
          totalMatching = _data$response$result.totalMatching,
          currStart = _data$response$result.currStart;
      var querySanitised = stir.String.stripHtml(data.question.originalQuery).replace(/^!padrenullquery$/, "").trim();
      var queryEcho = querySanitised.length > 1 ? " for <em>".concat(querySanitised, "</em>") : "";
      var message = totalMatching > 0 ? "\t<p class=\"text-sm\">There are <strong>".concat(totalMatching.toLocaleString("en"), " results</strong>").concat(queryEcho, ".</p>") : "<p id=\"search_summary_noresults\"><strong>There are no results".concat(queryEcho, "</strong>.</p>");
      var tokens = metaParamTokens(data.question.rawInputParameters);
      var spelling = querySanitised ? checkSpelling(data.response.resultPacket.spell) : '';
      return "<div class=\"u-py-2\"> ".concat(message, " ").concat(tokens, " ").concat(spelling, " </div>");
    },
    pagination: function pagination(summary) {
      var currEnd = summary.currEnd,
          totalMatching = summary.totalMatching,
          progress = summary.progress;
      return totalMatching === 0 ? "" : "\n\t\t\t<div class=\"cell text-center u-margin-y\">\n\t\t\t\t<progress value=\"".concat(progress, "\" max=\"100\"></progress><br />\n\t\t\t\tYou have viewed ").concat(totalMatching === currEnd ? "all" : currEnd + " of " + totalMatching, " results\n\t\t\t</div>");
    },
    suppressed: function suppressed(reason) {
      return "<!-- Suppressed search result: ".concat(reason, " -->");
    },
    auto: function auto(item) {
      var _item$metaData, _item$metaData$breadc;

      if (item.liveUrl === "https://www.stir.ac.uk/") return stir.templates.search.suppressed("homepage");
      if (item.metaData.type == "Course" || item.metaData.level) return stir.templates.search.course(item);
      if (item.metaData.type == "News") return stir.templates.search.news(item);
      if (item.metaData.type == "Gallery") return stir.templates.search.gallery(item);
      if (item.metaData.type == "Event") return stir.templates.search.event(item);
      if (item.collection == "stir-events") return stir.templates.search.event(item);
      if (item.metaData.access) return stir.templates.search.internal(item);
      if (item.metaData.type && item.metaData.type.indexOf("output") > -1) return stir.templates.search.research(item);
      if (item.metaData.type && item.metaData.type.indexOf("contract") > -1) return stir.templates.search.research(item);
      if (item.metaData.type && item.metaData.type.indexOf("profile") > -1) return stir.templates.search.person(item);
      if (item.liveUrl.indexOf("https://www.stir.ac.uk/news") === 0) return stir.templates.search.news(item);
      var crumbs = {
        text: ((_item$metaData = item.metaData) === null || _item$metaData === void 0 ? void 0 : (_item$metaData$breadc = _item$metaData.breadcrumbs) === null || _item$metaData$breadc === void 0 ? void 0 : _item$metaData$breadc.split(" > ").slice(1, -1)) || [],
        href: new URL(item.liveUrl).pathname.split("/").slice(1, -1)
      };
      var trail = crumbs.text.map(function (text, index) {
        return {
          text: text,
          href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/"
        };
      });
      var label = item.liveUrl.indexOf("policyblog.stir") > -1 ? "<div class=\" c-search-result__tags\"><span class=\"c-search-tag\">Public Policy Blog</span></div>" : "";
      if (item.metaData.type && item.metaData.type.indexOf("studentstory") > -1) return stir.templates.search.studentstory(item, trail);
      return "\n\t\t\t<div class=\"c-search-result\" data-rank=".concat(item.rank).concat(item.metaData.type || isDocUrl(item.liveUrl) ? ' data-result-type="' + (item.metaData.type || (isDocUrl(item.liveUrl) ? "document" : "")).toLowerCase() + '"' : "").concat(item.metaData.access ? ' data-access="' + item.metaData.access + '"' : "", ">\n\t\t\t\t<div class=\"c-search-result__body u-mt-1 flex-container flex-dir-column u-gap\">\n\t\t\t\t\t").concat(label, "\n\t\t\t\t\t").concat(makeBreadcrumbs(trail, item.liveUrl, item.fileSize), "\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\"><strong><a href=\"").concat(stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl, "\">").concat(item.title.split("|")[0].trim().replace(/\xA0/g, " "), "</a></strong></p>\n\t\t\t\t\t<p >").concat(item.summary.replace(/\xA0/g, " "), "</p>\n\t\t\t\t</div>\n\t\t\t</div>");
    },
    internal: function internal(item) {
      var _item$metaData2, _item$metaData2$bread;

      var crumbs = {
        text: ((_item$metaData2 = item.metaData) === null || _item$metaData2 === void 0 ? void 0 : (_item$metaData2$bread = _item$metaData2.breadcrumbs) === null || _item$metaData2$bread === void 0 ? void 0 : _item$metaData2$bread.split(" > ")) || [],
        href: new URL(item.liveUrl).pathname.split("/").filter(function (n) {
          return n;
        })
      };
      var trail = userAuth(item.metaData.group) ? stir.templates.search.trailstring(crumbs.text.map(function (text, index) {
        return {
          text: text,
          href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/"
        };
      }).slice(0, -1)) : "<a href=\"https://www.stir.ac.uk/".concat(crumbs.href[0], "/\">").concat(crumbs.text[0], "</a>");
      return "\n      <div class=\"c-search-result".concat(authClass(item.metaData.group), "\" data-rank=").concat(item.rank).concat(item.metaData.type ? ' data-result-type="' + item.metaData.type.toLowerCase() + '"' : "", " data-access=\"").concat(item.metaData.access, "\">\n\t\t\t  <div class=\"c-search-result__body u-mt-1 flex-container flex-dir-column u-gap\">\n\t\t\t    <p class=\"c-search-result__breadcrumb\">").concat(trail, "</p>\n\t\t\t    <p class=\"u-text-regular u-m-0\"><a href=\"").concat(stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl, "\">").concat(item.title.split(" | ")[0], "</a></p>\n\t\t\t    ").concat(internalSummary(item.summary, item.metaData.group), "\n\t\t\t  </div>\n\t\t\t</div>");
    },
    combo: function combo(item) {
      var _item$codes;

      return "<li title=\"".concat(item.prefix, " ").concat(item.title, "\">").concat(item.courses.map(stir.templates.search.comboCourse).join(" and ")).concat(item !== null && item !== void 0 && (_item$codes = item.codes) !== null && _item$codes !== void 0 && _item$codes.ucas ? " <small>&hyphen; " + item.codes.ucas + "</small>" : "").concat(clearingTest(item) ? ' <sup class="c-search-result__seasonal">*</sup>' : "", "</li>");
    },
    comboCourse: function comboCourse(item) {
      return "<a href=\"".concat(item.url, "\">").concat(item.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi, ""), "</a>");
    },
    clearing: function clearing(item) {
      if (Object.keys && item.metaData && Object.keys(item.metaData).join().indexOf("clearing") >= 0) {
        return "<p class=\"u-m-0\"><strong class=\"u-heritage-berry\">Clearing 2022: places may be available on this course.</strong></p>";
      }
    },
    combos: function combos(item) {
      return item.combos.length === 0 ? "" : "\n\t\t\t<div class=\"combo-accordion\" data-behaviour=accordion>\n\t\t\t\t<accordion-summary>Course combinations</accordion-summary>\n\t\t\t\t<div>\n\t\t\t\t\t<p>".concat(item.title, " can be combined with:</p>\n\t\t\t\t\t<ul class=\"u-columns-2\">\n\t\t\t\t\t\t").concat(item.combos.map(stir.templates.search.combo).join(""), "\n\t\t\t\t\t</ul>\n\t\t\t\t\t").concat(item.combos.map(clearingTest).indexOf(true) >= 0 ? '<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>' : "", "\n\t\t\t\t</div>\n\t\t\t</div>");
    },
    pathways: function pathways(item) {
      if (!item.metaData.pathways) return "";
      var paths = item.metaData.pathways.split("|");
      return paths === 0 ? "" : "\n\t\t\t<div class=\"combo-accordion\" data-behaviour=accordion>\n\t\t\t\t<accordion-summary>Course pathways</accordion-summary>\n\t\t\t\t<div>\n\t\t\t\t\t<p>".concat(item.title, " has the following optional pathways:</p>\n\t\t\t\t\t<ul class=\"u-columns-2\">\n\t\t\t\t\t\t").concat(paths.map(function (path) {
        return "<li>".concat(path, "</li>");
      }).join("\n\t"), "\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>");
    },
    courseFact: function courseFact(head, body, sentenceCase) {
      return head && body ? "<div class=\"cell medium-4\"><strong class=\"u-heritage-green\">".concat(head, "</strong><p").concat(sentenceCase ? " class=u-text-sentence-case" : "", ">").concat(body, "</p></div>") : "";
    },
    course: function course(item) {
      var subject = item.metaData.subject ? item.metaData.subject.split(/,\s?/).slice(0, 1) : "";
      var subjectLink = stir.String.slug(subject);
      var isOnline = item.metaData.delivery && item.metaData.delivery.toLowerCase().indexOf("online") > -1 ? true : false;
      var link = UoS_env.name.indexOf("preview") > -1 ? t4preview(item.metaData.sid) : FB_BASE() + item.clickTrackingUrl; //preview or appdev

      item.combos = stir.courses.showCombosFor(UoS_env.name == "preview" ? item.metaData.sid : item.liveUrl); //item.combos = stir.courses.showCombosFor(item.metaData.sid); // this is for debugging t4 preview mode

      return "\n\t\t\t<div class=\"c-search-result\" data-rank=".concat(item.rank, " data-sid=").concat(item.metaData.sid, " data-result-type=course").concat(isOnline ? " data-delivery=online" : "", ">\n\t\t\t\t<div class=\" c-search-result__tags\">\n\t\t\t\t\t<span class=\"c-search-tag\">").concat(courseLabel(item.metaData.level || item.metaData.type || ""), "</span>\n\t\t\t\t</div>\n\n        <div class=\"flex-container flex-dir-column u-gap u-mt-1\">\n          <p class=\"u-text-regular u-m-0\">\n            <strong><a href=\"").concat(link, "\" title=\"").concat(item.liveUrl, "\">\n            ").concat(item.metaData.award || "", " ").concat(item.title, "\n            ").concat(item.metaData.ucas ? " - " + item.metaData.ucas : "", "\n            ").concat(item.metaData.code ? " - " + item.metaData.code : "", "\n            </a></strong>\n          </p>\n          <p class=\"u-m-0\">").concat(item.summary, "</p>\n          ").concat(stir.templates.search.clearing(item) || "", "\n          <div class=\"c-search-result__meta grid-x\">\n            ").concat(stir.templates.search.courseFact("Start dates", item.metaData.start, false), "\n            ").concat(stir.templates.search.courseFact("Study modes", item.metaData.modes, true), "\n            ").concat(stir.templates.search.courseFact("Delivery", item.metaData.delivery, true), "\n          </div>\n          ").concat(stir.templates.search.combos(item), "\n          ").concat(stir.templates.search.pathways(item), "\n        </div>\n\t\t\t</div>");
    },
    coursemini: function coursemini(item) {
      return "\n\t\t<div>\n\t\t\t<p><strong><a href=\"".concat(FB_BASE() + item.clickTrackingUrl, "\" title=\"").concat(item.liveUrl, "\" class=\"u-border-none\">\n\t\t\t\t").concat(item.metaData.award || "", " ").concat(item.title, " ").concat(item.metaData.ucas ? " - " + item.metaData.ucas : "", " ").concat(item.metaData.code ? " - " + item.metaData.code : "", "\n\t\t\t</a></strong></p>\n\t\t\t<p>").concat(item.summary, "</p>\n\t\t</div>");
    },
    person: function person(item) {
      return "\n\t\t\t<div class=c-search-result data-result-type=person>\n\t\t\t\t<div class=c-search-result__tags>\n\t\t\t\t\t".concat(stir.templates.search.stag(item.metaData.faculty ? stir.research.hub.getFacultyFromOrgUnitName(item.metaData.faculty) : ""), "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"flex-container flex-dir-column u-gap u-mt-1\">\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\"><strong>\n\t\t\t\t\t\t<a href=\"").concat(FB_BASE() + item.clickTrackingUrl, "\">").concat(item.title.split(" | ")[0].trim(), "</a>\n\t\t\t\t\t</strong></p>\n\t\t\t\t\t<div>").concat(item.metaData.role || "<!-- Job title -->", "<br>").concat(item.metaData.faculty || "", "</div>\n\t\t\t\t\t<!-- <p>").concat(item.metaData.c ? (item.metaData.c + ".").replace(" at the University of Stirling", "") : "", "</p> -->\n\t\t\t\t</div>\n\t\t\t\t").concat(image(item.metaData.image, item.title.split(" | ")[0].trim(), 400, 400), "\n\t\t\t\t<div class=c-search-result__footer>\n\t\t\t\t\t").concat(stir.funnelback.getTags(item.metaData.category) ? "<p><strong>Research interests</strong></p>" : "", "\n\t\t\t\t\t<p>").concat(stir.funnelback.getTags(item.metaData.category) || "", "</p>\n\t\t\t\t</div>\n\t\t\t</div>");
    },
    studentstory: function studentstory(item, trail) {
      return "\n\t  \t<div class=c-search-result data-result-type=studentstory>\n\t  \t\t<div ><a href=\"".concat(trail[0].href, "\">").concat(trail[0].text, "</a></div>\n\t\t  \t<div class=\"c-search-result__body flex-container flex-dir-column u-gap \">\n\t\t\t\t<p class=\"u-text-regular u-m-0\"><strong>\n\t\t\t\t  \t<a href=\"").concat(FB_BASE() + item.clickTrackingUrl, "\">").concat(item.title.split(" | ")[0].trim(), "</a>\n\t\t\t  \t</strong></p>\n\t\t\t  \t<p class=\"u-m-0\">").concat(item.metaData.profileCourse1, "<br />\n\t\t\t  \t").concat(item.metaData.profileCountry, "</p>\n\t\t\t  \t<p>").concat(item.metaData.c, "</p>\n\t\t\t</div>\n\t\t  ").concat(image("https://www.stir.ac.uk" + item.metaData.profileImage, item.title.split(" | ")[0].trim(), 400, 400), "\n\t  \t</div>");
    },
    news: function news(item) {
      return "\n\t\t\t<div class=\"c-search-result".concat(item.metaData.image ? " c-search-result__with-thumbnail" : "", "\" data-rank=").concat(item.rank, " data-result-type=news>\n\t\t\t\t\n\t\t\t\t<div class=\"c-search-result__body flex-container flex-dir-column u-gap u-mt-1\">\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\">\n            <strong>\n\t\t\t\t\t\t  <a href=\"").concat(FB_BASE() + item.clickTrackingUrl, "\">").concat(item.metaData.h1 || item.title.split(" | ")[0].trim(), "</a>\n\t\t\t\t\t  </strong>\n          </p>\n          <div >\n\t\t\t\t\t\t\t").concat(item.metaData.d ? stir.Date.newsDate(new Date(item.metaData.d)) : "", "\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"text-sm\">").concat(item.summary, "</p>\n\t\t\t\t</div>\n\t\t\t\t").concat(image(item.metaData.image, item.title.split(" | ")[0].trim()), "\n\t\t\t</div>");
    },
    gallery: function gallery(item) {
      return "\n\t\t\t<div class=\"c-search-result c-search-result__with-thumbnail\" data-rank=".concat(item.rank, " data-result-type=news>\n\t\t\t\t\n\t\t\t\t<div class=c-search-result__body>\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\"><strong>\n\t\t\t\t\t\t<a href=\"").concat(FB_BASE() + item.clickTrackingUrl, "\">").concat(item.metaData.h1 || item.title.split(" | ")[0].trim(), "</a>\n\t\t\t\t\t</strong></p>\n\t\t\t\t\t<p class=\"c-search-result__secondary\">").concat(stir.Date.newsDate(new Date(item.metaData.d)), "</p>\n\t\t\t\t\t<p >").concat(item.summary, "</p>\t\n\t\t\t\t</div>\n\t\t\t\t<div class=c-search-result__image>\n\t\t\t\t\t").concat(stir.funnelback.getCroppedImageElement({
        url: flickrUrl(JSON.parse(item.metaData.custom)),
        alt: "Image of ".concat(item.title.split(" | ")[0].trim()),
        width: 550,
        height: 550
      }), "\n\t\t\t\t</div>\n\t\t\t</div>");
    },
    event: function event(item) {
      var _item$metaData3, _item$metaData4, _item$metaData4$tags, _item$metaData5, _item$metaData6, _item$metaData6$tags;

      var hasThumbnail = ((_item$metaData3 = item.metaData) === null || _item$metaData3 === void 0 ? void 0 : _item$metaData3.image) || ((_item$metaData4 = item.metaData) === null || _item$metaData4 === void 0 ? void 0 : (_item$metaData4$tags = _item$metaData4.tags) === null || _item$metaData4$tags === void 0 ? void 0 : _item$metaData4$tags.indexOf("Webinar")) > -1;
      var title = item.title.split(" | ")[0];
      return "\n\t\t\t<div class=\"c-search-result".concat(hasThumbnail ? " c-search-result__with-thumbnail" : "", "\" data-rank=").concat(item.rank, " data-result-type=event>\n\t\t\t\t<div class=\"c-search-result__tags\">\n\t\t\t\t\t").concat((_item$metaData5 = item.metaData) !== null && _item$metaData5 !== void 0 && _item$metaData5.tags ? item.metaData.tags.split(",").map(stir.templates.search.stag).join("") : "", "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"c-search-result__body flex-container flex-dir-column u-gap u-mt-1\">\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\">\n            <strong>\n\t\t\t\t\t\t  ").concat(item.metaData.register ? anchor({
        text: title,
        href: item.metaData.register
      }) : title, "\n\t\t\t\t\t  </strong>\n          </p>\n\t\t\t\t\t<div class=\"flex-container flex-dir-column u-gap-8\">\n\t\t\t\t\t\t<div class=\"flex-container u-gap-16 align-middle\">\n\t\t\t\t\t\t\t<span class=\"u-icon h5 uos-calendar\"></span>\n\t\t\t\t\t\t\t<span>").concat(datespan(item.metaData.startDate, item.metaData.d), "</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"flex-container u-gap-16 align-middle\">\n\t\t\t\t\t\t\t<span class=\"uos-clock u-icon h5\"></span>\n\t\t\t\t\t\t\t<span>").concat(timespan(item.metaData.startDate, item.metaData.d), "</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"flex-container u-gap-16 align-middle\">\n\t\t\t\t\t\t\t<span class=\"u-icon h5 uos-").concat(item.metaData.online ? "web" : "location", "\"></span>\n\t\t\t\t\t\t\t<span>").concat(item.metaData.online ? "Online" : item.metaData.venue ? item.metaData.venue : "", "</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"text-sm\">").concat(item.summary, "</p>\n\t\t\t\t</div>\n\t\t\t\t").concat(image(item.metaData.image, item.title.split(" | ")[0]), "\n\t\t\t\t").concat(((_item$metaData6 = item.metaData) === null || _item$metaData6 === void 0 ? void 0 : (_item$metaData6$tags = _item$metaData6.tags) === null || _item$metaData6$tags === void 0 ? void 0 : _item$metaData6$tags.indexOf("Webinar")) > -1 ? '<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>' : "", "\n\t\t\t</div>");
    },
    research: function research(item) {
      return "\n\t\t<div class=\"c-search-result\" data-rank=".concat(item.rank).concat(item.metaData.type ? ' data-result-type="' + item.metaData.type.toLowerCase() + '"' : "", ">\n\t\t\t<div>\n\t\t\t\t<div class=\"c-search-result__tags\"><span class=\"c-search-tag\">").concat(item.title.split(" | ").slice(0, 1).toString(), "</span></div>\n\t\t\t\t<div class=\"flex-container flex-dir-column u-gap u-mt-1\">\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\"><strong>\n\t\t\t\t\t\t<a href=\"").concat(stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl, "\">\n\t\t\t\t\t\t\t").concat(item.title.indexOf("|") > -1 ? item.title.split(" | ")[1] : item.title, "\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</strong></p>\n\t\t\t\t\t").concat(stir.String.stripHtml(item.metaData.c || "") ? "<div class=\"text-sm\">" + stir.String.stripHtml(item.metaData.c || "") + "</div>" : "", "\n          ").concat(stir.funnelback.getTags(item.metaData.category) ? "<div class=c-search-result__footer>" + stir.funnelback.getTags(item.metaData.category) + "</div>" : "", "\n        </div>\n\t\t\t\t<!-- p>12344</ -->\n\t\t\t</div>\n\t\t</div>");
    },
    cura: function cura(item) {
      return !item.messageHtml ? "<div class=\"c-search-result\" data-result-type=curated>\n\t\t\t\t<div class=c-search-result__body>\n\t\t\t\t\t<p class=\"c-search-result__breadcrumb\">".concat(item.displayUrl, "</p>\n\t\t\t\t\t<p class=\"u-text-regular u-m-0\"><strong>\n\t\t\t\t\t\t<a href=\"").concat(FB_BASE() + item.linkUrl, "\" title=\"").concat(item.displayUrl, "\">").concat(item.titleHtml, "</a>\n\t\t\t\t\t</strong></p>\n\t\t\t\t\t<p >").concat(item.descriptionHtml, "</p>\n\t\t\t\t\t<!-- <pre>").concat(JSON.stringify(item, null, "\t"), "</pre> -->\n\t\t\t\t</div>\n\t\t\t</div>") : "<div class=\"c-search-result-curated\" data-result-type=curated-message>\n\t\t\t\t".concat(item.messageHtml, "\n\t\t\t</div>");
    }
  };
}();
(function () {
  //const debug   = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  //const preview = UoS_env.name === "preview" ? true : false;
  //if(!(debug||preview)) return;
  var date_elements = Array.prototype.slice.call(document.querySelectorAll("[name=meta_startval]"));
  if (!date_elements.length) return;
  var months = [, "January",,,,,,,, "September",,,];
  var regex = new RegExp(/\d\d\d\d/);
  var ay = new RegExp(/AY\d\d\d\d\D\d\d/i);
  var delim = new RegExp(/ay/i);
  var dates = date_elements.map(function (date) {
    return {
      data: date.value,
      date: date.value.replace(ay, ""),
      month: date.value.indexOf("-") > -1 ? months[parseInt(date.value.split("-")[1])] || "" : "",
      year: date.value.match(regex) ? date.value.match(regex).shift() : "",
      acyear: date.value.match(ay) ? date.value.match(ay).shift().replace(delim, "") : ""
    };
  });
  var years = dates.map(function (date) {
    return date.acyear.replace(delim, "");
  }).filter(function (value, index, self) {
    return self.indexOf(value) === index && value;
  });
  var root = date_elements[0].parentElement.parentElement.parentElement; // remove checkboxes only if the years array is populated

  if (!years.length) return;
  date_elements.forEach(function (el) {
    el.parentElement.parentElement.remove();
  });

  var DateInput = function DateInput(type, name, value) {
    var input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    return input;
  };

  var DateLabel = function DateLabel(name, value) {
    var input = new DateInput("radio", "meta_startval", "[1st ".concat(value, "]"));
    var label = document.createElement("label");
    label.appendChild(input);
    label.appendChild(document.createTextNode(name));
    return label;
  };

  var picker = document.createElement("li");
  years.forEach(function (acyear) {
    // Array: get all dates relevant to this academic year
    var thisyear = dates.filter(function (date) {
      return date.acyear === acyear;
    }); // String: create a meta-search parameter of 'other' dates (i.e. neither Sept nor Jan)

    var other = thisyear.filter(function (date) {
      return date.date.indexOf("-01") === -1 && date.date.indexOf("-09") === -1;
    }).map(function (date) {
      return date.data;
    }).join(" "); // DOM: show heading

    var set = document.createElement("fieldset");
    var legend = document.createElement("legend");
    legend.classList.add("u-my-1", "text-xsm");
    set.appendChild(legend);
    set.setAttribute("class", "c-search-filters-subgroup");
    legend.innerText = "Academic year ".concat(acyear);
    picker.appendChild(set); // DOM: show conventional start dates (Sept, Jan)

    thisyear.filter(function (date) {
      return date.acyear === acyear && (date.date.indexOf("-01") > -1 || date.date.indexOf("-09") > -1);
    }).map(function (date) {
      set.appendChild(new DateLabel("".concat(date.month, " ").concat(date.year), date.data));
    }); // DOM: lastly show 'other' dates

    if (other.length) set.appendChild(new DateLabel("Other ".concat(acyear), "".concat(other)));
  });
  root.appendChild(picker);
})();
var stir = stir || {};
stir.searchUI = stir.searchUI || {};
/*
  Aside Accordion Transform Helper
  @author: ryankaye
  @version: 1.0
  @description: Transform an aside to an accordion (mobile folding)
*/

stir.searchUI.asideAccordion = function (filterNode, index) {
  console.log("hello");
  var header = filterNode.querySelector("p.c-search-filters-header");
  var body = filterNode.querySelector("div");

  if (header && body) {
    filterNode.setAttribute("data-behaviour", "accordion");
    var button = document.createElement("button");
    button.innerHTML = header.innerHTML;
    button.setAttribute("id", "filteraccordbtn_" + index);
    button.setAttribute("aria-controls", "filteraccordpanel_" + index);
    button.setAttribute("aria-expanded", "false");
    header.innerHTML = "";
    header.appendChild(button);
    body.setAttribute("id", "filteraccordpanel_" + index);
    body.setAttribute("aria-labelledby", "filteraccordbtn_" + index);
    body.setAttribute("role", "region");
    body.classList.add("hide");
    button.addEventListener("click", function (e) {
      body.classList.toggle("hide");
      body.classList.contains("hide") ? button.setAttribute("aria-expanded", "false") : button.setAttribute("aria-expanded", "true");
    });
  }
};
/* 
    Vertical Slider Component
    @author: ryankaye
    @version: 1.0
*/


stir.searchUI.verticalSlider = function (item, target) {
  /* buildNavDiv */
  var buildNavDiv = function buildNavDiv() {
    var div = document.createElement("div");
    div.classList.add("tns-controls");
    div.setAttribute("aria-label", "Carousel Navigation");
    div.setAttribute("tabindex", "0");
    return div;
  };
  /* buildNavButton */


  var buildNavButton = function buildNavButton(id, text, icon) {
    var btn = document.createElement("button");
    btn.innerHTML = '<span class="uos-' + icon + ' icon--medium "></span>';
    btn.setAttribute("data-controls", text);
    btn.setAttribute("aria-label", text);
    btn.setAttribute("type", "button");
    btn.setAttribute("tabindex", "-1");
    btn.setAttribute("aria-controls", id);
    return btn;
  };
  /* Build the full Button + wrapper + listener */


  var buildNavElement = function buildNavElement(containerId, text, icon) {
    var div = buildNavDiv();
    var btn = buildNavButton(containerId, text, icon);
    div.insertAdjacentElement("beforeend", btn);
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      verticalSlider.goTo(text);
    });
    return div;
  };
  /* initSlider */


  var initSlider = function initSlider(container) {
    if (!container) return;
    var divPrev = buildNavElement(container.id, "prev", "chevron-up");
    var divNext = buildNavElement(container.id, "next", "chevron-down");
    container.parentElement.parentElement.insertAdjacentElement("afterend", divNext);
    container.parentElement.parentElement.insertAdjacentElement("beforebegin", divPrev);
    target.parentElement.setAttribute("data-inittns", "");
  };
  /* Config */


  var verticalSlider = tns({
    container: item,
    controls: false,
    loop: false,
    slideBy: 7,
    items: 7,
    axis: "vertical",
    autoHeight: false,
    touch: true,
    swipeAngle: 30,
    speed: 400
  });
  verticalSlider && initSlider(verticalSlider.getInfo().container);
};
/* 
  Slider Aria Helper
  @author: ryankaye
  @version: 1.0
  @description: Add Aria Labels to a slider after its initialised 
*/


stir.searchUI.sliderArias = function (node) {
  if (!node) return;
  setTimeout(function () {
    var controlsPrevious = node.querySelector('[data-controls="prev"]');
    var controlsNext = node.querySelector('[data-controls="next"]');
    controlsPrevious && controlsPrevious.setAttribute("aria-label", "Previous");
    controlsNext && controlsNext.setAttribute("aria-label", "Next");
    return true;
  }, 100);
};
/*
   Slide Tab Component
   @author: ryankaye
   @version: 1.0
 */


stir.searchUI.slideTab = function (scope) {
  if (!scope) return;
  var nodes = {
    slideBox: scope,
    slideNavBox: scope.querySelector("[data-searchbtnstns]"),
    slideNavBtns: Array.prototype.slice.call(scope.querySelectorAll("[data-searchbtnstns] h2 button")),
    slideResultTabs: Array.prototype.slice.call(scope.querySelectorAll("#mySlider1 > div")),
    accordions: Array.prototype.slice.call(scope.querySelectorAll("[data-behaviour=accordion]"))
  };
  if (!nodes.slideNavBox || !nodes.slideNavBtns || !nodes.slideResultTabs) return;
  /* initTabs */

  var initTabs = function initTabs(nodes) {
    var sliderNav = tns({
      container: "#" + nodes.slideNavBox.id,
      items: calcItemsToShow(stir.MediaQuery.current),
      loop: false,
      slideBy: "page",
      controls: true,
      controlsText: ['<span class="uos-chevron-left icon--medium "></span>', '<span class="uos-chevron-right icon--medium "></span>'],
      touch: true,
      swipeAngle: 30,
      navPosition: "top",
      autoHeight: true,
      autoplay: false
    });
    nodes.slideNavBox.setAttribute("role", "tablist");
    stir.searchUI.sliderArias(nodes.slideBox);
    nodes.slideNavBtns.forEach(function (item) {
      item.closest("h2").style.width = "90px"; // item.offsetWidth + "px";
      //item.setAttribute("role", "tab");

      item.closest("div.tns-item").setAttribute("role", "tab");
      item.setAttribute("tabindex", "-1");
      item.setAttribute("type", "button");
      item.setAttribute("aria-controls", "search_results_panel_" + item.getAttribute("data-open"));
      item.setAttribute("id", "searchtab_" + item.getAttribute("data-open"));
    });
    nodes.slideResultTabs.forEach(function (item) {
      item.setAttribute("role", "tabpanel");
      item.setAttribute("tabindex", "0");
      item.setAttribute("id", "search_results_panel_" + item.getAttribute("data-panel"));
      item.setAttribute("aria-labelledby", "searchtab_" + item.getAttribute("data-panel"));
    });
    var open = QueryParams.get("tab") ? QueryParams.get("tab") : "all";
    var btnActive = scope.querySelector("button[data-open=" + open + "]");
    if (nodes.slideNavBox && nodes.slideNavBox.classList.contains("hide-no-js")) nodes.slideNavBox.classList.remove("hide-no-js");

    if (btnActive) {
      btnActive.click();
      if (nodes.slideNavBtns.indexOf(btnActive) >= calcItemsToShow(stir.MediaQuery.current)) sliderNav.goTo(nodes.slideNavBtns.indexOf(btnActive));
    }
  };
  /* calcItemsToShow */


  var calcItemsToShow = function calcItemsToShow(size) {
    if (size === "small") return 3;
    if (size === "medium") return 4;
    return nodes.slideNavBtns.length;
  };
  /* controlSticky */


  var controlSticky = function controlSticky() {
    var top = nodes.slideBox.getBoundingClientRect().top;
    top < 0.01 && nodes.slideBox.classList.add("stuck");
    top > 0 && nodes.slideBox.classList.remove("stuck");
  };
  /* handleTabClick */


  var handleTabClick = function handleTabClick(e) {
    var btn = e.target.closest("button[data-open]");
    if (!btn) return;
    var open = btn.getAttribute("data-open") || "null";
    var panel = stir.node('[data-panel="' + open + '"]');
    nodes.slideNavBtns.forEach(function (item) {
      item.parentElement.classList.remove("slide-tab--active");
    });
    btn.closest("h2").classList.add("slide-tab--active");
    nodes.slideResultTabs.forEach(function (el) {
      el.classList.add("hide");
      el.setAttribute("aria-hidden", "true");

      if (el.getAttribute("data-panel") === open) {
        el.classList.remove("hide");
        el.removeAttribute("aria-hidden");
      }
    });
    panel.classList.remove("hide");
    panel.removeAttribute("aria-hidden");
    stir.scrollToElement && stir.scrollToElement(nodes.slideBox, 0); // only set tab on user-clicks, not scripted ones

    if (e.isTrusted) QueryParams.set("tab", open);
  };
  /* throttle */


  function throttle(callback, limit) {
    var wait = false;
    return function () {
      if (!wait) {
        callback.call();
        wait = true;
        setTimeout(function () {
          wait = false;
        }, limit);
      }
    };
  }
  /*
    Event Listeners
  */


  document.addEventListener("scroll", throttle(controlSticky, 200));
  nodes.slideNavBox.addEventListener("click", handleTabClick);
  window.addEventListener("popstate", function (ev) {
    return initTabs(nodes);
  }); // reinit tabs on history navigation (back/forward)

  initTabs(nodes);
};
/*
    O N   L O A D   E V E N T S
 */


(function () {
  /* 
    IE Guard Clause 
  */
  if ("undefined" === typeof window.URLSearchParams) return;
  /*
    Find all vertical sliders 
    and initialte them
   */

  var handleAccordionClick = function handleAccordionClick(e) {
    if (e.target.parentElement.dataset.containtns === "" && e.target.parentElement.dataset.inittns !== "") {
      var item = e.target.parentElement.nextElementSibling.children[0];
      if (item) stir.searchUI.verticalSlider(item, e.target);
    }
  };

  stir.nodes('[data-containtns=""]').forEach(function (item) {
    item.children[0].addEventListener("click", handleAccordionClick);
  });
  /*
    Find all Slide Tabs Components 
    and initialise them
   */

  var slideTabs = stir.nodes(".c-search-results-area");
  if (slideTabs.length) slideTabs.forEach(function (item) {
    return stir.searchUI.slideTab(item);
  });
  /*
    Find all mobile filter accordions 
    and initialise them 
   */

  var filterNodes = stir.nodes(".c-search-results-filters");

  if (stir.MediaQuery.current === "small" || stir.MediaQuery.current === "medium") {
    if (filterNodes.length) {
      filterNodes.forEach(function (element, index) {
        return stir.searchUI.asideAccordion(element, index);
      });
    }
  }
})();
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var stir = stir || {};
/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 2 (Non jQuery. Non Searchbox. Non broken)
 * ------------------------------------------------ */

stir.funnelback = function () {
  var debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false; //const hostname = 'stage-shared-15-24-search.clients.uk.funnelback.com';
  //const hostname = 'shared-15-24-search.clients.uk.funnelback.com';

  var hostname = debug || UoS_env.name === "preview" ? "stage-shared-15-24-search.clients.uk.funnelback.com" : "search.stir.ac.uk"; //const hostname = 'search.stir.ac.uk';

  var url = "https://".concat(hostname, "/s/");

  var getJsonEndpoint = function getJsonEndpoint() {
    return new URL("search.json", url);
  };

  var getScaleEndpoint = function getScaleEndpoint() {
    return new URL("scale", url);
  };

  var getHostname = function getHostname() {
    return hostname;
  };

  var renderImgTag = function renderImgTag(image) {
    return "<img src=\"".concat(image.src, "\" alt=\"").concat(image.alt, "\" height=\"").concat(image.height, "\" width=\"").concat(image.width, "\" loading=lazy data-original=").concat(image.original, ">");
  };

  var resolveHref = function resolveHref(url, parameters) {
    url.search = new URLSearchParams(parameters);
    return url;
  }; //const resolveHref = stir.curry((url, parameters) => {url.search = new URLSearchParams(parameters); return url});
  //const resolveImgHref = resolveHref(getScaleEndpoint)


  var getCroppedImageElement = function getCroppedImageElement(parameters) {
    if (!parameters.url) return "<!-- no image -->";
    var url = resolveHref(getScaleEndpoint(), stir.Object.extend({}, parameters, {
      type: "crop_center",
      format: "jpeg"
    }));
    return renderImgTag({
      src: url,
      alt: parameters.alt,
      width: Math.floor(parameters.width / 2),
      height: Math.floor(parameters.height / 2),
      original: parameters.url
    });
  };

  var getTags = function getTags(tagMeta) {
    var tagGroups = tagMeta && tagMeta.split(";");
    return tagGroups && tagGroups.map(stir.templates.search.tagGroup).join("");
  };

  var imgError = function imgError(error) {
    //debug && console.error('[Search] There was an error loading a thumbnail image.', error.target.src);
    if (error.target.getAttribute("data-original") && error.target.getAttribute("src") != error.target.getAttribute("data-original")) {
      //debug && console.error('[Search] …reverting to original image: ', error.target.getAttribute('data-original'));
      error.target.src = error.target.getAttribute("data-original");
    } else {
      var _error$target$parentE, _error$target$parentE2;

      //debug && console.error('[Search] …no alternative image available. It will be removed.');
      (_error$target$parentE = error.target.parentElement.parentElement) === null || _error$target$parentE === void 0 ? void 0 : (_error$target$parentE2 = _error$target$parentE.classList) === null || _error$target$parentE2 === void 0 ? void 0 : _error$target$parentE2.remove("c-search-result__with-thumbnail");
      error.target.parentElement.parentElement.removeChild(error.target.parentElement);
    }
  };

  return {
    getHostname: getHostname,
    getJsonEndpoint: getJsonEndpoint,
    getScaleEndpoint: getScaleEndpoint,
    getCroppedImageElement: getCroppedImageElement,
    getTags: getTags,
    imgError: imgError
  };
}();

stir.courses = function () {
  var debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  /**
   * C L E A R I N G
   */

  var CLEARING = false; // set TRUE if Clearing is OPEN; otherwise FALSE

  /*
   **/

  return {
    clearing: CLEARING,
    getCombos: function getCombos() {
      var _stir$t4Globals, _stir$t4Globals$searc;

      if (stir.courses.combos) return;
      var urls = {
        dev: "combo.json",
        qa: "combo.json",
        preview: (stir === null || stir === void 0 ? void 0 : (_stir$t4Globals = stir.t4Globals) === null || _stir$t4Globals === void 0 ? void 0 : (_stir$t4Globals$searc = _stir$t4Globals.search) === null || _stir$t4Globals$searc === void 0 ? void 0 : _stir$t4Globals$searc.combos) || "",
        prod: "https://www.stir.ac.uk/media/stirling/feeds/combo.json"
      };
      debug && console.info("[Search] Getting combo data for ".concat(UoS_env.name, " environment (").concat(urls[UoS_env.name], ")"));
      return stir.getJSON(urls[UoS_env.name], function (data) {
        return stir.courses.combos = data && !data.error ? data.slice(0, -1) : [];
      });
    },
    showCombosFor: function showCombosFor(url) {
      if (!url || !stir.courses.combos) return [];
      var pathname = isNaN(url) && new URL(url).pathname;
      var combos = [];

      for (var i = 0; i < stir.courses.combos.length; i++) {
        for (var j = 0; j < stir.courses.combos[i].courses.length; j++) {
          if (pathname && pathname === stir.courses.combos[i].courses[j].url || stir.courses.combos[i].courses[j].url.split("/").slice(-1) == url) {
            var combo = stir.clone(stir.courses.combos[i]);
            combo.courses.splice(j, 1); // remove matching entry

            combo.courses = combo.courses.filter(function (item) {
              return item.text;
            }); // filter out empties

            combos.push(combo);
            break;
          }
        }
      }

      return combos;
    }
  };
}();

stir.search = function () {
  // abandon before anything breaks in IE
  if ("undefined" === typeof window.URLSearchParams) {
    var el = document.querySelector(".c-search-results-area");
    el && el.parentElement.removeChild(el);
    return;
  }

  var debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  var NUMRANKS = "small" === stir.MediaQuery.current ? 5 : 10;
  var MAXQUERY = 256;
  var CLEARING = stir.courses.clearing; // Clearing is open?

  debug && console.info("[Search] initialising…");
  var buildUrl = stir.curry(function (url, parameters) {
    url.search = new URLSearchParams(parameters);
    return url;
  });
  /* this is really the default parameters for a given search type */

  var getParameters = stir.curry(function (fixed, state) {
    return stir.Object.extend({}, fixed, state);
  });
  /* this is for adding in the filters (e.g. courses, sorting) */

  var addMoreParameters = function addMoreParameters(url, formData) {
    var a = new URLSearchParams(formData);

    var _iterator = _createForOfIteratorHelper(new URLSearchParams(url.search)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        a.set(key, value);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    url.search = a;
    return url;
  };

  var LoaderButton = function LoaderButton() {
    var button = document.createElement("button");
    button.innerText = "Load more results";
    button.setAttribute("class", "button hollow tiny");
    return button;
  };

  var meta = {
    main: ["c", "d", "access", "award", "biogrgaphy", "breadcrumbs", "category", "custom", "delivery", "faculty", "group", "h1", "image", "imagealt", "level", "modes", "online", "pathways", "role", "register", "sid", "start", "startDate", "subject", "tags", "type", "ucas", "venue", "profileCountry", "profileCourse1", "profileImage"],
    courses: ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"],
    clearing: CLEARING ? ["clearingEU", "clearingInternational", "clearingRUK", "clearingScotland", "clearingSIMD"] : []
  }; //console.info("Clearing is " + (CLEARING ? "open" : "closed"));
  //console.info(meta.clearing);

  var constants = {
    url: stir.funnelback.getJsonEndpoint(),
    form: document.querySelector("form.x-search-redevelopment"),
    input: document.querySelector('form.x-search-redevelopment input[name="query"]'),
    parameters: {
      any: {
        collection: "stir-main",
        SF: "[".concat(meta.main.concat(meta.clearing).join(","), "]"),
        num_ranks: NUMRANKS,
        query: "",
        spelling: true,
        explain: true,
        sortall: true,
        sort: "score_ignoring_tiers",
        "cool.21": 0.9
      },
      news: {
        collection: "stir-www",
        meta_type: "News",
        sort: "date",
        fmo: "true",
        SF: "[c,d,h1,image,imagealt,tags]",
        num_ranks: NUMRANKS,
        SBL: 450
      },
      event: {
        collection: "stir-events",

        /* meta_type: 'Event', */

        /* sort: 'metastartDate', */

        /* meta_d1: stir.Date.funnelbackDate(new Date()), */
        fmo: true,
        SF: "[c,d,image,imagealt,startDate,venue,online,tags,type,register]",
        query: "!padrenullquery",
        num_ranks: NUMRANKS
      },
      gallery: {
        collection: "stir-www",
        meta_type: "Gallery",
        sort: "date",
        fmo: "true",
        SF: "[c,d,image]",
        num_ranks: NUMRANKS
      },
      course: {
        collection: "stir-courses",
        SF: "[".concat(meta.courses.concat(meta.clearing).join(","), "]"),
        fmo: "true",
        num_ranks: NUMRANKS,
        explain: true,
        query: "!padrenullquery",
        timestamp: +new Date()
      },
      coursemini: {
        collection: "stir-courses",
        SF: "[c,award,code,delivery,faculty,image,level,modes,sid,start,subject,teaser,ucas]",
        num_ranks: 3,
        curator: "off",
        query: "!padrenullquery"
      },
      person: {
        collection: "stir-research",
        meta_type: "profile",
        fmo: "true",

        /* sort: "metalastname", */
        SF: "[c,d,biogrgaphy,category,faculty,groups,image,imagealt,programme,role,themes]",
        SM: "meta",
        MBL: 350,
        // metadata buffer length
        num_ranks: NUMRANKS
      },
      research: {
        collection: "stir-research",
        SM: "meta",
        SF: "[c,d,category,groups,output,programme,themes,type]",
        MBL: 450,
        // metadata buffer length
        num_ranks: NUMRANKS
      }
    },
    // extra parameters for no-query searches
    noquery: {
      course: {
        sort: "title" // if no keywords supplied, sort courses 
        // by title instead of "relevance"
        //		},
        //		person: {
        //			sort: "meta_surname"	//sort people by surname
        //		},
        //		event: {
        //			sort: "adate"	// sort events by date descending 

      }
    }
  };
  if (!constants.form || !constants.form.query) return;
  debug && console.info("[Search] initialised.");

  var getQuery = function getQuery(type) {
    return constants.form.query.value || QueryParams.get("query") || constants.parameters[type].query || "University of Stirling";
  };

  var getNoQuery = function getNoQuery(type) {
    return constants.form.query.value ? {} : constants.noquery[type];
  };

  var setQuery = function setQuery() {
    return constants.form.query.value ? QueryParams.set("query", constants.form.query.value) : QueryParams.remove("query");
  };

  var getPage = function getPage(type) {
    return parseInt(QueryParams.get(type) || 1);
  };

  var getType = function getType(element) {
    return element.getAttribute("data-type") || element.parentElement.getAttribute("data-type");
  };

  var nextPage = function nextPage(type) {
    return QueryParams.set(type, parseInt(QueryParams.get(type) || 1) + 1);
  };

  var calcStart = function calcStart(page, numRanks) {
    return (page - 1) * numRanks + 1;
  };

  var calcPage = function calcPage(currStart, numRanks) {
    return Math.floor(currStart / numRanks + 1);
  };

  var calcProgress = function calcProgress(currEnd, fullyMatching) {
    return currEnd / fullyMatching * 100;
  };

  var getStartRank = function getStartRank(type) {
    return calcStart(getPage(type), constants.parameters[type].num_ranks || 20);
  };

  var resetPagination = function resetPagination() {
    return Object.keys(constants.parameters).forEach(function (key) {
      return QueryParams.remove(key);
    });
  }; //	const getFormElementValues = type => {
  //		const form = document.querySelector('.c-search-results-area form[data-filters='+type+']');
  //		const filters = [];
  //		const values = [];
  //
  //		if(form) {
  //			Array.prototype.slice.call(form.elements).filter(element=>element.name).forEach(el=>{
  //				console.info(el.name, el.type);
  //			});
  //			const elements = Array.prototype.slice.call(form.elements).filter(element=>element.name);
  //			elements.forEach(
  //				element => {
  //					if((element.type==='checkbox'||element.type==='radio')&&element.checked)
  //					if(filters.indexOf(element.name)===-1) {
  //						filters.push(element.name);
  //						values.push([element.value]);
  //					} else {
  //						values[filters.indexOf(element.name)].push(element.value);
  //					}
  //				}
  //			);
  //		}
  //
  //		return {filters: filters, values:values};
  //
  //	};

  /* if(filters.length>0){
  filters.forEach((filter,i)=>{
  a.append(filter,values[i].length===1?values[i]:`[${values[i].join(' ')}]`);
  })
  } */


  var getFormData = function getFormData(type) {
    var form = document.querySelector(".c-search-results-area form[data-filters=" + type + "]");
    var a = form ? new FormData(form) : new FormData();

    var _iterator2 = _createForOfIteratorHelper(a.keys()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var key = _step2.value;
        a.getAll(key).length > 1 && a.set(key, "[" + a.getAll(key).join(" ") + "]");
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return a;
  };

  var getInboundQuery = function getInboundQuery() {
    if (undefined !== QueryParams.get("query")) constants.form.query.value = QueryParams.get("query").substring(0, MAXQUERY);
    var parameters = QueryParams.getAll();

    for (var name in parameters) {
      var _el = document.querySelector("input[name=\"".concat(encodeURIComponent(name), "\"][value=\"").concat(encodeURIComponent(parameters[name]), "\"]"));

      if (_el) _el.checked = true;
    }
  };

  var setUrlToFilters = function setUrlToFilters(type) {//const {filters, values} = getFormElementValues(type);
    //debug && filters.forEach((filter,i)=>QueryParams.set(filter, values[i]));
    //TODO: un-set any URL params that have corresponding <input> elements that are NOT checked
    // (but ignore any params that aren't related to the filters)
  }; // DOM modifiers:


  var appendHtml = stir.curry(function (_element, html) {
    return _element.insertAdjacentHTML("beforeend", html);
  });
  var replaceHtml = stir.curry(function (_element, html) {
    return _element.innerHTML = html;
  }); // enable the "load more" button if there are more results that can be shown

  var enableLoadMore = stir.curry(function (button, data) {
    if (!button) return data;
    if (data.response.resultPacket.resultsSummary.totalMatching > 0) button.removeAttribute("disabled");
    if (data.response.resultPacket.resultsSummary.currEnd === data.response.resultPacket.resultsSummary.totalMatching) button.setAttribute("disabled", true);
    return data;
  }); // "reflow" events and handlers for dynamically added DOM elements

  var flow = stir.curry(function (_element, data) {
    Array.prototype.forEach.call(_element.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
      return new stir.accord(accordion, false);
    });
    Array.prototype.forEach.call(_element.querySelectorAll("img"), function (image) {
      image.addEventListener("error", stir.funnelback.imgError);
    });
  });
  var updateStatus = stir.curry(function (element, data) {
    element.setAttribute("data-page", calcPage(data.response.resultPacket.resultsSummary.currStart, data.response.resultPacket.resultsSummary.numRanks));
    var summary = element.parentElement.parentElement.querySelector(".c-search-results-summary");
    summary && (summary.innerHTML = stir.templates.search.summary(data));
    return data; // data pass-thru so we can compose() this function
  });
  var renderResultsWithPagination = stir.curry(function (type, data) {
    return (
      /*       (debug
              ? `<details class=debug>
      			<summary>query debug data</summary>
      			<pre class=debug data-label="user query">${stir.String.htmlEntities(JSON.stringify(data.response.resultPacket.queryCleaned, null, "  "))}</pre>
      			<pre class=debug data-label="queryAsProcessed by FB">${JSON.stringify(data.response.resultPacket.queryAsProcessed, null, "  ")}</pre>
      			<pre class=debug data-label=curator>${JSON.stringify(data?.response?.curator, null, "  ")}</pre>
      			<pre class=debug data-label=metaParameters>${JSON.stringify(data.question.metaParameters, null, "  ")}</pre>
      		</details></div>
      		`
              : "") + */
      renderers["cura"](data.response.curator.exhibits) + renderers[type](data.response.resultPacket.results) + stir.templates.search.pagination({
        currEnd: data.response.resultPacket.resultsSummary.currEnd,
        totalMatching: data.response.resultPacket.resultsSummary.totalMatching,
        progress: calcProgress(data.response.resultPacket.resultsSummary.currEnd, data.response.resultPacket.resultsSummary.totalMatching)
      }) + (footers[type] ? footers[type]() : "")
    );
  });
  /**
   * Custom behaviour in the event of no results
   **/

  var fallback = function fallback(element) {
    if (!element || !element.hasAttribute("data-fallback")) return false;
    var template = document.getElementById(element.getAttribute("data-fallback"));
    var html = template && (template.innerHTML || "");
    element.innerHTML = html;
    return true;
  };

  var setFBParameters = buildUrl(constants.url); // This is the core search function that talks to Funnelback

  var callSearchApi = stir.curry(function (type, callback) {
    var getFBParameters = getParameters(constants.parameters[type]); // curry-in fixed params

    var parameters = getFBParameters(stir.Object.extend({}, {
      // session params:
      start_rank: getStartRank(type),
      query: getQuery(type),
      // get actual query, or fallback, etc
      curator: getStartRank(type) > 1 ? false : true // only show curator for initial searches

    }, getNoQuery(type) // get special "no query" parameters (sorting, etc.)
    )); //TODO if type==course and query=='!padrenullquery' then sort=title

    var url = addMoreParameters(setFBParameters(parameters), getFormData(type)); //debug && console.info('[Search] URL:');

    debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
  }); // A "Meta" version of search() i.e. a search without
  // a querysting, but with some metadata fields set:
  // used for the "Looking for…?" sidebar.

  var callSearchApiMeta = stir.curry(function (type, callback) {
    var query = getQuery(type).trim();
    var getFBParameters = getParameters(constants.parameters[type]); // curry-in fixed params
    // TODO: consider passing in the meta fields?

    var parameters = getFBParameters({
      start_rank: getStartRank(type),
      query: "[t:".concat(query, " c:").concat(query, " subject:").concat(query, "]")
    });
    var url = addMoreParameters(setFBParameters(parameters), getFormData(type));
    debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
  });

  var search = function search(element) {
    element.innerHTML = "";

    if (element.hasAttribute("data-infinite")) {
      var resultsWrapper = document.createElement("div");
      var buttonWrapper = document.createElement("div");
      var button = new LoaderButton();
      button.setAttribute('disabled', true);
      button.addEventListener("click", function (event) {
        return getMoreResults(resultsWrapper, button);
      });
      element.appendChild(resultsWrapper);
      element.appendChild(buttonWrapper);
      buttonWrapper.appendChild(button);
      buttonWrapper.setAttribute("class", "c-search-results__loadmore flex-container align-center u-mb-2");
      getInitialResults(resultsWrapper, button);
    } else {
      getInitialResults(element);
    }
  };

  var searches = Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")); // group the curried search functions so we can easily refer to them by `type`

  var searchers = {
    any: callSearchApi("any"),
    news: callSearchApi("news"),
    event: callSearchApi("event"),
    gallery: callSearchApi("gallery"),
    course: callSearchApi("course"),
    coursemini: callSearchApiMeta("coursemini"),
    person: callSearchApi("person"),
    research: callSearchApi("research")
  }; // group the renderer functions so we can get them easily by `type`

  var renderers = {
    any: function any(data) {
      return data.map(stir.templates.search.auto).join("");
    },
    news: function news(data) {
      return data.map(stir.templates.search.news).join("");
    },
    event: function event(data) {
      return data.map(stir.templates.search.event).join("");
    },
    gallery: function gallery(data) {
      return data.map(stir.templates.search.gallery).join("");
    },
    course: function course(data) {
      return data.map(stir.templates.search.course).join("");
    },
    coursemini: function coursemini(data) {
      return data.map(stir.templates.search.coursemini).join("");
    },
    person: function person(data) {
      return data.map(stir.templates.search.person).join("");
    },
    research: function research(data) {
      return data.map(stir.templates.search.research).join("");
    },
    cura: function cura(data) {
      return data.map(stir.templates.search.cura).join("");
    }
  };
  var footers = {
    coursemini: function coursemini() {
      return "<p class=\"text-center\"><a href=\"?tab=courses&query=".concat(getQuery("any"), "\">View all course results</a></p>");
    }
  };
  var prefetch = {
    course: function course(callback) {
      var xmlHttpRequest = stir.courses.getCombos();

      if (xmlHttpRequest) {
        xmlHttpRequest.addEventListener("loadend", callback); // loadend should fire after load OR error
      } else {
        callback.call();
      }
    }
  }; // triggered automatically, and when the search results need re-initialised (filter change, query change etc).

  var getInitialResults = function getInitialResults(element, button) {
    var type = getType(element);
    if (!searchers[type]) return;
    var status = updateStatus(element);
    var more = enableLoadMore(button);
    var replace = replaceHtml(element);
    var render = renderResultsWithPagination(type);
    var reflow = flow(element);
    var composition = stir.compose(reflow, replace, render, more, status);

    var callback = function callback(data) {
      if (!element || !element.parentElement) {
        return debug && console.error("[Search] late callback, element no longer on DOM");
      } //TODO intercept no-results and spelling suggestion here. Automatically display alternative results?


      if (!data || data.error || !data.response || !data.response.resultPacket) return;
      if (0 === data.response.resultPacket.resultsSummary.totalMatching && fallback(element)) return;
      return composition(data);
    };

    resetPagination(); // if necessary do a prefetch and then call-back to the search function.
    // E.g. Courses needs to prefetch the combinations data

    if (prefetch[type]) return prefetch[type](function (event) {
      return searchers[type](callback);
    }); // if no prefetch, just call the search function now:

    searchers[type](callback);
  }; // triggered by the 'load more' buttons. Fetches new results and APPENDS them.


  var getMoreResults = function getMoreResults(element, button) {
    var type = getType(element);
    if (!searchers[type]) return;
    var status = updateStatus(element);
    var append = appendHtml(element);
    var render = renderResultsWithPagination(type);
    var reflow = flow(element);
    var composition = stir.compose(reflow, append, render, enableLoadMore(button), status);

    var callback = function callback(data) {
      return data && !data.error ? composition(data) : new Function();
    };

    nextPage(type);
    searchers[type](callback);
  }; // initialise all search types on the page (e.g. when the query keywords are changed byt the user):


  var initialSearch = function initialSearch() {
    return searches.forEach(search);
  }; // CHANGE event handler for search filters.
  // Also handles the RESET event.


  Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"), function (form) {
    var type = form.getAttribute("data-filters");
    var element = document.querySelector(".c-search-results[data-type=\"".concat(type, "\"]"));
    form.addEventListener("reset", function (event) {
      // native RESET is async so we need to do it manually
      // to ensure it's done synchonosly instead…
      Array.prototype.forEach.call(form.querySelectorAll("input"), function (input) {
        return input.checked = false;
      }); // Only *after* the form has been reset, we can re-run the
      // search function. (That's why native RESET is no good).

      search(element);
    });
    form.addEventListener("change", function (event) {
      setUrlToFilters(getType(element));
      search(element);
    }); // Just in case, we'll also catch any
    // SUBMIT events that might be triggered:

    form.addEventListener("submit", function (event) {
      search(element);
      event.preventDefault();
    });
  }); // Click-delegate for status panel (e.g. misspellings, dismiss filters, etc.)

  Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"), function (statusPanel) {
    statusPanel.addEventListener("click", function (event) {
      if (event.target.hasAttribute("data-suggest")) {
        event.preventDefault();
        constants.input.value = event.target.innerText;
        setQuery();
        initialSearch();
      } else if (event.target.hasAttribute("data-value")) {
        var selector = "input[name=\"".concat(event.target.getAttribute("data-name"), "\"][value=\"").concat(event.target.getAttribute("data-value"), "\"]");
        var input = document.querySelector(selector);

        if (input) {
          input.checked = !input.checked;
          event.target.parentElement.removeChild(event.target);
          initialSearch();
        } else {
          var sel2 = "select[name=\"".concat(event.target.getAttribute("data-name"), "\"]");
          var select = document.querySelector(sel2);

          if (select) {
            select.selectedIndex = 0;
            event.target.parentElement.removeChild(event.target);
            initialSearch();
          }
        }
      }
    });
  });
  /**
   * Running order for search:
   * get url
   *  - host
   *  - fixed parameters (from form)
   *  - variable parameters (from page query string)
   * prefetch (e.g. course combo data)
   * fetch results from funnelback
   * process and filter data
   * render results via templates
   * send out to the page DOM
   * load more results on-demand
   */

  var submit = function submit(event) {
    setQuery();
    initialSearch();
    event.preventDefault();
  };

  var init = function init(event) {
    getInboundQuery();
    constants.form.addEventListener("submit", submit);
    initialSearch();
  };

  init();
  window.addEventListener("popstate", init);
};

stir.search();